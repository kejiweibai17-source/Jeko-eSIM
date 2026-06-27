import NextAuth, { type NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

function log(step: string, detail?: unknown) {
  const ts = new Date().toISOString();
  if (detail !== undefined) {
    console.log(`[Auth Debug] ${ts} | ${step}`, detail);
  } else {
    console.log(`[Auth Debug] ${ts} | ${step}`);
  }
}

// 啟動時印一次環境摘要（Vercel Functions Logs 可見）
log("NextAuth 模組載入", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(未設定)",
  VERCEL_ENV: process.env.VERCEL_ENV || "(本機)",
  hasLineId: !!process.env.LINE_CLIENT_ID,
  hasLineSecret: !!process.env.LINE_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasSupabaseAdmin: !!supabaseAdmin,
  expectedCallback: process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL.replace(/\/$/, "")}/api/auth/callback/line`
    : "(無法推算)",
});

function isDuplicateUserError(message = "") {
  const lower = message.toLowerCase();
  return (
    lower.includes("already") ||
    lower.includes("registered") ||
    lower.includes("duplicate") ||
    lower.includes("exists")
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      log("callback.signIn 開始", {
        provider: account?.provider,
        providerAccountId: account?.providerAccountId,
        userEmail: user?.email,
        userName: user?.name,
      });

      if (account?.provider !== "line") {
        log("callback.signIn 非 LINE，直接通過");
        return true;
      }

      if (!supabaseAdmin) {
        log("callback.signIn 失敗：Supabase Admin 未初始化", {
          hasUrl: !!supabaseUrl,
          hasServiceRole: !!serviceRoleKey,
        });
        return false;
      }

      const email = user.email || `${account.providerAccountId}@line-login.com`;
      const name = user.name || "LINE 會員";

      log("callback.signIn 準備同步 Supabase", { email, name, profile });

      try {
        const { data, error: createError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: {
              full_name: name,
              line_id: account.providerAccountId,
              avatar_url: user.image,
            },
            password: crypto.randomBytes(16).toString("hex") + "A1@",
          });

        if (createError) {
          if (isDuplicateUserError(createError.message)) {
            log("callback.signIn Supabase 使用者已存在，允許登入", {
              email,
              msg: createError.message,
            });
            return true;
          }
          log("callback.signIn Supabase createUser 失敗 → AccessDenied", {
            email,
            error: createError.message,
            status: createError.status,
          });
          return false;
        }

        log("callback.signIn Supabase 新使用者建立成功", {
          email,
          userId: data?.user?.id,
        });
        return true;
      } catch (error) {
        log("callback.signIn Supabase 例外 → AccessDenied", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account) {
        log("callback.jwt 收到 account", {
          provider: account.provider,
          type: account.type,
        });
        token.accessToken = account.access_token;
      }
      if (user) {
        log("callback.jwt 寫入 user", { id: user.id, email: user.email });
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        if (!session.user.email) {
          session.user.email = `${token.sub}@line-login.com`;
        }
      }
      log("callback.session", {
        email: session?.user?.email,
        tokenSub: token?.sub,
      });
      return session;
    },
  },
  events: {
    async signIn(message) {
      log("event.signIn 成功", {
        user: message.user?.email,
        provider: message.account?.provider,
        isNewUser: message.isNewUser,
      });
    },
    async signOut(message) {
      log("event.signOut", { session: !!message.session });
    },
  },
  pages: {
    error: "/login",
  },
  debug: true,
};

export default NextAuth(authOptions);
