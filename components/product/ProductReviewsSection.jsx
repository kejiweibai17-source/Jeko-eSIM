"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import MaterialIcon from "../MaterialIcon";
import { supabase } from "../../lib/supabaseClient";
import { isAdminEmail } from "../../lib/productAdminConfig";
import "swiper/css";
import "swiper/css/navigation";

const VIDEO_REGEX = /\.(mp4|webm|mov|m4v|avi|mkv|qt)$/i;
const MAX_MEDIA = 4;

function isVideoUrl(url) {
  return VIDEO_REGEX.test(url || "");
}

function StarRow({ value, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <MaterialIcon
          key={i}
          name="star"
          size={size}
          filled={i < value}
          className={i < value ? "text-neutral-800" : "text-neutral-300"}
        />
      ))}
    </span>
  );
}

function ReviewMediaGrid({ urls, onOpen }) {
  if (!urls?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-8 mt-6">
      {urls.map((url, i) => {
        const isVideo = isVideoUrl(url);
        const label = isVideo ? `影片 ${i + 1}` : `照片 ${i + 1}`;
        return (
          <button
            key={url + i}
            type="button"
            onClick={() => onOpen(urls, i)}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-sm"
          >
            <div className="aspect-[4/3] bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-0.5">
              {isVideo ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={url}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="mt-3 text-xs text-neutral-500 font-serif tracking-wide">
              {label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviewsSection({ productId }) {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [gallery, setGallery] = useState({
    isOpen: false,
    mediaUrls: [],
    initialSlide: 0,
  });

  const isAdmin = isAdminEmail(currentUser?.email);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (data) {
      const mainReviews = data.filter((r) => !r.parent_id);
      const replyData = data.filter((r) => r.parent_id);
      const replyMap = {};
      replyData.forEach((r) => {
        if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
        replyMap[r.parent_id].push(r);
      });
      setReviews(mainReviews);
      setReplies(replyMap);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchReviews();

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
        const displayName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "";
        if (displayName) setName(displayName);
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [productId]);

  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
  }, [media]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (media.length + newFiles.length > MAX_MEDIA) {
      setSubmitError(`最多只能上傳 ${MAX_MEDIA} 個檔案`);
      e.target.value = "";
      return;
    }

    const validNewFiles = [];
    for (const file of newFiles) {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setSubmitError(
          `「${file.name}」超過容量上限（圖片 5MB / 影片 50MB）`,
        );
        e.target.value = "";
        return;
      }
      validNewFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (validNewFiles.length > 0) {
      setSubmitError("");
      setMedia((prev) => [...prev, ...validNewFiles]);
    }
    e.target.value = "";
  };

  const handleCancelFile = (indexToRemove) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const uploadMedia = async (mediaItems) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("請先登入才能上傳媒體");
    }

    const formData = new FormData();
    formData.append("productId", productId);
    mediaItems.forEach((m) => formData.append("files", m.file));

    const res = await fetch("/api/product/reviews/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "檔案上傳失敗");
    }
    return data.urls || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim() || !content.trim() || !title.trim()) {
      setSubmitError("請填寫暱稱、標題與內容");
      return;
    }

    setIsSubmitting(true);
    try {
      let mediaUrls = [];
      if (media.length > 0) {
        mediaUrls = await uploadMedia(media);
      }

      const { error } = await supabase.from("product_reviews").insert([
        {
          product_id: productId,
          user_name: name.trim(),
          title: title.trim(),
          content: content.trim(),
          rating,
          media_urls: mediaUrls,
        },
      ]);

      if (error) throw new Error(error.message);

      setTitle("");
      setContent("");
      setRating(5);
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      setMedia([]);
      await fetchReviews();
    } catch (err) {
      setSubmitError(err.message || "留言失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) {
      setSubmitError("請填寫暱稱與回覆內容");
      return;
    }

    setIsReplying(true);
    const { error } = await supabase.from("product_reviews").insert([
      {
        product_id: productId,
        parent_id: parentId,
        user_name: replyName.trim(),
        content: replyContent.trim(),
        rating: 5,
      },
    ]);
    setIsReplying(false);

    if (error) {
      setSubmitError(`回覆失敗: ${error.message}`);
    } else {
      setReplyingTo(null);
      setReplyName("");
      setReplyContent("");
      fetchReviews();
    }
  };

  const handleDelete = async (id, isReply = false, targetMediaUrls = []) => {
    const confirmMsg = isReply
      ? "確定要刪除這則回覆嗎？"
      : "確定要刪除這則留言嗎？相關媒體與回覆也會一併移除。";
    if (!window.confirm(confirmMsg)) return;

    if (targetMediaUrls?.length > 0) {
      const filePaths = targetMediaUrls
        .map((url) => {
          const decoded = decodeURI(url);
          const parts = decoded.split("/review-media/");
          return parts.length > 1 ? parts[1] : null;
        })
        .filter(Boolean);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("review-media")
          .remove(filePaths);
        if (storageError) {
          setSubmitError(`媒體刪除失敗：${storageError.message}`);
          return;
        }
      }
    }

    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) setSubmitError(`刪除失敗: ${error.message}`);
    else fetchReviews();
  };

  const loginHref = `/login?callbackUrl=${encodeURIComponent(router.asPath || "/")}`;

  return (
    <section
      id="product-reviews"
      className="mt-16 pt-10 pb-20 px-4 sm:px-6"
    >
      <AnimatePresence>
        {gallery.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGallery((g) => ({ ...g, isOpen: false }))}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setGallery((g) => ({ ...g, isOpen: false }));
              }}
              className="absolute top-5 right-5 text-white text-4xl w-12 h-12 flex items-center justify-center z-[10000] hover:bg-white/20 rounded-full transition-colors"
            >
              &times;
            </button>
            <div
              className="w-full max-w-6xl px-12 h-[85vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                initialSlide={gallery.initialSlide}
                navigation
                modules={[Navigation]}
                className="w-full h-full lightbox-swiper"
              >
                {gallery.mediaUrls.map((url, i) => (
                  <SwiperSlide
                    key={i}
                    className="flex items-center justify-center w-full h-full"
                  >
                    {isVideoUrl(url) ? (
                      <video
                        src={url}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-full max-w-full"
                      />
                    ) : (
                      <img
                        src={url}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: `.lightbox-swiper .swiper-button-next, .lightbox-swiper .swiper-button-prev { color: white; background-color: rgba(255,255,255,0.1); width: 50px; height: 50px; border-radius: 50%; }`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {submitError && (
        <div className="max-w-3xl mx-auto mb-8 px-4 py-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-sm text-center">
          {submitError}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-16 mb-20">
        {reviews.length === 0 ? (
          <p className="text-center text-neutral-400 font-serif text-sm py-12">
            目前還沒有評價，成為第一個分享體驗的人吧。
          </p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="border-t border-neutral-200/80 pt-10 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-serif text-neutral-800 text-sm tracking-wide">
                      {r.user_name}
                    </span>
                    {r.is_verified_purchase && (
                      <span className="text-[10px] text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded-full">
                        已購買
                      </span>
                    )}
                  </div>
                  <StarRow value={r.rating || 5} />
                  <time className="block mt-2 text-xs text-neutral-400">
                    {new Date(r.created_at).toLocaleDateString("zh-TW")}
                  </time>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id, false, r.media_urls)}
                    className="text-xs text-neutral-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    刪除
                  </button>
                )}
              </div>

              <h3 className="font-serif text-lg text-neutral-800 mb-3 leading-relaxed">
                {r.title || "體驗分享"}
              </h3>
              <p className="text-sm text-neutral-600 leading-loose whitespace-pre-wrap">
                {r.content}
              </p>

              <ReviewMediaGrid
                urls={r.media_urls}
                onOpen={(urls, i) =>
                  setGallery({ isOpen: true, mediaUrls: urls, initialSlide: i })
                }
              />

              <div className="mt-6 flex items-center gap-4">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingTo(replyingTo === r.id ? null : r.id)
                    }
                    className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors tracking-wide"
                  >
                    {replyingTo === r.id ? "取消回覆" : "回覆"}
                  </button>
                ) : (
                  <Link
                    href={loginHref}
                    className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors tracking-wide"
                  >
                    登入後回覆
                  </Link>
                )}
              </div>

              {replies[r.id]?.length > 0 && (
                <div className="mt-6 pl-4 border-l border-neutral-200 space-y-4">
                  {replies[r.id].map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-serif text-neutral-700 text-xs">
                          {reply.user_name}
                        </span>
                        <div className="flex items-center gap-3">
                          <time className="text-[11px] text-neutral-400">
                            {new Date(reply.created_at).toLocaleDateString(
                              "zh-TW",
                            )}
                          </time>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(reply.id, true)}
                              className="text-[11px] text-neutral-400 hover:text-red-600"
                            >
                              刪除
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === r.id && isLoggedIn && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, r.id)}
                  className="mt-6 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="您的暱稱"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    className="w-full md:w-1/3 bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-neutral-400"
                    required
                  />
                  <textarea
                    placeholder="分享您的想法"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-neutral-400 resize-none"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isReplying}
                      className="px-6 py-2 text-xs tracking-widest border border-neutral-300 rounded-full bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                    >
                      {isReplying ? "送出中…" : "送出回覆"}
                    </button>
                  </div>
                </form>
              )}
            </article>
          ))
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white px-6 py-10 md:px-10 md:py-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          {!isLoggedIn ? (
            <div className="text-center py-6">
              <p className="font-serif text-neutral-600 text-sm mb-6 leading-relaxed">
                登入後即可留下您的旅遊連線體驗
              </p>
              <Link
                href={loginHref}
                className="inline-block px-10 py-3 text-sm font-serif border border-neutral-300 rounded-full text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                登入撰寫評價
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">
                    暱稱
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-500"
                    placeholder="您的名字"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">
                    評分
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-500"
                  >
                    <option value={5}>5 星 — 非常滿意</option>
                    <option value={4}>4 星 — 滿意</option>
                    <option value={3}>3 星 — 普通</option>
                    <option value={2}>2 星 — 稍不滿意</option>
                    <option value={1}>1 星 — 非常不滿意</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">
                  評論標題
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-500"
                  placeholder="用一句話總結您的體驗"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">
                  詳細內容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full border border-neutral-200 bg-[#fafaf9] px-4 py-3 text-sm text-neutral-700 leading-relaxed focus:outline-none focus:border-neutral-400 resize-none"
                  placeholder="分享網速、訊號與使用情境…"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">
                  上傳照片或影片
                </label>
                <p className="text-xs text-neutral-400 mb-3">
                  限 {MAX_MEDIA} 份檔案，圖片 5MB / 影片 50MB 內
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border file:border-neutral-300 file:bg-white file:text-neutral-700 file:text-xs hover:file:bg-neutral-50 cursor-pointer"
                />

                {media.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {media.map((preview, i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-[4/3] bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                          {preview.file.type.startsWith("video/") ? (
                            <video
                              src={preview.previewUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={preview.previewUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="mt-2 text-[11px] text-neutral-400 truncate">
                          {preview.file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCancelFile(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-neutral-900/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-neutral-900"
                          aria-label="移除檔案"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 text-sm font-serif border border-neutral-800 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[160px]"
                >
                  {isSubmitting ? "上傳中…" : "發布評價"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
