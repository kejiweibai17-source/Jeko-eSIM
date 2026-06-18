import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Layout from "../../Layout.js";
import { buildCategorySeo } from "../../../lib/seo.config";
import { resolveMedusaImageUrl } from "../../../lib/resolveMedusaImageUrl";
import CountryFilter from "../../../components/NavbarTestSideBarToggle.jsx";
import SwiperCarousel from "../../../components/SwiperCarousel/SwiperCard.jsx";
import FilterSideBar from "../../../components/FilterSideBar";
import Slider from "../../../components/Slider.jsx";
// ==========================================
// 🚀 Medusa API 輔助設定
// ==========================================
const getMedusaHeaders = () => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  return {
    "Content-Type": "application/json",
    ...(publishableKey && { "x-publishable-api-key": publishableKey }),
  };
};

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

// ==========================================
// 🚀 1. getStaticPaths
// ==========================================
export async function getStaticPaths() {
  try {
    const res = await fetch(`${backendUrl}/store/product-categories`, {
      headers: getMedusaHeaders(),
    });
    if (!res.ok) throw new Error("無法取得 Medusa 分類路徑");
    const { product_categories } = await res.json();
    const paths = product_categories.map((cat) => ({
      params: { category: cat.handle },
    }));
    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
}

// ==========================================
// 🚀 2. getStaticProps (🌟 已經加上強力除錯日誌)
// ==========================================
export async function getStaticProps({ params }) {
  try {
    const { category: categoryHandle } = params;
    const headers = getMedusaHeaders();

    // 🐞================ 除錯開始 ================🐞
    console.log("\n========================================");
    console.log(`🔍 [除錯雷達] 開始抓取分類頁面: /product/${categoryHandle}`);
    console.log(
      `🔑 Publishable Key 狀態: ${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ? "🟢 已設定 (有值)" : "🔴 未設定 (缺少金鑰！這會導致抓不到商品)"}`,
    );

    // 1. 抓取當前分類資料
    const catUrl = `${backendUrl}/store/product-categories?handle=${categoryHandle}`;
    console.log(`🌐 正在呼叫分類 API: ${catUrl}`);
    const catRes = await fetch(catUrl, { headers });
    const catData = await catRes.json();
    const currentCategory = catData.product_categories?.[0];

    if (!currentCategory) {
      console.log("❌ 找不到分類，將回傳 404");
      console.log("========================================\n");
      return { notFound: true };
    }
    console.log(
      `✅ 成功找到分類 ID: ${currentCategory.id} (名稱: ${currentCategory.name})`,
    );

    // 2. 抓取該分類下的所有商品
    const prodUrl = `${backendUrl}/store/products?category_id[]=${currentCategory.id}`;
    console.log(`🌐 正在呼叫商品 API: ${prodUrl}`);
    const prodRes = await fetch(prodUrl, { headers });

    if (!prodRes.ok) {
      console.log(`❌ 呼叫商品 API 失敗！狀態碼: ${prodRes.status}`);
    }

    const prodData = await prodRes.json();
    const productCount = prodData.products?.length || 0;

    console.log(`📦 Medusa 回傳的商品數量: ${productCount}`);

    if (productCount === 0) {
      console.log("⚠️ 警告：回傳的商品陣列是空的！完整 API 回傳內容如下：");
      console.log(JSON.stringify(prodData, null, 2));
      console.log(
        "💡 [提示] 如果後台有商品這裡卻是空的，99% 是因為沒有 Publishable Key，導致沒有權限讀取 Sales Channel 的商品。",
      );
    } else {
      console.log(
        `✅ 成功抓取商品: ${prodData.products.map((p) => p.title).join(", ")}`,
      );
    }
    console.log("========================================\n");
    // 🐞================ 除錯結束 ================🐞

    // 3. 抓取所有分類表
    const allCatRes = await fetch(`${backendUrl}/store/product-categories`, {
      headers,
    });
    const allCatData = await allCatRes.json();

    const formattedCurrentCategory = {
      id: currentCategory.id,
      name: currentCategory.name,
      slug: currentCategory.handle,
      description: currentCategory.description || "",
    };

    const formattedAllCategories = (allCatData.product_categories || []).map(
      (cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.handle,
      }),
    );

    const formattedProducts = (prodData.products || []).map((p) => {
      const firstVariant = p.variants?.[0];
      let price = 0;
      let originalPrice = 0;
      if (firstVariant?.prices && firstVariant.prices.length > 0) {
        price = firstVariant.prices[0].amount;
        originalPrice = firstVariant.original_price || price;
      }
      return {
        id: p.id,
        name: p.title,
        slug: p.handle,
        price: price,
        original_price: originalPrice,
        image_url: resolveMedusaImageUrl(p.thumbnail),
        tags: p.tags?.map((t) => t.value) || [],
      };
    });

    return {
      props: {
        currentCategory: formattedCurrentCategory,
        categories: formattedAllCategories,
        initialProducts: formattedProducts,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("❌ Medusa getStaticProps 發生致命錯誤：", e);
    return { notFound: true };
  }
}

// ==========================================
// 3. UI 元件
// ==========================================
const CategoryPage = ({ currentCategory, categories, initialProducts }) => {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [activeTags, setActiveTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    const tagsFromQuery = router.query.tags?.split(",").filter(Boolean) || [];
    setActiveTags(tagsFromQuery);
  }, [router.query.tags]);

  useEffect(() => {
    if (!initialProducts) return;

    if (!activeTags || activeTags.length === 0) {
      setFilteredProducts(initialProducts);
    } else {
      const filtered = initialProducts.filter((product) => {
        return activeTags.every((tag) => product.tags?.includes(tag));
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [activeTags, initialProducts]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const pageSeo = useMemo(
    () => buildCategorySeo(currentCategory, initialProducts),
    [currentCategory, initialProducts],
  );

  if (router.isFallback)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
          載入中，請稍候...
        </div>
      </Layout>
    );

  return (
    <Layout seo={pageSeo}>
      <div className="flex flex-col bg-[#f9f9fa]">
        <section className="section_Hero w-full mx-auto">
          <Slider />
        </section>

        <div className="filter-wrap flex lg:flex-row flex-col sm:px-5 px-4 md:px-10 min-h-screen">
          <div className="filter_bar rounded-xl overflow-hidden w-full lg:w-[25%] bg-white mt-[30px] mr-4">
            <FilterSideBar
              products={initialProducts}
              activeTags={activeTags}
              setActiveTags={(tags) => {
                setActiveTags(tags);
                const tagQuery = tags.join(",");
                router.push(
                  {
                    pathname: `/product/${currentCategory.slug}`,
                    query: { ...router.query, tags: tagQuery },
                  },
                  undefined,
                  { scroll: false },
                );
              }}
            />
          </div>

          <div className="bottom-content mt-[30px] rounded-xl overflow-hidden w-full lg:w-[75%] flex flex-col">
            <div className="top-navgation bg-white max-w-[1920px] border-b border-gray-200 py-5 flex flex-col sm:flex-row items-center pl-4 sm:pl-10">
              <div className="bread_crumb w-full text-gray-500">
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href="/product"
                  className="hover:text-blue-600 transition-colors"
                >
                  所有商品
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[16px] font-bold text-slate-800">
                  {currentCategory?.name}
                </span>
              </div>
              <CountryFilter />
            </div>

            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 bg-white rounded-bl-xl rounded-br-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2 sm:p-6">
                {currentProducts.map((product, index) => {
                  const productImage =
                    product.image_url || "/default-image.jpg";
                  const price = product.price;
                  const regularPrice = product.original_price;
                  const productLink = `/product/${currentCategory.slug}/${product.slug}`;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group"
                    >
                      <Link
                        href={productLink}
                        className="hover:scale-105 duration-200 block"
                      >
                        <div className="card overflow-hidden rounded-xl p-4 bg-white">
                          <div className="relative w-full aspect-[3/4] mb-3">
                            <Image
                              src={productImage}
                              alt={product.name}
                              fill
                              className="rounded-[20px] border-2 border-gray-100 group-hover:shadow-lg group-hover:border-blue-100 object-cover transition-all"
                            />
                          </div>
                          <span className="font-bold text-sm text-slate-800 block mb-1 line-clamp-2 min-h-[40px]">
                            {product.name}
                          </span>
                          <div className="text-gray-700 mt-2">
                            <div className="flex items-end gap-2">
                              <span className="text-blue-600 font-bold text-lg">
                                NT${price}
                              </span>
                              {regularPrice && regularPrice !== price && (
                                <del className="text-gray-400 text-xs mb-0.5">
                                  NT${regularPrice}
                                </del>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 p-10 bg-white rounded-b-xl flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-4xl mb-3">📭</span>
                <p>這個分類目前還沒有商品喔！趕快去 Medusa 後台新增吧！</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600 font-bold"
                        : "bg-white text-blue-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
