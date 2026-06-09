"use strict";
exports.id = 903;
exports.ids = [903];
exports.modules = {

/***/ 8428:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony export default */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2750);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_NavbarTest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6373);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6197);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_NavbarTest__WEBPACK_IMPORTED_MODULE_3__, framer_motion__WEBPACK_IMPORTED_MODULE_4__]);
([_components_NavbarTest__WEBPACK_IMPORTED_MODULE_3__, framer_motion__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// import NavbarTest from "../components/NavbarTest";
function Features() {
    return /*#__PURE__*/ _jsx("div", {
        className: "flex  w-auto justify-start p-1 text-neutral-200 md:justify-center",
        children: /*#__PURE__*/ _jsx(Tabs, {})
    });
}
const Tabs = ()=>{
    const [selected, setSelected] = useState(null);
    const [dir, setDir] = useState(null);
    const handleSetSelected = (val)=>{
        if (typeof selected === "number" && typeof val === "number") {
            setDir(selected > val ? "r" : "l");
        } else if (val === null) {
            setDir(null);
        }
        setSelected(val);
    };
    return /*#__PURE__*/ _jsxs("div", {
        onMouseLeave: ()=>handleSetSelected(null),
        className: "relative flex h-fit gap-2",
        children: [
            TABS.map((t)=>{
                return /*#__PURE__*/ _jsx(Tab, {
                    selected: selected,
                    handleSetSelected: handleSetSelected,
                    tab: t.id,
                    className: "tabs-span",
                    children: t.title
                }, t.id);
            }),
            /*#__PURE__*/ _jsx(AnimatePresence, {
                children: selected && /*#__PURE__*/ _jsx(Content, {
                    dir: dir,
                    selected: selected
                })
            })
        ]
    });
};
const Tab = ({ children, tab, handleSetSelected, selected })=>{
    return /*#__PURE__*/ _jsxs("button", {
        id: `shift-tab-${tab}`,
        onMouseEnter: ()=>handleSetSelected(tab),
        onClick: ()=>handleSetSelected(tab),
        className: `flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${selected === tab ? "  text-neutral-100" : "text-neutral-200 hover:text-white duration-100"}`,
        children: [
            /*#__PURE__*/ _jsx("span", {
                children: children
            }),
            /*#__PURE__*/ _jsx(FiChevronDown, {
                className: `transition-transform ${selected === tab ? "rotate-180" : ""}`
            })
        ]
    });
};
const Content = ({ selected, dir })=>{
    return /*#__PURE__*/ _jsxs(motion.div, {
        id: "overlay-content",
        initial: {
            opacity: 0,
            y: 8
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: 8
        },
        className: "absolute left-[-30vw] top-[calc(100%_+_10px)] w-[80vw] rounded-lg border-2 py-16 px-10 border-[#CFC3A9] bg-[#D89D7A] ",
        children: [
            /*#__PURE__*/ _jsx(Bridge, {}),
            /*#__PURE__*/ _jsx(Nub, {
                selected: selected
            }),
            TABS.map((t)=>{
                return /*#__PURE__*/ _jsx("div", {
                    className: "overflow-hidden",
                    children: selected === t.id && /*#__PURE__*/ _jsx(motion.div, {
                        initial: {
                            opacity: 0,
                            x: dir === "l" ? 100 : dir === "r" ? -100 : 0
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        transition: {
                            duration: 0.25,
                            ease: "easeInOut"
                        },
                        children: /*#__PURE__*/ _jsx(t.Component, {})
                    })
                }, t.id);
            })
        ]
    });
};
const Bridge = ()=>/*#__PURE__*/ _jsx("div", {
        className: "absolute -top-[24px] left-0 right-0 h-[24px]"
    });
const Nub = ({ selected })=>{
    const [left, setLeft] = useState(0);
    useEffect(()=>{
        moveNub();
    }, [
        selected
    ]);
    const moveNub = ()=>{
        if (selected) {
            const hoveredTab = document.getElementById(`shift-tab-${selected}`);
            const overlayContent = document.getElementById("overlay-content");
            if (!hoveredTab || !overlayContent) return;
            const tabRect = hoveredTab.getBoundingClientRect();
            const { left: contentLeft } = overlayContent.getBoundingClientRect();
            const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;
            setLeft(tabCenter);
        }
    };
    return /*#__PURE__*/ _jsx(motion.span, {
        style: {
            clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)"
        },
        animate: {
            left
        },
        transition: {
            duration: 0.25,
            ease: "easeInOut"
        },
        className: "absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl bg-[#D89D7A] border-2 border-[#D89D7A]"
    });
};
const Products = ()=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(NavbarTest, {})
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                className: "ml-auto mt-4 flex items-center gap-1 text-sm text-indigo-300",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: "View more"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiArrowRight, {})
                ]
            })
        ]
    });
};
const Pricing = ()=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "grid grid-cols-3 gap-4 divide-x divide-neutral-700",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                href: "#",
                className: "flex w-full flex-col items-center justify-center py-2 text-neutral-200 hover:text-white duration-100 transition-colors hover:text-neutral-50",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiHome, {
                        className: "mb-2 text-xl text-indigo-300"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "text-xs",
                        children: "Startup"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                href: "#",
                className: "flex w-full flex-col items-center justify-center py-2 text-neutral-200 hover:text-white duration-100 transition-colors hover:text-neutral-50",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiBarChart2, {
                        className: "mb-2 text-xl text-indigo-300"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "text-xs",
                        children: "Scaleup"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                href: "#",
                className: "flex w-full flex-col items-center justify-center py-2 text-neutral-200 hover:text-white duration-100 transition-colors hover:text-neutral-50",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiPieChart, {
                        className: "mb-2 text-xl text-indigo-300"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "text-xs",
                        children: "Enterprise"
                    })
                ]
            })
        ]
    });
};
const Blog = ()=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                        href: "#",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                className: "mb-2 h-14 w-full rounded object-cover",
                                src: "/imgs/blog/4.png",
                                alt: "Placeholder image"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                                className: "mb-0.5 text-sm font-medium",
                                children: "Lorem ipsum dolor"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                className: "text-xs text-neutral-200 hover:text-white duration-100",
                                children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo quidem eos."
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                        href: "#",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                className: "mb-2 h-14 w-full rounded object-cover",
                                src: "/imgs/blog/5.png",
                                alt: "Placeholder image"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                                className: "mb-0.5 text-sm font-medium",
                                children: "Lorem ipsum dolor"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                className: "text-xs text-neutral-200 hover:text-white duration-100",
                                children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo quidem eos."
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                className: "ml-auto mt-4 flex items-center gap-1 text-sm text-indigo-300",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: "View more"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiArrowRight, {})
                ]
            })
        ]
    });
};
const TABS = [
    {
        title: "熱銷產品",
        Component: Products
    },
    {
        title: "Pricing",
        Component: Pricing
    },
    {
        title: "Blog",
        Component: Blog
    }
].map((n, idx)=>({
        ...n,
        id: idx + 1
    }));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9701:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony export default */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2406);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__]);
