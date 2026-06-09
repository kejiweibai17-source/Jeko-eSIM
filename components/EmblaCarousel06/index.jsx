import React from "react";
import EmblaCarousel from "./EmblaCarousel";

const OPTIONS = { dragFree: true, loop: true };

// 預設假資料 (當沒有傳入資料時的備用，防止畫面報錯)
const DEFAULT_SLIDES = [
  {
    image: "/images/blog/25a98b84fad67fb841206a372f7ad78e.jpg",
    title: "歡迎來到我們的部落格",
    description: "隨時掌握最新旅遊資訊與 eSIM 使用教學。",
  },
  {
    image: "/images/blog/9085c7667bb4a404dacd4e5001557fc8.jpg",
    title: "探索世界",
    description: "為您的下一趟旅程做好萬全準備。",
  },
];

// 🌟 關鍵修改：加入 { slides } 參數，接收從 InfoPage 傳過來的 WordPress 真實資料
const App = ({ slides }) => {
  // 如果外面有傳 slides 就用外面的，沒有或陣列為空就用預設的 DEFAULT_SLIDES
  const displaySlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  return (
    <>
      {/* 把確定好的資料傳給實際的輪播組件 */}
      <EmblaCarousel slides={displaySlides} options={OPTIONS} />
    </>
  );
};

export default App;
