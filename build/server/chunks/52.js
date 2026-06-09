"use strict";
exports.id = 52;
exports.ids = [52];
exports.modules = {

/***/ 4052:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ ProductGrid)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2406);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1759);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_easyProduct_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6953);
/* harmony import */ var _heroui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4255);
/* harmony import */ var _components_ui_following_pointer_tsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3124);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__, _components_easyProduct_jsx__WEBPACK_IMPORTED_MODULE_6__, _heroui_react__WEBPACK_IMPORTED_MODULE_7__, _components_ui_following_pointer_tsx__WEBPACK_IMPORTED_MODULE_8__]);
([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__, _components_easyProduct_jsx__WEBPACK_IMPORTED_MODULE_6__, _heroui_react__WEBPACK_IMPORTED_MODULE_7__, _components_ui_following_pointer_tsx__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);









async function fetchAllProducts() {
    try {
        const productUrl = `${"https://starislandbaby.com/test/"}wp-json/wc/v3/products?consumer_key=${"ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b"}&consumer_secret=${"cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f"}`;
        const response = await fetch(productUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch products. Status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
function ProductGrid() {
    const [products, setProducts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const productsPerPage = 4; // 每頁顯示4個產品
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchData = async ()=>{
            const fetchedProducts = await fetchAllProducts();
            const filteredProducts = fetchedProducts.filter((product)=>product.categories.some((category)=>category.slug === "small-children"));
            setProducts(filteredProducts);
            setLoading(false);
        };
        fetchData();
    }, []);
    if (loading) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            children: "Loading..."
        });
    }
    if (products.length === 0) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "text-center py-10 text-xl",
            children: "該分類下尚未有產品"
        });
    }
    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "container w-[75%] flex flex-col mx-auto py-1 px-4",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                src: "/images/for_kids_title.jpg",
                placeholder: "empty",
                loading: "lazy",
                className: "mx-auto max-w-[700px]",
                width: 700,
                height: 300,
                alt: "for_kid_title"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: currentProducts.map((product)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(ProductCard, {
                        product: product
                    }, product.id))
            }),
            totalPages > 1 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex justify-center mt-6 space-x-2",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        className: "px-4 py-2 rotate-180 rounded-lg disabled:opacity-50",
                        onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                        disabled: currentPage === 1,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                            src: "/images/right-arrow.png",
                            width: 50,
                            height: 50,
                            alt: "arrow"
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: "px-4 py-2",
                        children: [
                            "Page ",
                            currentPage,
                            " of ",
                            totalPages
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                        className: "px-4 py-2 rounded-lg disabled:opacity-50",
                        onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, totalPages)),
                        disabled: currentPage === totalPages,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                            src: "/images/right-arrow.png",
                            width: 50,
                            height: 50,
                            alt: "arrow"
                        })
                    })
                ]
            })
        ]
    });
}
function ProductCard({ product }) {
    const { isOpen, onOpen, onOpenChange } = (0,_heroui_react__WEBPACK_IMPORTED_MODULE_7__.useDisclosure)();
    const [selectedProduct, setSelectedProduct] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const handleOpen = ()=>{
        setSelectedProduct(product);
        onOpen();
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "group block ",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_following_pointer_tsx__WEBPACK_IMPORTED_MODULE_8__/* .FollowerPointerCard */ .C, {
            title: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                children: product.name
            }),
            avatar: blogContent.authorAvatar,
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_7__.Button, {
                    onPress: handleOpen,
                    className: "w-full p-2 !bg-transparent h-full",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "w-full aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                                    src: product.images[0]?.src || "/images/default.jpg",
                                    alt: product.name,
                                    width: 400,
                                    height: 300,
                                    className: "object-cover group-hover:scale-95 group-hover:rounded-2xl transition-transform duration-200"
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                        className: "font-bold my-4 text-lg text-zinc-700",
                                        children: product.name
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h2", {
                                        className: "font-normal my-4 text-sm text-zinc-500",
                                        children: [
                                            "Price: $",
                                            product.price
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "flex flex-row justify-between items-center mt-10"
                                    })
                                ]
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_7__.Modal, {
                    isOpen: isOpen,
                    onOpenChange: onOpenChange,
                    size: "full",
                    className: "flex items-center justify-center !rounded-[27px] min-h-auto !h-auto !min-h-auto",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_7__.ModalContent, {
                        className: "w-full max-w-7xl 2xl:p-10 md:p-5 p-0",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_7__.ModalBody, {
                            className: "bg-white !w-[90vw] !rounded-[27px] max-w-7xl",
                            children: selectedProduct && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_easyProduct_jsx__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                product: selectedProduct
                            })
                        })
                    })
                })
            ]
        })
    });
}
const blogContent = {
    slug: "amazing-tailwindcss-grid-layouts",
    author: "Manu Arora",
    date: "28th March, 2023",
    title: "Amazing Tailwindcss Grid Layout Examples",
    description: "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcss grid and React.",
    image: "/images/24c1dd94a78c0b8aee23aa767051e8fd.png",
    authorAvatar: "/images/24c1dd94a78c0b8aee23aa767051e8fd.png"
};
const TitleComponent = ({ title, avatar })=>/*#__PURE__*/ _jsxs("div", {
        className: "flex space-x-2 items-center",
        children: [
            /*#__PURE__*/ _jsx(Image, {
                src: "/images/24c1dd94a78c0b8aee23aa767051e8fd.png",
                height: 20,
                width: 20,
                alt: "thumbnail",
                className: "rounded-full border-2 border-white"
            }),
            /*#__PURE__*/ _jsx("p", {
                children: title
            })
        ]
    });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6953:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3015);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2184);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2406);