_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const myLoader01 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/1920x768/TW/${src}?w=${width}&q=${quality || 75}`;
};
const myLoader02 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/640x640/TW/${src}?w=${width}&q=${quality || 75}`;
};
function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");
    return /*#__PURE__*/ _jsxs("div", {
        className: " w-full md:w-1/2 pr-0 md:pr-3 ",
        children: [
            /*#__PURE__*/ _jsx(Button, {
                onPress: onOpen,
                className: "h-auto w-full p-0 m-0  border-2 hover:bg-gray-800 duration-250 hover:text-white  border-gray-500  bg-transparent rounded-full px-4 py-3 my-3",
                children: "Contact Us"
            }),
            /*#__PURE__*/ _jsx(RadioGroup, {
                orientation: "horizontal",
                value: modalPlacement,
                onValueChange: setModalPlacement
            }),
            /*#__PURE__*/ _jsx(Modal, {
                isOpen: isOpen,
                placement: modalPlacement,
                onOpenChange: onOpenChange,
                className: "z-50  p-0 m-0  ",
                children: /*#__PURE__*/ _jsx(ModalContent, {
                    children: (onClose)=>/*#__PURE__*/ _jsxs(_Fragment, {
                            children: [
                                /*#__PURE__*/ _jsx(ModalHeader, {
                                    className: "flex flex-col gap-1",
                                    children: "Contact Us - Inquire Now"
                                }),
                                /*#__PURE__*/ _jsx(ModalBody, {
                                    children: /*#__PURE__*/ _jsx("iframe", {
                                        title: "contact-forms",
                                        src: "https://www.ultraehp.com/customized-iframe-en.html",
                                        loading: "lazy",
                                        className: "w-full md:w-[400px] h-[500px]",
                                        strategy: "lazyOnload",
                                        frameborder: "0",
                                        webkitallowfullscreen: "",
                                        mozallowfullscreen: "",
                                        allowfullscreen: ""
                                    })
                                })
                            ]
                        })
                })
            }),
            /*#__PURE__*/ _jsx(Modal, {
                isOpen: isOpen,
                placement: modalPlacement,
                onOpenChange: onOpenChange,
                className: "z-[99999999]  ",
                children: /*#__PURE__*/ _jsx(ModalContent, {
                    children: (onClose)=>/*#__PURE__*/ _jsxs(_Fragment, {
                            children: [
                                /*#__PURE__*/ _jsx(ModalHeader, {
                                    className: "flex flex-col gap-1",
                                    children: "Contact Us - Inquire Now"
                                }),
                                /*#__PURE__*/ _jsx(ModalBody, {
                                    children: /*#__PURE__*/ _jsx("iframe", {
                                        title: "contact-forms",
                                        src: "https://www.ultraehp.com/customized-iframe-en.html",
                                        loading: "lazy",
                                        className: "w-full md:w-[400px] h-[500px]",
                                        strategy: "lazyOnload",
                                        frameborder: "0",
                                        webkitallowfullscreen: "",
                                        mozallowfullscreen: "",
                                        allowfullscreen: ""
                                    })
                                })
                            ]
                        })
                })
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6795:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Navbar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ default auto */ 


function Navbar() {
    const [isScrolled, setIsScrolled] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const handleScroll = ()=>{
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return ()=>window.removeEventListener("scroll", handleScroll);
    }, []);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: " top-2 left-0 w-full  shadow-md  z-50",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
            href: "/",
            className: "Logo rounded-[50px] mx-auto block py-2 text-center text-[30px] font-extrabold px-3 text-black",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                src: "/images/company-logo.png",
                alt: "company-logo",
                className: `transition-all mx-auto mt-4 w-[45px] sm:w-[55px] mr-4 duration-300 
            ${isScrolled ? "lg:w-[55px]" : "lg:w-[110px]"}`
            })
        })
    });
}


