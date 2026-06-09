"use strict";
exports.id = 176;
exports.ids = [176];
exports.modules = {

/***/ 8176:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _context_CartContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9605);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6197);
/* harmony import */ var _components_ui_animated_tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(335);
/* harmony import */ var _heroui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4255);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_3__, _components_ui_animated_tooltip__WEBPACK_IMPORTED_MODULE_4__, _heroui_react__WEBPACK_IMPORTED_MODULE_5__]);
([framer_motion__WEBPACK_IMPORTED_MODULE_3__, _components_ui_animated_tooltip__WEBPACK_IMPORTED_MODULE_4__, _heroui_react__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const people = [
    {
        id: 1,
        name: "John Doe",
        designation: "Software Engineer",
        image: "/images/line (2).png"
    },
    {
        id: 2,
        name: "Robert Johnson",
        designation: "Product Manager",
        image: "/images/line (2).png"
    },
    {
        id: 3,
        name: "Jane Smith",
        designation: "Data Scientist",
        image: "/images/line (2).png"
    },
    {
        id: 4,
        name: "Emily Davis",
        designation: "UX Designer",
        image: "/images/line (2).png"
    },
    {
        id: 5,
        name: "Tyler Durden",
        designation: "Soap Developer",
        image: "/images/line (2).png"
    },
    {
        id: 6,
        name: "Dora",
        designation: "The Explorer",
        image: "/images/line (2).png"
    }
];
const Sidebar = ()=>{
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true); // 控制側邊欄顯示與否
    const { cartItems, totalPrice, removeFromCart, updateQuantity } = (0,_context_CartContext__WEBPACK_IMPORTED_MODULE_2__/* .useCart */ .j)();
    const toggleSidebar = ()=>{
        setIsOpen(!isOpen); // 切換側邊欄的開關
    };
    // 將側邊欄中的商品轉換為 WooCommerce 需要的格式
    const getWooCommerceFormData = ()=>{
        const addToCartIds = [];
        const quantities = [];
        // 獲取每個商品的ID和數量
        cartItems.forEach((item)=>{
            addToCartIds.push(item.id);
            quantities.push(item.quantity);
        });
        return {
            addToCartIds,
            quantities
        };
    };
    // 生成 URL 並在提交表單前打印到 console
    const handleSubmit = (e)=>{
        e.preventDefault(); // 防止表單實際提交
        const { addToCartIds, quantities } = getWooCommerceFormData();
        let url = "https://starislandbaby.com/test/cart/?add-to-cart=";
        // 添加所有商品 ID 和數量到 URL 中
        url += addToCartIds.join(",");
        url += "&quantity=" + quantities.join(",");
        console.log("生成的 URL:", url);
        // 跳轉到 WooCommerce 購物車頁面
        window.location.href = url;
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: " bg-gray-200 fixed w-[100vw] z-[99999999999] right-0 top-0",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "relative w-full flex",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                    onClick: toggleSidebar,
                    className: " top-1/2 absolute right-[560px] bg-blue-500 w-[50px] text-white p-2 rounded-l-md",
                    children: [
                        isOpen ? "收起" : "展開",
                        " 側邊欄"
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                    className: "sidebar absolute z-[99999999] top-0 right-0 w-[500px] bg-white  border  h-[100vh]",
                    initial: {
                        x: "100%"
                    },
                    animate: {
                        x: isOpen ? 0 : "100%"
                    },
                    transition: {
                        duration: 0.3
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                            children: "購物車"
                        }),
                        cartItems.length === 0 ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: "您的購物車是空的"
                        }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                            className: "overflow-hidden relative flex flex-col",
                            children: cartItems.map((item, index)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                    className: "flex px-5  justify-center items-center w-full overflow-scroll !border-gray-200 gap-4 border-b py-2",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "img-wrap w-1/2",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                src: item.image,
                                                alt: item.name,
                                                width: 50,
                                                height: 50,
                                                className: "w-full"
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "w-1/2 flex justify-between h-full",
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: "ml-auto text-right",
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                className: "block font-bold",
                                                                children: item.name
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                children: [
                                                                    "顏色: ",
                                                                    item.color
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                children: [
                                                                    "尺寸: ",
                                                                    item.size
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                children: [
                                                                    "$",
                                                                    item.price
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                children: [
                                                                    "數量:",
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                        onClick: ()=>updateQuantity(item.id, item.color, item.size, item.quantity - 1),
                                                                        children: "-"
                                                                    }),
                                                                    item.quantity,
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                        onClick: ()=>updateQuantity(item.id, item.color, item.size, item.quantity + 1),
                                                                        children: "+"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                                onClick: ()=>removeFromCart(item.id, item.color, item.size),
                                                                className: "text-red-500",
                                                                children: "刪除"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        })
                                    ]
                                }, index))
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: " w-full text-left mt-3 pl-9 bottom-0 left-0 py-2 ",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                className: "text-[20px] ",
                                children: [
                                    "訂單總金額: $",
                                    totalPrice
                                ]
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("form", {
                            onSubmit: handleSubmit,
                            className: "p-4 flex ",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_5__.Button, {
                                type: "submit",
                                className: "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                                radius: "full",
                                children: "訂單 結帳去"
                            })
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sidebar);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 335:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony export AnimatedTooltip */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6197);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_3__]);
framer_motion__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
/* __next_internal_client_entry_do_not_use__ AnimatedTooltip auto */ 



const AnimatedTooltip = ({ items })=>{
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const springConfig = {
        stiffness: 100,
        damping: 5
    };
    const x = useMotionValue(0); // going to set this value on mouse move
    // rotate the tooltip
    const rotate = useSpring(useTransform(x, [
        -100,
        100
    ], [
        -45,
        45
    ]), springConfig);
    // translate the tooltip
    const translateX = useSpring(useTransform(x, [
        -100,
        100
    ], [
        -50,
        50
    ]), springConfig);
    const handleMouseMove = (event)=>{
        const halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
    };
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: items.map((item, idx)=>/*#__PURE__*/ _jsxs("div", {
                className: "-mr-4  relative group",
                onMouseEnter: ()=>setHoveredIndex(item.id),
                onMouseLeave: ()=>setHoveredIndex(null),
                children: [
                    /*#__PURE__*/ _jsx(AnimatePresence, {
                        mode: "popLayout",
                        children: hoveredIndex === item.id && /*#__PURE__*/ _jsxs(motion.div, {
                            initial: {
                                opacity: 0,
                                y: 20,
                                scale: 0.6
                            },
                            animate: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 10
                                }
                            },
                            exit: {
                                opacity: 0,
                                y: 20,
                                scale: 0.6
                            },
                            style: {
                                translateX: translateX,
                                rotate: rotate,
                                whiteSpace: "nowrap"
                            },
                            className: "absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent bg-[#1ccd2b] to-transparent h-px "
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px "
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "font-bold text-white relative z-30 text-base",
                                    children: item.name
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "text-white text-xs",
                                    children: item.designation
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Image, {
                        onMouseMove: handleMouseMove,
                        height: 100,
                        width: 100,
                        src: item.image,
                        alt: item.name,
                        className: "object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
                    })
                ]
            }, item.name))
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;