"use client";

import { useCart } from "../components/context/CartContext";
import Layout from "./Layout";
import Link from "next/link";
import SwiperCard from "../components/SwiperCarousel/AnotherProduct";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import CheckoutForm from "../components/CheckoutForm";
import EsimRefundDisclosure from "../components/legal/EsimRefundDisclosure";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
const TruckIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

const steps = ["購物車", "填寫資料", "付款完成"];

const CartPage = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  // 🌟 已修正：移除 <number | null> 型別標註
  const [removingIndex, setRemovingIndex] = useState(null);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // 🌟 已修正：移除參數的 :number, :string 等型別標註
  const handleRemoveWithAnimation = (index, id, color, size) => {
    setRemovingIndex(index);
    setTimeout(() => {
      removeFromCart(id, color, size);
      setRemovingIndex(null);
    }, 300);
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f9f9f9] min-h-screen pb-20"
      >
        <div className="pt-[120px] max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Stepper 區塊 */}
          <Box sx={{ width: "100%", marginBottom: "3rem" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <AnimatePresence mode="wait">
            {/* ========================================== */}
            {/* STEP 0: 購物車列表 */}
            {/* ========================================== */}
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white p-8 rounded-2xl shadow-sm"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    購物車 ({cartItems.length})
                  </h1>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-xl text-gray-600 mb-4">
                      您的購物車是空的
                    </p>
                    <Link href="/" className="text-blue-600 hover:underline">
                      繼續選購商品
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* 左側：商品列表 */}
                    <div className="w-full lg:w-[65%] space-y-8">
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${item.color}-${item.size}`}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-8 ${
                            removingIndex === index ? "opacity-50" : ""
                          }`}
                        >
                          {/* 圖片區塊 */}
                          <div className="w-full md:w-[150px] flex-shrink-0 flex items-start justify-center bg-gray-50 rounded-lg p-2">
                            <Link
                              href={`/product/${item.slug || "#"}`}
                              className="block w-full"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-auto object-contain mix-blend-multiply cursor-pointer hover:opacity-80 transition-opacity"
                              />
                            </Link>
                          </div>

                          {/* 商品資訊區 */}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h2 className="text-lg font-bold text-gray-900">
                                <Link
                                  href={`/product/${item.slug || "#"}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </h2>
                              <p className="text-lg font-bold text-gray-900">
                                ${item.price}
                              </p>
                            </div>

                            <p className="text-gray-500 text-sm mb-4">
                              {item.specLabel || item.options || item.color}
                            </p>

                            <div className="bg-[#f5f6f7] rounded-md p-4 mb-4">
                              <div className="flex items-start text-sm text-gray-800">
                                <TruckIcon />
                                <span>
                                  結帳完成後，預計5分鐘內將QRcode寄至您的信箱
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-700">
                                  數量：
                                </span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    className="px-3 py-1 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity - 1,
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-3 text-sm">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="px-3 py-1 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity + 1,
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <button
                                className="text-red-500 text-sm font-medium hover:underline"
                                onClick={() =>
                                  handleRemoveWithAnimation(
                                    index,
                                    item.id,
                                    item.color,
                                    item.size,
                                  )
                                }
                              >
                                移除
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 右側：訂單摘要 (Step 0) */}
                    <div className="w-full lg:w-[35%]">
                      <div className="sticky top-24 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">
                          訂單摘要
                        </h3>

                        <div className="space-y-4 mb-6 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>商品小計</span>
                            <span className="font-medium text-gray-900">
                              ${totalPrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>運費</span>
                            <span className="text-green-600 font-medium">
                              免運費
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 my-4 pt-4">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-gray-900">
                              總計
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                              ${totalPrice}
                            </span>
                          </div>

                          <button
                            onClick={handleNext}
                            className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold py-3.5 px-6 rounded-lg transition-colors text-lg"
                          >
                            前往結帳
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========================================== */}
            {/* STEP 1: 填寫資料 (Bluehost 風格雙欄設計) */}
            {/* ========================================== */}
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col lg:flex-row gap-8"
              >
                {/* 🌟 左側：結帳表單 (CheckoutForm) */}
                <div className="w-full lg:w-[65%]">
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Checkout
                    </h2>
                    <button
                      onClick={handleBack}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      &larr; 返回修改購物車
                    </button>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                    <CheckoutForm onBack={handleBack} hideSubmitButton={true} />
                  </div>
                </div>

                {/* 🌟 右側：固定明細卡片 (Bluehost 風格) */}
                <div className="w-full lg:w-[35%]">
                  <div className="sticky top-24">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      Shopping Cart
                    </h3>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      {/* 購物車商品明細 */}
                      <div className="p-6 space-y-6">
                        {cartItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="pr-4">
                              <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                規格:{" "}
                                {item.specLabel || item.options || item.color}
                                <br />
                                數量: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 金額加總區塊 (灰底) */}
                      <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Subtotal:</span>
                          <span className="font-medium text-gray-900">
                            ${totalPrice}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                          <span>Tax:</span>
                          <span className="font-medium text-gray-900">
                            $0.00
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                          <span className="text-base font-bold text-gray-900">
                            Today's Total:
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${totalPrice}
                          </span>
                        </div>

                        <div className="mb-6">
                          <button className="text-sm text-blue-600 font-medium hover:underline">
                            Add Promo Code
                          </button>
                        </div>

                        <div className="mb-4">
                          <EsimRefundDisclosure compact />
                        </div>

                        {/* 同意條款 Checkbox */}
                        <label className="flex items-start gap-2 mb-6 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            required
                          />
                          <span className="text-xs text-gray-600 leading-tight">
                            我同意{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
                              服務條款
                            </Link>
                            、
                            <Link href="/refund-policy" className="text-blue-600 hover:underline" target="_blank">
                              退換貨政策
                            </Link>
                            ，並確認 eSIM 為數位商品，掃描開通後即無法退款（除政策例外）。
                          </span>
                        </label>

                        {/* 送出按鈕 */}
                        <button
                          onClick={() => {
                            // 🌟 已修正：移除 "as HTMLFormElement" TypeScript 語法
                            const formElement =
                              document.getElementById("checkout-form");
                            if (
                              formElement &&
                              typeof formElement.requestSubmit === "function"
                            ) {
                              formElement.requestSubmit();
                            } else {
                              alert("無法送出表單，請重新整理頁面後再試");
                            }
                          }}
                          className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold py-3.5 px-6 rounded-md transition-colors text-lg"
                        >
                          前往藍新金流付款
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================== */}
            {/* STEP 2: 完成訂單 */}
            {/* ========================================== */}
            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  付款完成！
                </h2>
                <p className="text-gray-600 mb-8">
                  感謝您的購買。eSIM 相關資訊將寄至您的
                  Email，亦可至會員中心查詢訂單。
                </p>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
                >
                  回到首頁
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-gray-200 px-4 md:px-8">
          <SwiperCard />
        </div>
      </motion.div>
    </Layout>
  );
};

export default CartPage;