/***/ }),

/***/ 4836:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tabs_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1225);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6197);
/* harmony import */ var _components_ModalBtn_2_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9701);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1162);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_themes__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_7__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tabs_jsx__WEBPACK_IMPORTED_MODULE_2__, framer_motion__WEBPACK_IMPORTED_MODULE_4__, _components_ModalBtn_2_jsx__WEBPACK_IMPORTED_MODULE_5__]);
([_tabs_jsx__WEBPACK_IMPORTED_MODULE_2__, framer_motion__WEBPACK_IMPORTED_MODULE_4__, _components_ModalBtn_2_jsx__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* __next_internal_client_entry_do_not_use__ default auto */ 

 // Adjust the path as per your file structure

// import { ThemeSwitcher } from "./ThemeSwitcher.tsx";



// import Switcher from '../Switcher.js';

// import MobileMenu from "../../components/MobileHeader/index.jsx";
// import modalBTN from '../../components//mobileMenu/index.jsx'
// import { ThemeSwitcher } from '@/app/ThemeSwitcher';
// import Switchers from '../Switcher.js/index.js'
// import MobileMenu from "../../components/Navbar/mobile-menu/MobileMenu.jsx";
const myLoader01 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}&q=${quality || 75}`;
};
const myLoader02 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}&q=${quality || 75}`;
};
const myLoader03 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}&q=${quality || 75}`;
};
const myLoader04 = ({ src, width, quality })=>{
    return `https://www.ultraehp.com/images/nav/mobile-nav/${src}?w=${width}&q=${quality || 75}`;
};
function App() {
    const [open, setOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const isOpen = ()=>{
        setOpen(true);
    };
    const closeMenu = ()=>{
        setOpen(false);
    };
    const { systemTheme, theme, setTheme } = (0,next_themes__WEBPACK_IMPORTED_MODULE_6__.useTheme)();
    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        setMounted(true);
    }, []);
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    //lets start animation
    const item = {
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                ease: "easeInOut",
                duration: 0.3,
                delay: 1.2
            }
        }
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_tabs_jsx__WEBPACK_IMPORTED_MODULE_2__/* .SlideTabsExample */ .G, {})
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1225:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ SlideTabsExample)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _heroui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4255);
/* harmony import */ var _components_NavbarTestSideBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4763);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6197);
/* harmony import */ var _Logo_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6795);
/* harmony import */ var next_image_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5564);
/* harmony import */ var next_image_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_image_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_NavbarTest_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6373);
/* harmony import */ var _components_SideBar_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6842);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3015);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7644);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(swiper_css__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var swiper_css_pagination__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5392);
/* harmony import */ var swiper_css_pagination__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(swiper_css_pagination__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var swiper_css_autoplay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1230);
/* harmony import */ var swiper_css_autoplay__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(swiper_css_autoplay__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2184);
/* harmony import */ var react_fast_marquee__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(5700);
/* harmony import */ var react_fast_marquee__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(react_fast_marquee__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _components_DropdownMenu_jsx__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(8428);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroui_react__WEBPACK_IMPORTED_MODULE_2__, _components_NavbarTestSideBar__WEBPACK_IMPORTED_MODULE_3__, framer_motion__WEBPACK_IMPORTED_MODULE_4__, _components_NavbarTest_jsx__WEBPACK_IMPORTED_MODULE_7__, _components_SideBar_jsx__WEBPACK_IMPORTED_MODULE_8__, swiper_react__WEBPACK_IMPORTED_MODULE_9__, swiper_modules__WEBPACK_IMPORTED_MODULE_13__, _components_DropdownMenu_jsx__WEBPACK_IMPORTED_MODULE_15__]);
([_heroui_react__WEBPACK_IMPORTED_MODULE_2__, _components_NavbarTestSideBar__WEBPACK_IMPORTED_MODULE_3__, framer_motion__WEBPACK_IMPORTED_MODULE_4__, _components_NavbarTest_jsx__WEBPACK_IMPORTED_MODULE_7__, _components_SideBar_jsx__WEBPACK_IMPORTED_MODULE_8__, swiper_react__WEBPACK_IMPORTED_MODULE_9__, swiper_modules__WEBPACK_IMPORTED_MODULE_13__, _components_DropdownMenu_jsx__WEBPACK_IMPORTED_MODULE_15__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Import necessary modules and components
/* __next_internal_client_entry_do_not_use__ SlideTabsExample auto */ 













// import MobileMenu from "../mobileMenu/index.jsx";


// Define SlideTabsExample component
const SlideTabsExample = ()=>{
    const [isMenuOpen, setIsMenuOpen] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out"
    ];
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "top-0 mt-[-40px]  pt-8 pb-2 flex mx-auto left-[40%]   justify-center bg-white flex-col items-center fixed  w-[100%] z-[999999]",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "top px-2 sm:px-10  lg:bg-[#fff] flex justify-center items-center w-full py-1",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: " hidden w-1/2 sm:w-[15%]  sm:flex justify-center",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Logo_jsx__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {})
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "Logo-section   sm:block flex justify-center flex-row w-[100%] ",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-1/3 flex justify-center",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Navbar, {
                                        className: "!bg-transparent !backdrop-blur-0 block sm:hidden",
                                        onMenuOpenChange: setIsMenuOpen,
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarContent, {
                                                className: "hidden sm:flex  gap-4",
                                                justify: "center",
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarItem, {
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                                            color: "foreground",
                                                            href: "#",
                                                            children: "Features"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarItem, {
                                                        isActive: true,
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                                            "aria-current": "page",
                                                            href: "#",
                                                            children: "Customers"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarItem, {
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                                            color: "foreground",
                                                            href: "#",
                                                            children: "Integrations"
                                                        })
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarContent, {
                                                justify: "end",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarMenuToggle, {
                                                    "aria-label": isMenuOpen ? "Close menu" : "Open menu",
                                                    className: "sm:hidden !pt-4"
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarMenu, {
                                                className: "!pt-20",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_NavbarTestSideBar__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {})
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-1/3 flex justify-center",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Navbar, {
                                        className: "!bg-transparent ml-3 !backdrop-blur-0 block mx-auto sm:hidden",
                                        onMenuOpenChange: setIsMenuOpen,
                                        children: [
                                            " ",
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarContent, {
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.NavbarBrand, {
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Logo_jsx__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {})
                                                })
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "w-1/3 flex justify-center items-center",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                        href: "https://starislandbaby.com/test/cart",
                                        children: [
                                            " ",
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/online-shopping.png",
                                                placeholder: "empty",
                                                className: "w-[34px] mt-4 h-[34px] block sm:hidden",
                                                width: 40,
                                                height: 40,
                                                alt: "cart-logo",
                                                loading: "lazy"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: " hidden lg:flex w-1/2 mx-auto justify-around",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "flex pt-4 pb-2 justify-center",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(swiper_react__WEBPACK_IMPORTED_MODULE_9__.Swiper, {
                                            direction: "vertical",
                                            autoplay: {
                                                delay: 2500,
                                                disableOnInteraction: false
                                            },
                                            loop: true,
                                            className: "h-[20px]  justify-center flex items-center",
                                            modules: [
                                                swiper_modules__WEBPACK_IMPORTED_MODULE_13__.Autoplay
                                            ],
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_9__.SwiperSlide, {
                                                    className: "flex justify-center",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: "text-center text-[14.5px]",
                                                        children: "全館單筆消費|滿999享單次超取免運"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_9__.SwiperSlide, {
                                                    className: "flex justify-center",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: "text-center text-[14.5px]",
                                                        children: "點我加入官方line"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_9__.SwiperSlide, {
                                                    className: "flex justify-center",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: "text-center text-[14.5px]",
                                                        children: "當月小壽星|快來領生日禮\uD83C\uDF82"
                                                    })
                                                })
                                            ]
                                        })
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "Logo-section pr-8   flex justify-center items-center w-[10%] ",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "icon-wrap hidden lg:flex  pr-[30px]  items-center",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                            href: "https://www.facebook.com/profile.php?id=61569146001285",
                                            className: "w-[22px] h-[22px] mx-1",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/facebook-app-symbol.png",
                                                alt: "icon",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                width: 25,
                                                height: 25
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                            href: "https://line.me/R/ti/p/@391huuts",
                                            className: "w-[22px] h-[22px] mx-1",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/line (2).png",
                                                alt: "icon",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                width: 20,
                                                className: "ml-1",
                                                height: 20
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                            href: "https://www.instagram.com/starisland_baby2022?igsh=MXVkeWExOXBsdWx1NQ%3D%3D&utm_source=qr",
                                            className: "w-[22px] h-[22px] mx-1",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/instagram (1).png",
                                                alt: "icon",
                                                className: "ml-3",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                width: 16,
                                                height: 16
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                            href: "https://starislandbaby.com/test/my-account/",
                                            className: "w-[22px] h-[22px] mx-1",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/user.png",
                                                alt: "icon",
                                                className: "ml-3",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                width: 16,
                                                height: 16
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroui_react__WEBPACK_IMPORTED_MODULE_2__.Link, {
                                            href: "https://starislandbaby.com/test/cart/",
                                            className: "w-[24px] h-[24px] mx-2",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_6___default()), {
                                                src: "/images/online-shopping.png",
                                                alt: "icon",
                                                className: "ml-3",
                                                placeholder: "empty",
                                                loading: "lazy",
                                                width: 16,
                                                height: 16
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "top-0  hidden right-3 left-auto z-[999999999] sm:block lg:hidden fixed w-[100vw]",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "absolute right-0  top-5",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_SideBar_jsx__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {})
                                    })
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "bottom   bg-[#676662] w-full hidden lg:flex justify-center  items-center",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "marquee fixed bg-white notice-modal mx-auto w-[100vw] rounded-[5px] py-1   flex flex-row p-1 bg-whote  justify-center top-0"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "Logo-section w-1/2 sm:w-[10%]  flex justify-center"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "mobile-menu block sm:hidden w-1/2"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "Logo-section  sm:block flex  mx-auto   flex-row  w-[100%] xl:w-[80%] ",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex flex-row",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_NavbarTest_jsx__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z, {})
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "Logo-section   flex justify-center items-center w-[10%] "
                        })
                    ]
                })
            ]
        })
    });
};
// Define SlideTabs component
const SlideTabs = ()=>{
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0
    });
    return /*#__PURE__*/ _jsx("ul", {
        onMouseLeave: ()=>{
            setPosition((prevPosition)=>({
                    ...prevPosition,
                    opacity: 0
                }));
        },
        className: "relative mx-auto md:flex w-fit  rounded-full bg-white p-1   hidden ",
        children: /*#__PURE__*/ _jsx(Cursor, {
            position: position
        })
    });
};
// Define Tab component
const Tab = ({ children, setPosition })=>{
    const ref = useRef(null);
    return /*#__PURE__*/ _jsx("li", {
        ref: ref,
        onMouseEnter: ()=>{
            if (ref.current) {
                const { width } = ref.current.getBoundingClientRect();
                setPosition({
                    left: ref.current.offsetLeft,
                    width,
                    opacity: 1
                });
            }
        },
        className: "relative z-10 block cursor-pointer px-3 py-1.5 text-[13.8px] uppercase text-white mix-blend-difference md:px-5 md:py-1 ",
        children: children
    });
};
// Define Cursor component
const Cursor = ({ position })=>{
    return /*#__PURE__*/ _jsx(motion.li, {
        animate: {
            ...position
        },
        className: "absolute z-0 h-3 rounded-full bg-black md:h-7"
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6373:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5941);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9648);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2750);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6197);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([swr__WEBPACK_IMPORTED_MODULE_1__, axios__WEBPACK_IMPORTED_MODULE_2__, framer_motion__WEBPACK_IMPORTED_MODULE_5__]);
([swr__WEBPACK_IMPORTED_MODULE_1__, axios__WEBPACK_IMPORTED_MODULE_2__, framer_motion__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







const fetchCategories = async ()=>{
    let allCategories = [];
    let page = 1;
    const perPage = 100;
    const consumerKey = "ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b";
    const consumerSecret = "cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f";
    try {
        while(true){
            const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://starislandbaby.com/test/wp-json/wc/v3/products/categories", {
                params: {
                    consumer_key: consumerKey,
                    consumer_secret: consumerSecret,
                    page,
                    per_page: perPage
                }
            });
            if (response.data.length === 0) break;
            allCategories = [
                ...allCategories,
                ...response.data
            ];
            page++;
        }
        return allCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
const Navbar = ()=>{
    const { data: categories, isValidating } = (0,swr__WEBPACK_IMPORTED_MODULE_1__["default"])("categories", fetchCategories, {
        fallbackData: [],
        refreshInterval: 60000,
        revalidateOnFocus: false
    });
    const [localCategories, setLocalCategories] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)([]);
    // 當 categories 更新時，避免 UI 閃爍，先更新 useState
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(()=>{
        if (categories.length > 0) {
            setLocalCategories(categories);
        }
    }, [
        categories
    ]);
    const [activeCategory, setActiveCategory] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(null);
    // 確保分類按照 menu_order 排序
    const sortedCategories = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(()=>[
            ...localCategories
        ].sort((a, b)=>a.menu_order - b.menu_order), [
        localCategories
    ]);
    // 遞歸渲染子分類
    const renderCategories = (parentId)=>{
        const subCategories = sortedCategories.filter((category)=>category.parent === parentId);
        if (subCategories.length === 0) return null;
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                className: "flex flex-col text-white justify-center space-y-2 pl-4",
                children: subCategories.map((category)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                        className: "flex text-white",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                                href: `/category/${category.slug}`,
                                className: "text-black mt-4",
                                children: category.name
                            }),
                            renderCategories(category.id)
                        ]
                    }, category.id))
            })
        });
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex justify-center  mx-auto",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("nav", {
                className: "flex mx-auto  justify-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                    className: "flex  space-x-8 mx-auto justify-center relative",
                    children: isValidating && localCategories.length === 0 ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "text-gray-500"
                    }) : sortedCategories.filter((category)=>category.parent === 0).map((category)=>{
                        const hasSubCategories = sortedCategories.some((cat)=>cat.parent === category.id);
                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex ",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                className: "relative text-gray-300 py-5 hover:text-white duration-150 text-[14px] font-bold",
                                onMouseEnter: ()=>setActiveCategory(category.id),
                                onMouseLeave: ()=>setActiveCategory(null),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                        className: "flex items-center gap-0",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                                                href: `/category/${category.slug}`,
                                                children: category.name
                                            }),
                                            hasSubCategories && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "ml-2",
                                                children: activeCategory === category.id ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__.FiChevronUp, {}) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__.FiChevronDown, {})
                                            })
                                        ]
                                    }),
                                    activeCategory === category.id && hasSubCategories && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                                        className: "absolute top-10 left-0 w-max bg-white duration-200 tracking-widest mt-2 py-8 font-medium rounded-xl pl-5 pr-[80px] shadow-lg z-10",
                                        initial: {
                                            opacity: 0,
                                            y: -20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: -20
                                        },
                                        transition: {
                                            duration: 0.3
                                        },
                                        children: renderCategories(category.id)
                                    })
                                ]
                            }, category.id)
                        });
                    })
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex ml-5 flex-row justify-center items-center",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                        href: "/gift",
                        className: "text-[#d1d5db] font-extrabold ml-4 text-[14px]",
                        children: "送禮專區"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                        href: "/qa",
                        className: "text-[#d1d5db] font-extrabold ml-10 text-[14px]",
                        children: "購物說明"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                        href: "/about",
                        className: "ml-10 text-[#d1d5db] font-extrabold text-[14px]",
                        children: "關於我們"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                        href: "/size",
                        className: "ml-10 text-[#d1d5db] font-extrabold text-[14px]",
                        children: "尺寸參考"
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Navbar);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4763:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9648);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2750);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_2__]);
axios__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






