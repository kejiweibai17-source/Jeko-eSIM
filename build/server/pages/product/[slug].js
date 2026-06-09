(() => {
var exports = {};
exports.id = 915;
exports.ids = [915,660];
exports.modules = {

/***/ 3530:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getServerSideProps: () => (/* binding */ getServerSideProps),
/* harmony export */   getStaticPaths: () => (/* binding */ getStaticPaths),
/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps),
/* harmony export */   reportWebVitals: () => (/* binding */ reportWebVitals),
/* harmony export */   routeModule: () => (/* binding */ routeModule),
/* harmony export */   unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
/* harmony export */   unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
/* harmony export */   unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
/* harmony export */   unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
/* harmony export */   unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
/* harmony export */ });
/* harmony import */ var next_dist_server_future_route_modules_pages_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3185);
/* harmony import */ var next_dist_server_future_route_modules_pages_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_module__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7182);
/* harmony import */ var next_dist_pages_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2940);
/* harmony import */ var next_dist_pages_document__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_pages_document__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var private_next_pages_app_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6004);
/* harmony import */ var private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(812);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([private_next_pages_app_js__WEBPACK_IMPORTED_MODULE_3__, private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__]);
([private_next_pages_app_js__WEBPACK_IMPORTED_MODULE_3__, private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

        // Next.js Route Loader
        
        

        // Import the app and document modules.
        
        

        // Import the userland code.
        

        // Re-export the component (should be the default export).
        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "default"));

        // Re-export methods.
        const getStaticProps = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "getStaticProps")
        const getStaticPaths = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "getStaticPaths")
        const getServerSideProps = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "getServerSideProps")
        const config = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "config")
        const reportWebVitals = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "reportWebVitals")
        

        // Re-export legacy methods.
        const unstable_getStaticProps = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "unstable_getStaticProps")
        const unstable_getStaticPaths = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "unstable_getStaticPaths")
        const unstable_getStaticParams = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "unstable_getStaticParams")
        const unstable_getServerProps = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "unstable_getServerProps")
        const unstable_getServerSideProps = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_1__/* .hoist */ .l)(private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__, "unstable_getServerSideProps")

        // Create and export the route module that will be consumed.
        const options = {"definition":{"kind":"PAGES","page":"/product/[slug]","pathname":"/product/[slug]","bundlePath":"","filename":""}}
        const routeModule = new (next_dist_server_future_route_modules_pages_module__WEBPACK_IMPORTED_MODULE_0___default())({
          ...options,
          components: {
            App: private_next_pages_app_js__WEBPACK_IMPORTED_MODULE_3__["default"],
            Document: (next_dist_pages_document__WEBPACK_IMPORTED_MODULE_2___default()),
          },
          userland: private_next_pages_product_slug_jsx__WEBPACK_IMPORTED_MODULE_4__,
        })
        
        
    
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2166:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony export default */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3015);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2184);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7644);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(swiper_css__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([swiper_react__WEBPACK_IMPORTED_MODULE_3__, swiper_modules__WEBPACK_IMPORTED_MODULE_4__]);
([swiper_react__WEBPACK_IMPORTED_MODULE_3__, swiper_modules__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const myLoader = ({ src, width, quality, placeholder })=>{
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-1/${src}?w=${width}?p=${placeholder}`;
};
const myLoader01 = ({ src, width, quality, placeholder })=>{
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}?p=${placeholder}`;
};
function Page() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return /*#__PURE__*/ _jsx("section", {
        className: " ",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "container",
            children: [
                /*#__PURE__*/ _jsxs(Swiper, {
                    loop: true,
                    spaceBetween: 10,
                    navigation: true,
                    thumbs: {
                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                    },
                    modules: [
                        FreeMode,
                        Navigation,
                        Thumbs
                    ],
                    className: "h-96 w-full",
                    children: [
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 300,
                                    src: "UH1.webp",
                                    loader: myLoader,
                                    priority: true,
                                    loading: "eager",
                                    alt: "The appearance of the calibration-free micro disposable pH electrode/Humming Probe UH1/UltraE   ",
                                    className: ""
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "UH1-01.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "The Schematic diagram of pH measurement of micro liquid samples with the calibration-free micro disposable pH electrode/Humming Probe UH1"
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    loader: myLoader,
                                    height: 400,
                                    src: "UH1-05-2.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "The Schematic diagram of the pH  electrode extension cable for the calibration-free micro disposable pH electrode/Humming Probe UH1"
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "即開即用.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "The calibration-free micro disposable pH electrode/Humming Probe pH electrode UH1 can be steadily stored in dry vials",
                                    className: ""
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "UH1-02.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "The outer packaging of the calibration-free micro disposable pH electrode/Humming Probe pH electrode UH1//UltraE  ",
                                    className: ""
                                })
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs(Swiper, {
                    onSwiper: setThumbsSwiper,
                    loop: true,
                    spaceBetween: 12,
                    breakpoints: {
                        0: {
                            slidesPerView: 4
                        },
                        768: {
                            slidesPerView: 5
                        },
                        1920: {
                            slidesPerView: 6
                        }
                    },
                    freeMode: true,
                    watchSlidesProgress: true,
                    modules: [
                        FreeMode,
                        Navigation,
                        Thumbs
                    ],
                    className: "thumbs   mt-3 w-full",
                    children: [
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("button", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 300,
                                    src: "UH1.webp",
                                    loader: myLoader,
                                    priority: true,
                                    loading: "eager",
                                    alt: "無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100",
                                    className: ""
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("button", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "UH1-01.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "UX200機身介紹.webp"
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("button", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    loader: myLoader,
                                    height: 400,
                                    src: "UH1-05-2.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100"
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("button", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "即開即用.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100",
                                    className: ""
                                })
                            })
                        }),
                        /*#__PURE__*/ _jsx(SwiperSlide, {
                            children: /*#__PURE__*/ _jsx("button", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    height: 400,
                                    loader: myLoader,
                                    src: "UH1-02.webp",
                                    priority: true,
                                    loading: "eager",
                                    alt: "無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100",
                                    className: ""
                                })
                            })
                        })
                    ]
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 812:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getStaticPaths: () => (/* binding */ getStaticPaths),
/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_context_CartContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9605);
/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3903);
/* harmony import */ var _heroui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4255);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3015);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2184);
/* harmony import */ var _components_SwiperSliders_UH1Slider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2166);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(7644);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(swiper_css__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var swiper_css_navigation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(3039);
/* harmony import */ var swiper_css_navigation__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(swiper_css_navigation__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var swiper_css_thumbs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2791);
/* harmony import */ var swiper_css_thumbs__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(swiper_css_thumbs__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(3877);
/* harmony import */ var html_react_parser__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(2905);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_16__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_Layout__WEBPACK_IMPORTED_MODULE_5__, _heroui_react__WEBPACK_IMPORTED_MODULE_6__, swiper_react__WEBPACK_IMPORTED_MODULE_7__, swiper_modules__WEBPACK_IMPORTED_MODULE_8__, _components_SwiperSliders_UH1Slider__WEBPACK_IMPORTED_MODULE_9__, swiper__WEBPACK_IMPORTED_MODULE_14__, html_react_parser__WEBPACK_IMPORTED_MODULE_15__]);
([_Layout__WEBPACK_IMPORTED_MODULE_5__, _heroui_react__WEBPACK_IMPORTED_MODULE_6__, swiper_react__WEBPACK_IMPORTED_MODULE_7__, swiper_modules__WEBPACK_IMPORTED_MODULE_8__, _components_SwiperSliders_UH1Slider__WEBPACK_IMPORTED_MODULE_9__, swiper__WEBPACK_IMPORTED_MODULE_14__, html_react_parser__WEBPACK_IMPORTED_MODULE_15__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






// Swiper imports












 // Import Image component
const WP_API_BASE_URL = (/* unused pure expression or super */ null && ("https://starislandbaby.com/test/"));
async function getStaticPaths() {
    const url = `https://starislandbaby.com/test/wp-json/wc/v3/products?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("API 请求失败:", response.status);
        return {
            paths: [],
            fallback: "blocking"
        };
    }
    const products = await response.json();
    const paths = products.map((product)=>{
        return {
            params: {
                slug: encodeURIComponent(product.slug)
            }
        };
    });
    return {
        paths,
        fallback: "blocking"
    };
}
//
async function getStaticProps({ params }) {
    const { slug } = params;
    try {
        const url = `https://starislandbaby.com/test/wp-json/wc/v3/products?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f&slug=${slug}`;
        const response = await fetch(url);
        if (!response.ok) {
            return {
                notFound: true
            };
        }
        const data = await response.json();
        // 在這裡解碼 API 回傳的 slug，確保匹配
        const matchedProduct = data.find((product)=>decodeURIComponent(product.slug) === decodeURIComponent(slug));
        if (!matchedProduct) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                product: matchedProduct
            },
            revalidate: 2
        };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return {
            notFound: true
        };
    }
}
const ProductPage = ({ product })=>{
    const { addToCart } = (0,_components_context_CartContext__WEBPACK_IMPORTED_MODULE_4__/* .useCart */ .j)(); // 使用購物車的 addToCart 函數
    const [selectedAttributes, setSelectedAttributes] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        color: product.default_attributes.find((attr)=>attr.name === "color")?.option || "defaultColor",
        size: product.default_attributes.find((attr)=>attr.name === "size")?.option || "defaultSize"
    });
    const [quantity, setQuantity] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1); // State for the quantity
    const [thumbsSwiper, setThumbsSwiper] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null); // Initialize thumbsSwiper state
    // Calculate total price
    const totalPrice = product.price * quantity; // Calculate total price based on quantity
    // const handleAttributeChange = (e) => {
    //   const { name, value } = e.target;
    //   setSelectedAttributes((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    // };
    // 根據顏色和尺寸選擇變體 ID
    const getVariantId = ()=>{
        const { color, size } = selectedAttributes;
        const colorOptions = product.attributes.find((attr)=>attr.name === "color")?.options || [];
        const sizeOptions = product.attributes.find((attr)=>attr.name === "size")?.options || [];
        const colorIndex = colorOptions.indexOf(color);
        const sizeIndex = sizeOptions.indexOf(size);
        if (colorIndex === -1 || sizeIndex === -1) {
            return null; // 顏色或尺寸不在選項中，返回 null
        }
        const variations = product.variations;
        const variantIndex = colorIndex * sizeOptions.length + sizeIndex;
        return variations[variantIndex] || null;
    };
    // const CoCartAPI = require("@cocart/cocart-rest-api").default;
    // const CoCart = new CoCartAPI({
    //   url: "https://starislandbaby.com/test",
    //   consumerKey: "ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b",
    //   consumerSecret: "cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f",
    // });
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)(); // 使用 Next.js 的 router
    const siteUrl = "https://starislandbaby.com/test"; // 你的 WooCommerce 網站 URL
    const handleAddToCart = ()=>{
        const variantId = getVariantId(); // 取得變體 ID
        if (!variantId) {
            alert("Please select a valid color and size.");
            return;
        }
        const cartProduct = {
            id: variantId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0].src,
            color: selectedAttributes.color,
            size: selectedAttributes.size
        };
        // 在這裡檢查 cartProduct 是否正確
        console.log("Adding to cart:", cartProduct);
        addToCart(cartProduct); // 將商品添加到購物車
    };
    const description = product.description || "";
    // Custom parsing function to replace <img> tags with Next.js <Image> component
    const customParser = (html)=>{
        return (0,html_react_parser__WEBPACK_IMPORTED_MODULE_15__["default"])(html, {
            replace: (domNode)=>{
                if (domNode.name === "img") {
                    const { src, alt, width, height } = domNode.attribs;
                    // 設定預設寬高，如果 HTML 中有提供的話就使用
                    const imgWidth = width || 600; // 預設寬度600px
                    const imgHeight = height || 400; // 預設高度400px
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_16___default()), {
                        src: src,
                        alt: alt || "Product Image",
                        width: parseInt(imgWidth),
                        height: parseInt(imgHeight),
                        layout: "responsive" // 自動調整大小，根據容器調整
                        ,
                        priority: true
                    });
                }
            }
        });
    };
    const { isOpen, onOpen, onOpenChange } = (0,_heroui_react__WEBPACK_IMPORTED_MODULE_6__.useDisclosure)();
    if (!product) return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        children: "Product not found."
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_Layout__WEBPACK_IMPORTED_MODULE_5__["default"], {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("title", {
                        children: [
                            product.name,
                            " | 星嶼童裝 | 韓系童裝服飾、小童、嬰幼兒服飾"
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: product.short_description
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:title",
                        content: product.name
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:description",
                        content: product.short_description
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:image",
                        content: product.images[0].src
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex flex-col",
                "data-aos": "fade-up",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "product_top_info px-[20px] sm:px-[50px] xl:px-[100px] pt-[140px] sm:pt-[200px] xl:pt-[250px]",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex lg:flex-row flex-col",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-full lg:w-1/2 p-2 lg:p-8 flex-col mx-auto flex justify-center items-center",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("section", {
                                        className: "w-full ",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "container",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_7__.Swiper, {
                                                    loop: true,
                                                    spaceBetween: 10,
                                                    navigation: true,
                                                    thumbs: {
                                                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                                                    },
                                                    modules: [
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.FreeMode,
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.Navigation,
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.Thumbs
                                                    ],
                                                    className: "h-full w-full",
                                                    children: product.images.map((image, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_7__.SwiperSlide, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                className: "flex h-full w-[90%] xl:w-[80%] mx-auto items-center justify-center",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_16___default()), {
                                                                    width: 400,
                                                                    height: 300,
                                                                    src: image.src,
                                                                    priority: true,
                                                                    loading: "eager",
                                                                    alt: image.alt || `Product Image ${index}`,
                                                                    className: ""
                                                                })
                                                            })
                                                        }, index))
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_7__.Swiper, {
                                                    onSwiper: setThumbsSwiper,
                                                    loop: true,
                                                    spaceBetween: 12,
                                                    breakpoints: {
                                                        0: {
                                                            slidesPerView: 4
                                                        },
                                                        768: {
                                                            slidesPerView: 5
                                                        },
                                                        1920: {
                                                            slidesPerView: 6
                                                        }
                                                    },
                                                    freeMode: true,
                                                    watchSlidesProgress: true,
                                                    modules: [
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.FreeMode,
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.Navigation,
                                                        swiper_modules__WEBPACK_IMPORTED_MODULE_8__.Thumbs
                                                    ],
                                                    className: "thumbs mt-3 w-full",
                                                    children: product.images.map((image, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_7__.SwiperSlide, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                className: "flex h-full w-full items-center justify-center",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_16___default()), {
                                                                    width: 400,
                                                                    height: 300,
                                                                    src: image.src,
                                                                    priority: true,
                                                                    loading: "eager",
                                                                    alt: image.alt || `Thumbnail ${index}`,
                                                                    className: ""
                                                                })
                                                            })
                                                        }, index))
                                                })
                                            ]
                                        })
                                    })
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "product_info mt-[40px] md:mt-[80px] p-2 lg:p-8 w-full lg:w-1/2 flex flex-col justify-center",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "flex w-[50%] flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", {
                                                            children: [
                                                                "商品名稱：",
                                                                product.name
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                            className: "text-[22px] mt-4",
                                                            children: [
                                                                "價格: $",
                                                                product.price,
                                                                " .NT"
                                                            ]
                                                        }),
                                                        product.short_description && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "short-description text-[16px] py-5 mt-4",
                                                            children: (0,html_react_parser__WEBPACK_IMPORTED_MODULE_15__["default"])(product.short_description)
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: " w-[50%]",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Button, {
                                                            className: " !bg-transparent !font-bold !text-[#4a4a4a] !text-[16px] duration-250 !hover:text-black",
                                                            onPress: onOpen,
                                                            children: "尺寸表"
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Modal, {
                                                            isOpen: isOpen,
                                                            className: " !z-[999999999] bg-white !mt-[10%]",
                                                            onOpenChange: onOpenChange,
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.ModalContent, {
                                                                children: (onClose)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.ModalHeader, {
                                                                                className: "flex flex-col p-10 gap-1",
                                                                                children: "尺寸表"
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.ModalBody, {
                                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                                                    className: "w-[200px]",
                                                                                    src: "/images/S__4751370.jpg",
                                                                                    alt: ""
                                                                                })
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.ModalFooter, {})
                                                                        ]
                                                                    })
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        product.attributes.find((attr)=>attr.name === "color") && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "flex gap-2 flex-wrap mt-5 sm:w-[80%] w-full",
                                            children: product.attributes.find((attr)=>attr.name === "color").options.map((option, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                    className: `px-4 mt-[3px] py-2 rounded-md ${selectedAttributes.color === option ? "bg-[#B4746B] text-white" : "border border-black"}`,
                                                    onClick: ()=>setSelectedAttributes({
                                                            ...selectedAttributes,
                                                            color: option
                                                        }),
                                                    children: option
                                                }, index))
                                        }),
                                        product.attributes.find((attr)=>attr.name === "size") && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "flex gap-2 mt-8 flex-wrap  w-full sm:w-[70%]",
                                            children: product.attributes.find((attr)=>attr.name === "size").options.map((option, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                    className: `px-4  py-2 rounded-md ${selectedAttributes.size === option ? "bg-[#B4746B] text-white" : "border border-black"}`,
                                                    onClick: ()=>setSelectedAttributes({
                                                            ...selectedAttributes,
                                                            size: option
                                                        }),
                                                    children: option
                                                }, index))
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "mt-4",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "mt-6 rounded-full",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                                            htmlFor: "quantity",
                                                            className: "text-sm  font-medium text-gray-700",
                                                            children: "購買數量："
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: " items-center mt-2 border rounded-full p-3 inline-flex overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                                                    className: "px-3 py-1 text-gray-600 hover:text-gray-900  focus:outline-none  ",
                                                                    children: "-"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                                                    type: "number",
                                                                    id: "quantity",
                                                                    min: "1",
                                                                    value: quantity,
                                                                    onChange: (e)=>setQuantity(Number(e.target.value)),
                                                                    className: "w-16 text-center px-2 py-1 text-lg font-semibold text-gray-700 bg-white border-0   focus:outline-none"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setQuantity(quantity + 1),
                                                                    className: "px-3 py-1 text-gray-600 hover:text-gray-900  focus:outline-none  ",
                                                                    children: "+"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                    onClick: handleAddToCart,
                                                    children: "添加至購物車"
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "total-price mt-4",
                                                    children: [
                                                        "金額總計: $",
                                                        totalPrice
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "flex px-[10vw] xl:px-[20vw] w-full flex-col",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Tabs, {
                            "aria-label": "Options",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Tab, {
                                    title: " 商品說明",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Card, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.CardBody, {
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: "product_content]",
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                                        className: "font-bold text-xl text-[#B4746B]"
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: "py-[20px]",
                                                        children: customParser(description)
                                                    })
                                                ]
                                            })
                                        })
                                    })
                                }, " 商品說明"),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Tab, {
                                    title: "購買須知",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.Card, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_6__.CardBody, {
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_16___default()), {
                                                src: "/images/term.png",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                className: "max-w-[600px]",
                                                width: 600,
                                                height: 800,
                                                alt: "購買資訊"
                                            })
                                        })
                                    })
                                }, "購買須知")
                            ]
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductPage);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1759:
/***/ (() => {



/***/ }),

