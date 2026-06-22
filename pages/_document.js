import { Html, Head, Main, NextScript } from "next/document";
import { SITE_FAVICON } from "../lib/pwaConfig";

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        <link rel="icon" href={SITE_FAVICON} sizes="any" />
        <link rel="shortcut icon" href={SITE_FAVICON} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </Html>
  );
}