const Navbar = ()=>{
    const [categories, setCategories] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [activeCategory, setActiveCategory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchCategories = async ()=>{
            let allCategories = [];
            let page = 1;
            const perPage = 100;
            const consumerKey = "ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b";
            const consumerSecret = "cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f";
            try {
                while(true){
                    const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://starislandbaby.com/test/wp-json/wc/v3/products/categories", {
                        params: {
                            consumer_key: consumerKey,
                            consumer_secret: consumerSecret,
                            page,
                            per_page: perPage
                        }
                    });
                    if (response.data.length === 0) break;
                    allCategories = [
                        ...allCategories,
                        ...response.data
                    ];
                    page++;
                }
                setCategories(allCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    const toggleSubcategories = (categoryId)=>{
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };
    const renderCategories = (parentId)=>{
        const subCategories = categories?.filter((category)=>category.parent === parentId) || [];
        if (!subCategories.length) return null;
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
            className: "pl-4 flex flex-col space-y-2",
            children: subCategories.map((category)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                    className: "flex",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                            href: `/category/${category.slug}`,
                            children: category.name
                        }),
                        renderCategories(category.id)
                    ]
                }, category.id))
        });
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
        className: "relative flex flex-col justify-center items-start",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                className: "border-b-1 w-full border-white py-3",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                    className: "font-bold text-[18px] text-gray-600 hover:text-black duration-200",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                        href: "/qa",
                        children: "Q&A"
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                className: "flex flex-col space-y-4",
                children: categories && categories.filter((category)=>category.parent === 0).map((category)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                        className: "relative text-gray-600 duration-150 my-2 font-bold",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                onClick: ()=>toggleSubcategories(category.id),
                                className: "flex items-center gap-2 w-full hover:text-black",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                                        href: `/category/${category.slug}`,
                                        passHref: true,
                                        children: category.name
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "ml-2",
                                        children: activeCategory === category.id ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__.FiChevronUp, {}) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_4__.FiChevronDown, {})
                                    })
                                ]
                            }),
                            activeCategory === category.id && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "mt-2",
                                children: renderCategories(category.id)
                            })
                        ]
                    }))
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "MobileIcons flex mt-10 w-full",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: "https://www.facebook.com/profile.php?id=61569146001285",
                        className: "flex justify-center items-center mr-3 ",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                            src: "/images/facebook-app-symbol.png",
                            placeholder: "empty",
                            alt: "icon",
                            loading: "lazy",
                            className: "w-[45px] h-[45px]",
                            width: 45,
                            height: 45
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: "https://www.instagram.com/starisland_baby2022?igsh=MXVkeWExOXBsdWx1NQ%3D%3D&utm_source=qr",
                        className: "flex justify-center items-center mr-5 ",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                            src: "/images/instagram (1).png",
                            placeholder: "empty",
                            alt: "icon",
                            loading: "lazy",
                            className: "w-[45px] h-[45px]",
                            width: 45,
                            height: 45
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: "https://line.me/R/ti/p/@391huuts",
                        className: "flex justify-center items-center mr-3 ",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_5___default()), {
                            src: "/images/line (2).png",
                            placeholder: "empty",
                            alt: "icon",
                            loading: "lazy",
                            className: "w-[45px] h-[45px]",
                            width: 45,
                            height: 45
                        })
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mt-8 flex justify-center w-full"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Navbar);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6842:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2750);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6197);
/* harmony import */ var _components_NavbarTestSideBar_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4763);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_3__, _components_NavbarTestSideBar_jsx__WEBPACK_IMPORTED_MODULE_4__]);
([framer_motion__WEBPACK_IMPORTED_MODULE_3__, _components_NavbarTestSideBar_jsx__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





class Example extends react__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor(props){
        super(props);
        this.ToggleClose = ()=>{
            this.setState((prevState)=>{
                const newState = {
                    open: !prevState.open
                };
                if (newState.open) {
                    // 禁止滚动
                    document.body.style.overflow = "hidden";
                } else {
                    // 恢复滚动
                    document.body.style.overflow = "auto";
                }
                return newState;
            });
        };
        this.setSelected = (title)=>{
            this.setState({
                selected: title
            });
        };
        this.Option = ({ Icon, title, notifs })=>{
            const { open, selected } = this.state;
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.button, {
                layout: true,
                onClick: ()=>this.setSelected(title),
                className: `relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`,
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                        layout: true,
                        className: "grid h-full w-10 place-content-center text-lg",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Icon, {})
                    }),
                    open && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.span, {
                        layout: true,
                        initial: {
                            opacity: 0,
                            y: 12
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.125
                        },
                        className: "text-xs font-medium",
                        children: title
                    }),
                    notifs && open && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.span, {
                        initial: {
                            scale: 0,
                            opacity: 0
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        style: {
                            y: "-50%"
                        },
                        transition: {
                            delay: 0.5
                        },
                        className: "absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white",
                        children: notifs
                    })
                ]
            });
        };
        this.TitleSection = ()=>{
            const { open } = this.state;
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mb-3  border-b border-slate-300   pb-3",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "flex cursor-pointer pt-[40px] items-center justify-between rounded-md transition-colors hover:bg-slate-100",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "flex items-center p-3 gap-2",
                        children: open && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                            layout: true,
                            initial: {
                                opacity: 0,
                                y: 12
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.125
                            },
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "block text-black text-xs font-semibold",
                                    children: "商品導覽"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "block text-black text-xs text-slate-500",
                                    children: "選擇您需要的商品"
                                })
                            ]
                        })
                    })
                })
            });
        };
        this.Logo = ()=>{
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                layout: true,
                className: "grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                    width: "24",
                    height: "auto",
                    viewBox: "0 0 50 39",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "fill-slate-50",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                            d: "M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z",
                            stopColor: "#000000"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                            d: "M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z",
                            stopColor: "#000000"
                        })
                    ]
                })
            });
        };
        this.state = {
            open: false,
            selected: "Dashboard"
        };
    }
    render() {
        const { open, selected } = this.state;
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "flex",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.button, {
                    layout: true,
                    onClick: this.ToggleClose,
                    className: "absolute top-8 right-4 mt-3 rounded-[100px] z-[999999999] border-t border-slate-300 w-[100px] h-[45px] bg-[#91AD9E] transition-colors hover:bg-[#667b70]",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "flex items-center pb-2",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                                layout: true,
                                className: "grid size-10 place-content-center text-lg",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_fi__WEBPACK_IMPORTED_MODULE_2__.FiChevronsRight, {
                                    className: `transition-transform ${open && "rotate-180"}`
                                })
                            }),
                            open ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.span, {
                                layout: true,
                                initial: {
                                    opacity: 0,
                                    y: 12
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.125
                                },
                                className: "text-xs font-medium",
                                children: "關閉"
                            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.span, {
                                layout: true,
                                initial: {
                                    opacity: 0,
                                    y: 12
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.125
                                },
                                className: "text-xs font-medium",
                                children: "選單"
                            })
                        ]
                    })
                }),
                open && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                    layout: true,
                    className: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[9998]",
                    onClick: this.ToggleClose
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.nav, {
                    layout: true,
                    className: "sticky top-12 h-screen shrink-0 border-r border-slate-300 bg-white z-[9999]",
                    style: {
                        width: open ? "370px" : "0px"
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(this.TitleSection, {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "p-5",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_NavbarTestSideBar_jsx__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {
                                closeSidebar: this.ToggleClose
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "h-[100vh] fix top-0 w-full"
                })
            ]
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Example);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9591:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Banner)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ default auto */ 

