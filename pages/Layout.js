import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Navbar from "@/components/Navbar/Navbar.tsx";
import Banner from "@/components/banner";
import Footer from "@/components/ui/footer.jsx";
import Head from "next/head";
import SmartWizardFloat from "@/components/SmartWizardFloat"; // 引入新元件 ✅
import Sidebar from "@/components/Sidebar.js"; // 引入側邊欄組件
import { UserProvider } from "../components/context/UserContext";
import AiChatWidget from "../components/AiChatWidget"; // 🌟 引入剛剛做的元件
export default function RootLayout({ children }) {
  const [sidebarProduct, setSidebarProduct] = useState(null); // 儲存購物車資料

  // handleAddToCart 用於更新 sidebarProduct
  const handleAddToCart = (product, quantity, selectedAttributes) => {
    const totalPrice = product.price * quantity; // 計算總價
    const variantId = getVariantId(selectedAttributes); // 根據選擇的屬性獲取變體 ID

    // 更新 sidebarProduct 狀態
    setSidebarProduct({
      name: product.name,
      price: product.price,
      quantity,
      totalPrice,
      variant: selectedAttributes,
      variantId,
    });
    
    // 顯示購物車側邊欄（根據需求控制顯示）
    // setIsSidebarOpen(true); // 注意：這裡原本的 code 有這行，但未定義 setIsSidebarOpen，請確認您的 Context 或 State
  };

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <Head>
        {/* --- Jeko eSIM 品牌 SEO 設定 --- */}
        <title>Jeko eSIM - 街口eSIM｜連接您與世界的距離｜全球上網免換卡、各國eSIM專案</title>
        
        <meta name="description" content="Jeko eSIM   提供日本、韓國、東南亞及全球旅遊 eSIM 上網服務。由即刻網頁設計團隊打造，免換實體卡、掃描 QR Code  " />
        
        <meta name="keywords" content="Jeko eSIM, 日本eSIM, 韓國eSIM, 泰國SIM, 馬來西亞eSIM, 中國eSIM, 香港eSIM, 旅遊網卡, 出國上網, 虛擬SIM卡, 漫遊上網, 日本網卡推薦" />
        
        <meta name="author" content="Jeko eSIM Team 街口eSIM" />
        <link rel="icon" href="/logo.ico" />

        {/* --- Open Graph (FB/IG 分享預覽) --- */}
        <meta property="og:title" content="Jeko eSIM - 街口eSIM｜連接您與世界的距離｜全球上網免換卡、各國eSIM專案" />
        <meta property="og:description" content="Jeko eSIM   提供日本、韓國、東南亞及全球旅遊 eSIM 上網服務。由即刻網頁設計團隊打造，免換實體卡、掃描 QR Code " />
        <meta property="og:image" content="/default-og-image.jpg" />
        {/* 記得將 url 改成您未來的正式網域 */}
        <meta property="og:url" content="https://www.jeko-esim.com" /> 
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jeko eSIM" />

        {/* --- Twitter Card --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jeko eSIM - 街口eSIM｜連接您與世界的距離｜全球上網免換卡、各國eSIM專案" />
        <meta name="twitter:description" content="Jeko eSIM   提供日本、韓國、東南亞及全球旅遊 eSIM 上網服務。由即刻網頁設計團隊打造，免換實體卡、掃描 QR Code " />
        <meta name="twitter:image" content="/default-og-image.jpg" />
      </Head>

      <div className="w-full ">
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <UserProvider>
              {/* ✅ 提早包住所有元件 */}
              <Navbar />
              <Sidebar sidebarProduct={sidebarProduct} onAddToCart={handleAddToCart} />
              
              {children}
              
              <SmartWizardFloat />
              
 <AiChatWidget /> 
              <Footer/>
            </UserProvider>
          </NextThemesProvider>
        </NextUIProvider>

        <Banner />
      </div>
    </>
  );
}