/***/ 1230:
/***/ (() => {



/***/ }),

/***/ 3039:
/***/ (() => {



/***/ }),

/***/ 5392:
/***/ (() => {



/***/ }),

/***/ 2791:
/***/ (() => {



/***/ }),

/***/ 7644:
/***/ (() => {



/***/ }),

/***/ 9783:
/***/ ((module) => {

"use strict";
module.exports = require("aos");

/***/ }),

/***/ 1162:
/***/ ((module) => {

"use strict";
module.exports = require("next-themes");

/***/ }),

/***/ 3076:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 4140:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 3100:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/render.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 3918:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/amp-context.js");

/***/ }),

/***/ 5732:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/amp-mode.js");

/***/ }),

/***/ 3280:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 5132:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/get-img-props.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 744:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/image-config-context.js");

/***/ }),

/***/ 5843:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/image-config.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 1109:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-local-url.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 7782:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/resolve-href.js");

/***/ }),

/***/ 2470:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/side-effect.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 618:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils/warn-once.js");

/***/ }),

/***/ 968:
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ 5564:
/***/ ((module) => {

"use strict";
module.exports = require("next/image.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 5700:
/***/ ((module) => {

"use strict";
module.exports = require("react-fast-marquee");

/***/ }),

/***/ 2750:
/***/ ((module) => {

"use strict";
module.exports = require("react-icons/fi");

/***/ }),

/***/ 4255:
/***/ ((module) => {

"use strict";
module.exports = import("@heroui/react");;

/***/ }),

/***/ 2406:
/***/ ((module) => {

"use strict";
module.exports = import("@nextui-org/react");;

/***/ }),

/***/ 9648:
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ 6197:
/***/ ((module) => {

"use strict";
module.exports = import("framer-motion");;

/***/ }),

/***/ 2905:
/***/ ((module) => {

"use strict";
module.exports = import("html-react-parser");;

/***/ }),

/***/ 6152:
/***/ ((module) => {

"use strict";
module.exports = import("lucide-react");;

/***/ }),

/***/ 3877:
/***/ ((module) => {

"use strict";
module.exports = import("swiper");;

/***/ }),

/***/ 2184:
/***/ ((module) => {

"use strict";
module.exports = import("swiper/modules");;

/***/ }),

/***/ 3015:
/***/ ((module) => {

"use strict";
module.exports = import("swiper/react");;

/***/ }),

/***/ 5941:
/***/ ((module) => {

"use strict";
module.exports = import("swr");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [940,812,636,664,675,4,176,903], () => (__webpack_exec__(3530)));
module.exports = __webpack_exports__;

})();