function Banner() {
    const [bannerOpen, setBannerOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {});
}


/***/ }),

/***/ 116:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Footer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _logo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4945);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _footerMobile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1909);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6152);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_footerMobile_jsx__WEBPACK_IMPORTED_MODULE_3__, lucide_react__WEBPACK_IMPORTED_MODULE_4__]);
([_footerMobile_jsx__WEBPACK_IMPORTED_MODULE_3__, lucide_react__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


// import { Cloudinary } from "@cloudinary/url-gen";




// const myLoader = ({ src, width, quality, placeholder }) => {
//   return `https://www.ultraehp.com/images/Products-Detail-Img/UH-2/${src}?w=${width}?p=${placeholder}`
// }
const myLoader = ({ src, width, quality, placeholder })=>{
    return `https://www.ultraehp.com/images/footer/${src}?w=${width}?p=${placeholder}`;
};
function Footer() {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "block",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("footer", {
            className: "md:py-[80px] py-[20px] 2xl:py-[50px] lg:pb-[50px] lg:pt-[30px] w-full px-[15px] md:px-[30px] lg:px-[90px]  2xl:px-[200px] bg-[#e0d5c8]  flex-col items-center  flex justify-center",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "top-section p-[30px] lg:p-[10px] w-full md:w-1/2 2xl:pr-[100px]",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "link-button-wrap flex flex-wrap mx-auto max-w-[530px]  justify-center ",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                            placeholder: "empty",
                            alt: "soke",
                            className: "mx-auto",
                            src: "/images/S__4767763.jpg",
                            width: 300,
                            height: 200
                        })
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "flex justify-center items-center",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: "https://www.jeek-webdesign.com.tw",
                        target: "_blank",
                        className: "border-none text-[13px] 2xl:text-[16px] font-light text-[#666666]",
                        children: "\xa9 2025 Jeek. All Rights Reserved. Design by Jeek."
                    })
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1909:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony export default */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2406);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__]);
_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const myLoader = ({ src, width, quality, placeholder })=>{
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}?p=${placeholder}`;
};
function App() {
    const defaultContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    return /*#__PURE__*/ _jsxs("div", {
        className: "pb-[10px] pt-[10px] px-[30px] bg-gray-600 block md:hidden",
        children: [
            /*#__PURE__*/ _jsxs(Accordion, {
                children: [
                    /*#__PURE__*/ _jsx(AccordionItem, {
                        subtitle: /*#__PURE__*/ _jsx("span", {
                            className: "p-0 m-0 text-white  h-[20px] text-[20px]",
                            children: "Products"
                        }),
                        children: /*#__PURE__*/ _jsxs("ul", {
                            children: [
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/ultrapeace/en/",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UBT - PROFESSIONAL / UBT-HOME"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/UH1.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UH1｜pH STRIP ELECTRODE"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/UH2.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UH2｜ pH STRIP ELECTRODE"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/UH2-GAS.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UH2-Gas｜ pH Strip Electrode for Gas"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/UX100.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UX100｜CALIBRATION-FREE pH METER"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/UX200.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "UX200｜CALIBRATION-FREE pH METER"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("li", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsx("a", {
                                        href: "https://www.ultraehp.com/hummingprobe/CS200.html",
                                        className: "text-[16px]  text-gray-300",
                                        children: "CS200｜MAGNET INVERTER MIXER"
                                    })
                                })
                            ]
                        })
                    }, "2"),
                    /*#__PURE__*/ _jsxs(AccordionItem, {
                        subtitle: /*#__PURE__*/ _jsx("span", {
                            className: "text-white text-[20px]",
                            children: "SERVICE"
                        }),
                        children: [
                            /*#__PURE__*/ _jsx("a", {
                                href: "https://www.ultraehp.com/en/aboutUs.html",
                                className: "mt-[20px]",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    className: "mt-4",
                                    height: 300,
                                    loader: myLoader,
                                    src: "UX100-02.webp"
                                })
                            }),
                            /*#__PURE__*/ _jsx("a", {
                                href: "https://www.ultraehp.com/en/Download.html",
                                className: "mt-[20px]",
                                children: /*#__PURE__*/ _jsx(Image, {
                                    width: 400,
                                    className: "mt-4",
                                    height: 300,
                                    loader: myLoader,
                                    src: "UX100-05.webp"
                                })
                            })
                        ]
                    }, "1")
                ]
            }),
            /*#__PURE__*/ _jsx("b", {
                className: " text-white text-[16px] mt-[50px]",
                children: "Subscribe Us"
            }),
            /*#__PURE__*/ _jsx("iframe", {
                title: "contact-form",
                loading: "lazy",
                src: "https://www.ultraehp.com/customized-iframe-footer.html",
                height: 300,
                className: "w-full"
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4945:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);


function Logo() {
    return /*#__PURE__*/ _jsx(Link, {
        href: "/",
        className: "block",
        "aria-label": "Cruip",
        children: /*#__PURE__*/ _jsxs("svg", {
            className: "w-8 h-8",
            viewBox: "0 0 32 32",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
                /*#__PURE__*/ _jsx("defs", {
                    children: /*#__PURE__*/ _jsxs("radialGradient", {
                        cx: "21.152%",
                        cy: "86.063%",
                        fx: "21.152%",
                        fy: "86.063%",
                        r: "79.941%",
                        id: "footer-logo",
                        children: [
                            /*#__PURE__*/ _jsx("stop", {
                                stopColor: "#4FD1C5",
                                offset: "0%"
                            }),
                            /*#__PURE__*/ _jsx("stop", {
                                stopColor: "#81E6D9",
                                offset: "25.871%"
                            }),
                            /*#__PURE__*/ _jsx("stop", {
                                stopColor: "#338CF5",
                                offset: "100%"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ _jsx("rect", {
                    width: "32",
                    height: "32",
                    rx: "16",
                    fill: "url(#footer-logo)",
                    fillRule: "nonzero"
                })
            ]
        })
    });
}


/***/ }),

/***/ 3903:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RootLayout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9783);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1759);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2406);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1162);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_themes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_Navbar_Navbar_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4836);
/* harmony import */ var _components_banner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9591);
/* harmony import */ var _components_ui_footer_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(116);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _components_Sidebar_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8176);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_4__, _components_Navbar_Navbar_jsx__WEBPACK_IMPORTED_MODULE_6__, _components_ui_footer_jsx__WEBPACK_IMPORTED_MODULE_8__, _components_Sidebar_js__WEBPACK_IMPORTED_MODULE_10__]);
([_nextui_org_react__WEBPACK_IMPORTED_MODULE_4__, _components_Navbar_Navbar_jsx__WEBPACK_IMPORTED_MODULE_6__, _components_ui_footer_jsx__WEBPACK_IMPORTED_MODULE_8__, _components_Sidebar_js__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










 // 引入側邊欄組件
function RootLayout({ children }) {
    const [sidebarProduct, setSidebarProduct] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null); // 儲存購物車資料
    // handleAddToCart 用於更新 sidebarProduct
    const handleAddToCart = (product, quantity, selectedAttributes)=>{
        const totalPrice = product.price * quantity; // 計算總價
        const variantId = getVariantId(selectedAttributes); // 根據選擇的屬性獲取變體 ID
        // 更新 sidebarProduct 狀態
        setSidebarProduct({
            name: product.name,
            price: product.price,
            quantity,
            totalPrice,
            variant: selectedAttributes,
            variantId
        });
        // 顯示購物車側邊欄（根據需求控制顯示）
        setIsSidebarOpen(true);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        aos__WEBPACK_IMPORTED_MODULE_2___default().init({
            once: true,
            disable: "phone",
            duration: 700,
            easing: "ease-out-cubic"
        });
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_9___default()), {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: "星嶼童裝-韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: "韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "keywords",
                        content: "產品, 購物, 優惠"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "author",
                        content: "星嶼童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "icon",
                        href: "/fstarislandbaby-icon.ico"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:title",
                        content: "星嶼童裝-韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:description",
                        content: "星嶼童裝-韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:image",
                        content: "/default-og-image.jpg"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:url",
                        content: "https://www.starislandbaby.com"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:type",
                        content: "website"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "twitter:title",
                        content: "星嶼童裝-韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "twitter:description",
                        content: "韓系童裝｜小童、嬰幼兒服飾、兒童服飾配件｜台中童裝"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "twitter:image",
                        content: "/default-og-image.jpg"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: " min-h-screen overflow-hidden",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_4__.NextUIProvider, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_themes__WEBPACK_IMPORTED_MODULE_5__.ThemeProvider, {
                            attribute: "class",
                            defaultTheme: "light",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Navbar_Navbar_jsx__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Sidebar_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                                    sidebarProduct: sidebarProduct,
                                    onAddToCart: handleAddToCart
                                }),
                                children
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_banner__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_footer_jsx__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {})
                ]
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;