/* harmony import */ var html_react_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2905);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([swiper_react__WEBPACK_IMPORTED_MODULE_3__, swiper_modules__WEBPACK_IMPORTED_MODULE_4__, _nextui_org_react__WEBPACK_IMPORTED_MODULE_5__, html_react_parser__WEBPACK_IMPORTED_MODULE_6__]);
([swiper_react__WEBPACK_IMPORTED_MODULE_3__, swiper_modules__WEBPACK_IMPORTED_MODULE_4__, _nextui_org_react__WEBPACK_IMPORTED_MODULE_5__, html_react_parser__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







const ProductPage = ({ product })=>{
    const [thumbsSwiper, setThumbsSwiper] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [selectedAttributes, setSelectedAttributes] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [quantity, setQuantity] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const totalPrice = product ? product.price * quantity : 0;
    const handleAddToCart = ()=>{
        console.log("加入購物車", {
            product,
            selectedAttributes,
            quantity
        });
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "product_top_info w-full  max-w-[50vw]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "flex lg:flex-row flex-col",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "w-full lg:w-1/2 p-2 lg:p-8 flex-col mx-auto flex justify-center items-center",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("section", {
                        className: "w-full",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "container",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_3__.Swiper, {
                                    loop: true,
                                    spaceBetween: 10,
                                    navigation: true,
                                    thumbs: {
                                        swiper: thumbsSwiper
                                    },
                                    modules: [
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.FreeMode,
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.Navigation,
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.Thumbs
                                    ],
                                    className: "h-full w-full",
                                    children: product.images.map((image, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_3__.SwiperSlide, {
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "flex h-full w-[90%] lg:w-[80%] mx-auto items-center justify-center",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                                                    width: 400,
                                                    height: 300,
                                                    src: image.src,
                                                    priority: true,
                                                    loading: "eager",
                                                    alt: image.alt || `Product Image ${index}`
                                                })
                                            })
                                        }, index))
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_3__.Swiper, {
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
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.FreeMode,
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.Navigation,
                                        swiper_modules__WEBPACK_IMPORTED_MODULE_4__.Thumbs
                                    ],
                                    className: "thumbs mt-3 w-full",
                                    children: product.images.map((image, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_3__.SwiperSlide, {
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                className: "flex h-full w-full items-center justify-center",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                                                    width: 400,
                                                    height: 300,
                                                    src: image.src,
                                                    priority: true,
                                                    loading: "eager",
                                                    alt: image.alt || `Thumbnail ${index}`
                                                })
                                            })
                                        }, index))
                                })
                            ]
                        })
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "product_info mt-[80px] p-2 lg:p-8 w-full lg:w-1/2 flex flex-col justify-center",
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
                                            children: (0,html_react_parser__WEBPACK_IMPORTED_MODULE_6__["default"])(product.short_description)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "w-[50%]",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.Button, {
                                            className: "!bg-transparent !font-bold !text-[#4a4a4a] !text-[16px]",
                                            onPress: ()=>setIsOpen(true),
                                            children: "尺寸表"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.Modal, {
                                            isOpen: isOpen,
                                            className: "!z-[999999999] !mt-[10%]",
                                            onOpenChange: setIsOpen,
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.ModalContent, {
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.ModalHeader, {
                                                        className: "flex flex-col p-10 gap-1",
                                                        children: "尺寸表"
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.ModalBody, {
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/images/S__4751370.jpg",
                                                            alt: "Size Chart"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_5__.ModalFooter, {})
                                                ]
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        product.attributes.find((attr)=>attr.name === "color") && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex gap-2",
                            children: product.attributes.find((attr)=>attr.name === "color").options.map((option, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    className: `px-4 mt-[30px] py-2 rounded-md ${selectedAttributes.color === option ? "bg-[#B4746B] text-white" : "border border-black"}`,
                                    onClick: ()=>setSelectedAttributes({
                                            ...selectedAttributes,
                                            color: option
                                        }),
                                    children: option
                                }, index))
                        }),
                        product.attributes.find((attr)=>attr.name === "size") && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex gap-2 mt-4",
                            children: product.attributes.find((attr)=>attr.name === "size").options.map((option, index)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    className: `px-4 py-2 rounded-md ${selectedAttributes.size === option ? "bg-[#B4746B] text-white" : "border border-black"}`,
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
                                            className: "text-sm font-medium text-gray-700",
                                            children: "購買數量："
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "items-center mt-2 border rounded-full p-3 inline-flex shadow-sm",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                    type: "button",
                                                    onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                                    className: "px-3 py-1",
                                                    children: "-"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                                    type: "number",
                                                    id: "quantity",
                                                    min: "1",
                                                    value: quantity,
                                                    onChange: (e)=>setQuantity(Number(e.target.value)),
                                                    className: "w-16 text-center px-2 py-1 text-lg font-semibold text-gray-700 bg-white border-0"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                    type: "button",
                                                    onClick: ()=>setQuantity(quantity + 1),
                                                    className: "px-3 py-1",
                                                    children: "+"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: handleAddToCart,
                                    className: "px-6 py-2 mt-[40px] font-medium bg-[#B4746B] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none",
                                    children: "加入購物車"
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
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductPage);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3124:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ FollowerPointerCard)
/* harmony export */ });
/* unused harmony export FollowPointer */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6197);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4246);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_2__, _lib_utils__WEBPACK_IMPORTED_MODULE_3__]);
([framer_motion__WEBPACK_IMPORTED_MODULE_2__, _lib_utils__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Core component that receives mouse positions and renders pointer and content




const FollowerPointerCard = ({ children, className, title })=>{
    const x = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);
    const y = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);
    const ref = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);
    const [rect, setRect] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isInside, setIsInside] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // Add this line
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (ref.current) {
            setRect(ref.current.getBoundingClientRect());
        }
    }, []);
    const handleMouseMove = (e)=>{
        if (rect) {
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            x.set(e.clientX - rect.left + scrollX);
            y.set(e.clientY - rect.top + scrollY);
        }
    };
    const handleMouseLeave = ()=>{
        setIsInside(false);
    };
    const handleMouseEnter = ()=>{
        setIsInside(true);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter,
        onMouseMove: handleMouseMove,
        style: {
            cursor: "none"
        },
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("relative", className),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.AnimatePresence, {
                children: isInside && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(FollowPointer, {
                    x: x,
                    y: y,
                    title: title
                })
            }),
            children
        ]
    });
};
const FollowPointer = ({ x, y, title })=>{
    const colors = [
        "var(--sky-500)",
        "var(--neutral-500)",
        "var(--teal-500)",
        "var(--green-500)",
        "var(--blue-500)",
        "var(--red-500)",
        "var(--yellow-500)"
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
        className: "h-4 w-4 rounded-full absolute z-50",
        style: {
            top: y,
            left: x,
            pointerEvents: "none"
        },
        initial: {
            scale: 1,
            opacity: 1
        },
        animate: {
            scale: 1,
            opacity: 1
        },
        exit: {
            scale: 0,
            opacity: 0
        },
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                stroke: "currentColor",
                fill: "currentColor",
                strokeWidth: "1",
                viewBox: "0 0 16 16",
                className: "h-6 w-6 text-sky-500 transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-sky-600",
                height: "1em",
                width: "1em",
                xmlns: "http://www.w3.org/2000/svg",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                    d: "M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
                style: {
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                },
                initial: {
                    scale: 0.5,
                    opacity: 0
                },
                animate: {
                    scale: 1,
                    opacity: 1
                },
                exit: {
                    scale: 0.5,
                    opacity: 0
                },
                className: "px-2 py-2 bg-neutral-200 text-white whitespace-nowrap min-w-max text-xs rounded-full",
                children: title || `William Shakespeare`
            })
        ]
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;