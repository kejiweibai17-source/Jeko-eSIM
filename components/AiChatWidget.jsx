"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, Loader2 } from "lucide-react";

// --- 預設問與答內容 ---
const PRESET_ANSWERS = {
  "怎麼安裝 eSIM？":
    "安裝步驟：\n1. Email 接收 QR Code。\n2. 手機設定 > 行動服務 > 加入 eSIM。\n3. 掃描 QR Code 即可。\n教學：https://e-sim-pwa-3k6n.vercel.app/operation-shopee/",
  "我的手機支援嗎？":
    "請檢查：\n- iPhone：設定 > 一般 > 關於本機，查看是否有 EID。\n- Android：撥號輸入 *#06# 查看 EID。\n清單：https://jeko-esim.com/compatibility",
  "日本推薦哪一款？":
    "首選「KDDI/SoftBank 原生卡」，低延遲、速度快！\n購買：https://jeko-esim.com/product/jp-native",
  "韓國有吃到飽嗎？":
    "有的！「韓國純日用吃到飽」方案不降速。\n詳情：https://jeko-esim.com/product/kr-unlimited",
};

const QUICK_QUESTIONS = Object.keys(PRESET_ANSWERS);

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content:
        "您好！我是街口小E 🤖 \n想了解旅遊技巧或 eSIM 安裝嗎？請點擊下方按鈕或直接輸入問題喔！",
    },
  ]);

  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700 break-all font-bold mx-1"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const processChat = async (text) => {
    if (!text.trim() || isLoading) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: text },
    ]);
    setIsLoading(true);

    if (PRESET_ANSWERS[text]) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", content: PRESET_ANSWERS[text] },
        ]);
        setIsLoading(false);
      }, 600);
      return;
    }

    const history = messages.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: "抱歉，我暫時斷線了..." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const text = input;
    setInput("");
    processChat(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <div className="text-left">
                  <h3 className="font-bold text-[14px]">
                    街口小E - 您的智慧小幫手
                  </h3>
                  <div className="text-[11px] opacity-80 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />{" "}
                    Working
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm text-left ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.role === "ai"
                        ? renderMessageContent(msg.content)
                        : msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl flex gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 快捷問答 */}
            <div className="bg-white px-2 pt-3 pb-1 border-t border-gray-50">
              <div
                ref={scrollRef}
                onWheel={handleWheel}
                className="flex gap-2 overflow-x-auto pb-2 px-2 no-scrollbar"
                style={{
                  scrollBehavior: "smooth",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => processChat(q)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[12px] font-bold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-full"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="輸入問題..."
                  className="flex-1 bg-transparent px-4 border-none outline-none focus:ring-0 text-sm text-slate-700"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              <div className="text-center mt-2 text-[9px] text-gray-400">
                <Sparkles className="w-3 h-3 inline mr-1" /> JeKo AI
                助手隨時為您服務
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 懸浮按鈕 + Hover 文字標籤區塊 */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Hover 時彈出的標籤：僅在視窗關閉時顯示 */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              variants={{
                rest: { opacity: 0, x: 20, scale: 0.8 },
                hover: { opacity: 1, x: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-xl text-[13px] font-bold border border-blue-50 whitespace-nowrap"
            >
              您的智慧小幫手
            </motion.div>
          )}
        </AnimatePresence>

        {/* 圓形按鈕主體 */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all ${
            isOpen
              ? "bg-slate-800 text-white"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </motion.div>
      </motion.div>
    </div>
  );
}
