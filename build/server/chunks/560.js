exports.id = 560;
exports.ids = [560];
exports.modules = {

/***/ 687:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ ImagesContainer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6197);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_2__]);
framer_motion__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



function Images(props) {
    const [exitX, setExitX] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const x = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);
    const scale = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useTransform)(x, [
        -150,
        0,
        150
    ], [
        0.5,
        1,
        0.5
    ]);
    const rotate = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useTransform)(x, [
        -150,
        0,
        150
    ], [
        -45,
        0,
        45
    ], {
        clamp: false
    });
    const variantsFrontImage = {
        animate: {
            scale: 1,
            y: 0,
            opacity: 1
        },
        exit: (custom)=>({
                x: custom,
                opacity: 0,
                scale: 0.5,
                transition: {
                    duration: 0.2
                }
            })
    };
    const variantsBackImage = {
        initial: {
            scale: 0,
            y: 105,
            opacity: 0
        },
        animate: {
            scale: 0.75,
            y: 30,
            opacity: 0.5
        }
    };
    function handleDragEnd(_, info) {
        if (info.offset.x < -100) {
            setExitX(-250);
            props.setIndex((prevIndex)=>(prevIndex + 1) % props.images.length);
        }
        if (info.offset.x > 100) {
            setExitX(250);
            props.setIndex((prevIndex)=>(prevIndex + 1) % props.images.length);
        }
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
        style: {
            width: 150,
            height: 150,
            position: "absolute",
            top: 0,
            x,
            rotate,
            cursor: "grab"
        },
        whileTap: {
            cursor: "grabbing"
        },
        // Dragging
        drag: props.drag,
        dragConstraints: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        onDragEnd: handleDragEnd,
        // Animation
        variants: props.frontImage ? variantsFrontImage : variantsBackImage,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        custom: exitX,
        transition: props.frontImage ? {
            type: "spring",
            stiffness: 300,
            damping: 20
        } : {
            scale: {
                duration: 0.2
            },
            opacity: {
                duration: 0.4
            }
        },
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
            style: {
                width: 150,
                height: 150,
                backgroundImage: `url(${props.image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 30,
                scale
            },
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                style: {
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    color: "white",
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8)"
                },
                children: props.image.label
            })
        })
    });
}
function ImagesContainer() {
    const [index, setIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    // 图片数据数组，每张图片可以有不同的内容
    const images = [
        {
            url: "/images/IMG_5585.png"
        },
        {
            url: "/images/IMG_5588.jpg"
        },
        {
            url: "/images/IMG_5585.png"
        },
        {
            url: "/images/IMG_5587.jpg"
        },
        {
            url: "/images/IMG_5585.png"
        },
        {
            url: "/images/IMG_5586.jpg"
        }
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex flex-row justify-center items-center",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "w-[40px] text-white text-[30px] mr-[30px]",
                children: [
                    "← ",
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "text-gray-300 text-[12px]",
                        children: "Drag"
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
                style: {
                    width: 150,
                    height: 150,
                    position: "relative"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.AnimatePresence, {
                    initial: false,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Images, {
                            frontImage: false,
                            image: images[(index + 1) % images.length],
                            images: images
                        }, index + 1),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Images, {
                            frontImage: true,
                            index: index,
                            setIndex: setIndex,
                            drag: "x",
                            image: images[index],
                            images: images
                        }, index)
                    ]
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "w-[40px] text-white text-[30px] ml-[30px]",
                children: [
                    "→ ",
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "text-gray-300 text-[12px]",
                        children: "Drag"
                    })
                ]
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 207:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ SuggestedCarousel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6197);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6152);
/* harmony import */ var next_image_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5564);
/* harmony import */ var next_image_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_image_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4246);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_3__, lucide_react__WEBPACK_IMPORTED_MODULE_4__, _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__]);
([framer_motion__WEBPACK_IMPORTED_MODULE_3__, lucide_react__WEBPACK_IMPORTED_MODULE_4__, _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* __next_internal_client_entry_do_not_use__ default auto */ 






const START_INDEX = 1;
const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;
const CURSOR_SIZE = 80;
const articles = [
    {
        title: "Building a fully customisable carousel slider with swipe gestures and navigation using Framer Motion",
        url: "/images/S__4653065拷貝2.jpg"
    },
    {
        title: "Building a customisable Input component with NextJS, ReactHookForm, TailwindCSS and TypeScript",
        url: "/images/S__4653066.jpg"
    },
    {
        title: "Handling Forms in NextJS with busboy, ReactHookForm and TypeScript",
        url: "/images/S__4653063.jpg"
    }
];
function SuggestedCarousel() {
    const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const itemsRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)([]);
    const [activeSlide, setActiveSlide] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(START_INDEX);
    const canScrollPrev = activeSlide > 0;
    const canScrollNext = activeSlide < articles.length - 1;
    const offsetX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useMotionValue)(0);
    const animatedX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring)(offsetX, {
        damping: 20,
        stiffness: 150
    });
    const [isDragging, setIsDragging] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    function handleDragSnap(_, { offset: { x: dragOffset } }) {
        //reset drag state
        setIsDragging(false);
        containerRef.current?.removeAttribute("data-dragging");
        //stop drag animation (rest velocity)
        animatedX.stop();
        const currentOffset = offsetX.get();
        //snap back if not dragged far enough or if at the start/end of the list
        if (Math.abs(dragOffset) < DRAG_THRESHOLD || !canScrollPrev && dragOffset > 0 || !canScrollNext && dragOffset < 0) {
            animatedX.set(currentOffset);
            return;
        }
        let offsetWidth = 0;
        /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */ for(let i = activeSlide; dragOffset > 0 ? i >= 0 : i < itemsRef.current.length; dragOffset > 0 ? i-- : i++){
            const item = itemsRef.current[i];
            if (item === null) continue;
            const itemOffset = item.offsetWidth;
            const prevItemWidth = itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
            const nextItemWidth = itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;
            if (dragOffset > 0 && //dragging left
            dragOffset > offsetWidth + itemOffset && //dragged past item
            i > 1 || //not the first/second item
            dragOffset < 0 && //dragging right
            dragOffset < offsetWidth + -itemOffset && //dragged past item
            i < itemsRef.current.length - 2 //not the last/second to last item
            ) {
                dragOffset > 0 ? offsetWidth += prevItemWidth : offsetWidth -= nextItemWidth;
                continue;
            }
            if (dragOffset > 0) {
                //prev
                offsetX.set(currentOffset + offsetWidth + prevItemWidth);
                setActiveSlide(i - 1);
            } else {
                //next
                offsetX.set(currentOffset + offsetWidth - nextItemWidth);
                setActiveSlide(i + 1);
            }
            break;
        }
    }
    function scrollPrev() {
        //prevent scrolling past first item
        if (!canScrollPrev) return;
        const nextWidth = itemsRef.current.at(activeSlide - 1)?.getBoundingClientRect().width;
        if (nextWidth === undefined) return;
        offsetX.set(offsetX.get() + nextWidth);
        setActiveSlide((prev)=>prev - 1);
    }
    function scrollNext() {
        // prevent scrolling past last item
        if (!canScrollNext) return;
        const nextWidth = itemsRef.current.at(activeSlide + 1)?.getBoundingClientRect().width;
        if (nextWidth === undefined) return;
        offsetX.set(offsetX.get() - nextWidth);
        setActiveSlide((prev)=>prev + 1);
    }
    const [hoverType, setHoverType] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const mouseX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useMotionValue)(0);
    const mouseY = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useMotionValue)(0);
    const animatedHoverX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring)(mouseX, {
        damping: 20,
        stiffness: 400,
        mass: 0.1
    });
    const animatedHoverY = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring)(mouseY, {
        damping: 20,
        stiffness: 400,
        mass: 0.1
    });
    function navButtonHover({ currentTarget, clientX, clientY }) {
        const parent = currentTarget.offsetParent;
        if (!parent) return;
        const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect();
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const offsetFromCenterX = clientX - centerX;
        const offsetFromCenterY = clientY - centerY;
        mouseX.set(left - parentLeft + offsetFromCenterX / 4);
        mouseY.set(top - parentTop + offsetFromCenterY / 4);
    }
    function disableDragClick(e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    const carouselRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                ref: carouselRef,
                className: "flex justify-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image_js__WEBPACK_IMPORTED_MODULE_5___default()), {
                    src: "/images/S__4972558.jpg",
                    placeholder: "empty",
                    loading: "lazy",
                    className: "mx-auto mt-10 max-w-[700px]",
                    width: 700,
                    height: 300,
                    alt: "have_nice_day"
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "group container ",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                        className: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.cn)("pointer-events-none absolute z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"),
                        style: {
                            width: CURSOR_SIZE,
                            height: CURSOR_SIZE,
                            x: animatedHoverX,
                            y: animatedHoverY
                        },
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {
                            layout: true,
                            className: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.cn)("grid h-full place-items-center rounded-full bg-lime-300", hoverType === "click" && "absolute inset-7 h-auto"),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.span, {
                                layout: "position",
                                className: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.cn)("w-full select-none text-center font-medium uppercase text-gray-900", (hoverType === "prev" || hoverType === "next") && "absolute inset-x-0 top-2", hoverType === "click" && "absolute top-full mt-0.5 w-auto text-sm font-bold text-lime-300"),
                                children: hoverType ?? "drag"
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.ul, {
                                ref: containerRef,
                                className: "flex cursor-none items-start",
                                style: {
                                    x: animatedX
                                },
                                drag: "x",
                                dragConstraints: {
                                    left: -(FALLBACK_WIDTH * (articles.length - 1)),
                                    right: FALLBACK_WIDTH
                                },
                                onMouseMove: ({ currentTarget, clientX, clientY })=>{
                                    const parent = currentTarget.offsetParent;
                                    if (!parent) return;
                                    const { left, top } = parent.getBoundingClientRect();
                                    mouseX.set(clientX - left - CURSOR_SIZE / 2);
                                    mouseY.set(clientY - top - CURSOR_SIZE / 2);
                                },
                                onDragStart: ()=>{
                                    containerRef.current?.setAttribute("data-dragging", "true");
                                    setIsDragging(true);
                                },
                                onDragEnd: handleDragSnap,
                                children: articles.map((article, index)=>{
                                    const active = index === activeSlide;
                                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.li, {
                                        layout: true,
                                        ref: (el)=>itemsRef.current[index] = el,
                                        className: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.cn)("group relative ml-[-8vw] shrink-0 select-none px-3 transition-opacity duration-300", !active && "opacity-30"),
                                        transition: {
                                            ease: "easeInOut",
                                            duration: 0.4
                                        },
                                        style: {
                                            flexBasis: active ? "60%" : "40%"
                                        },
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                                href: article.url,
                                                className: "block",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                draggable: false,
                                                onClick: disableDragClick,
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                    src: article.url,
                                                    alt: article.title,
                                                    className: "w-full"
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.cn)("mt-4 flex justify-center", !active && "hidden")
                                            })
                                        ]
                                    }, article.title);
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                type: "button",
                                className: "group absolute left-[24%] top-1/3 z-20 grid aspect-square place-content-center rounded-full transition-colors",
                                style: {
                                    width: CURSOR_SIZE,
                                    height: CURSOR_SIZE
                                },
                                onClick: scrollPrev,
                                disabled: !canScrollPrev,
                                onMouseEnter: ()=>setHoverType("prev"),
                                onMouseMove: (e)=>navButtonHover(e),
                                onMouseLeave: ()=>setHoverType(null),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "sr-only",
                                        children: "Previous Guide"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__.MoveLeft, {
                                        className: "h-10 w-10 stroke-[1.5] transition-colors group-enabled:group-hover:text-gray-900 group-disabled:opacity-50"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                type: "button",
                                className: "group absolute right-[24%] top-1/3 z-20 grid aspect-square place-content-center rounded-full transition-colors",
                                style: {
                                    width: CURSOR_SIZE,
                                    height: CURSOR_SIZE
                                },
                                onClick: scrollNext,
                                disabled: !canScrollNext,
                                onMouseEnter: ()=>setHoverType("next"),
                                onMouseMove: (e)=>navButtonHover(e),
                                onMouseLeave: ()=>setHoverType(null),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "sr-only",
                                        children: "Next Guide"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__.MoveRight, {
                                        className: "h-10 w-10 stroke-[1.5] transition-colors group-enabled:group-hover:text-gray-900 group-disabled:opacity-50"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6691:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports useDotButton, DotButton */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const useDotButton = (emblaApi, onButtonClick)=>{
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const onDotButtonClick = useCallback((index)=>{
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
        if (onButtonClick) onButtonClick(emblaApi);
    }, [
        emblaApi,
        onButtonClick
    ]);
    const onInit = useCallback((emblaApi)=>{
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);
    const onSelect = useCallback((emblaApi)=>{
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);
    useEffect(()=>{
        if (!emblaApi) return;
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
    }, [
        emblaApi,
        onInit,
        onSelect
    ]);
    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    };
};
const DotButton = (props)=>{
    const { children, ...restProps } = props;
    return /*#__PURE__*/ _jsx("button", {
        type: "button",
        ...restProps,
        children: children
    });
};


/***/ }),

/***/ 6186:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var embla_carousel_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1247);
/* harmony import */ var _EmblaCarouselArrowButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7651);
/* harmony import */ var _EmblaCarosuelDotButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6691);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4287);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(gsap__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([embla_carousel_react__WEBPACK_IMPORTED_MODULE_2__]);
embla_carousel_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






const EmblaCarousel = (props)=>{
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const dragIndicatorRef = useRef(null);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
    const handleMouseEnter = ()=>{
        gsap.to(dragIndicatorRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5
        });
        document.body.style.cursor = "grab";
    };
    const handleMouseLeave = ()=>{
        gsap.to(dragIndicatorRef.current, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5
        });
        document.body.style.cursor = "default";
    };
    useEffect(()=>{
        if (!emblaApi) return;
        emblaApi.on("reInit", ()=>{}).on("scroll", ()=>{}).on("slideFocus", ()=>{});
    }, [
        emblaApi
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: "w-full py-8 mx-auto",
        style: {
            "--slide-height": "19rem",
            "--slide-spacing": "1rem",
            "--slide-size": "25%"
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: [
            /*#__PURE__*/ _jsx("style", {
                children: `
         @media (max-width: 1700px) {
        .embla__viewport {
          --slide-size: 22%;
        }
      }
          @media (max-width: 1000px) {
        .embla__viewport {
          --slide-size: 36%;
        }
      }
      @media (max-width: 550px) {
        .embla__viewport {
          --slide-size: 80%;
        }
      }
    `
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "embla__viewport overflow-hidden",
                ref: emblaRef,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "embla__container flex touch-pan-y touch-pinch-zoom h-auto",
                    style: {
                        marginLeft: "calc(var(--slide-spacing) * -1)"
                    },
                    children: slides.map((slide, index)=>/*#__PURE__*/ _jsx("div", {
                            className: "embla__slide  transform flex-none h-full min-w-0",
                            style: {
                                transform: "translate3d(0, 0, 0)",
                                flex: "0 0 var(--slide-size)",
                                paddingLeft: "var(--slide-spacing)"
                            },
                            children: /*#__PURE__*/ _jsx("div", {
                                className: "embla__slide__number overflow-hidden  md:border bg-[#D9D9D9]  pb-8 border border-[#333] p-5 flex flex-col items-center justify-center font-semibold",
                                style: {
                                    boxShadow: "inset 0 0 0 0.2rem var(--detail-medium-contrast)",
                                    borderRadius: "1.8rem",
                                    fontSize: "4rem",
                                    height: "100%",
                                    userSelect: "none"
                                },
                                children: /*#__PURE__*/ _jsx("a", {
                                    href: "/",
                                    className: "",
                                    children: /*#__PURE__*/ _jsxs("div", {
                                        className: "flex overflow-hidden flex-col justify-center items-center",
                                        children: [
                                            slide.content ? slide.content : /*#__PURE__*/ _jsx("div", {
                                                className: "h-full w-full overflow-hidden",
                                                children: /*#__PURE__*/ _jsx("img", {
                                                    src: slide.image,
                                                    className: "w-full hover:scale-105 duration-1000 md:h-full",
                                                    alt: `Slide ${index + 1}`
                                                })
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "txt mt-5 flex-col flex justify-center items-center w-4/5 mx-auto",
                                                children: [
                                                    /*#__PURE__*/ _jsx("b", {
                                                        className: "text-[16px] text-center",
                                                        children: slide.title
                                                    }),
                                                    /*#__PURE__*/ _jsx("p", {
                                                        className: "text-[14px] font-normal text-center",
                                                        children: slide.description
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                })
                            })
                        }, index))
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "embla__controls absolute bottom-0 left-6 grid grid-cols-[auto_1fr] justify-between flex inline-block border border-black gap-3 mt-7",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "embla__buttons absolute left-[-50%] bottom-[10%] flex justify-center",
                        children: [
                            /*#__PURE__*/ _jsx(PrevButton, {
                                onClick: onPrevButtonClick,
                                disabled: prevBtnDisabled
                            }),
                            /*#__PURE__*/ _jsx(NextButton, {
                                onClick: onNextButtonClick,
                                disabled: nextBtnDisabled
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "embla__dots",
                        children: scrollSnaps.map((_, index)=>/*#__PURE__*/ _jsx(DotButton, {
                                onClick: ()=>onDotButtonClick(index),
                                className: "embla__dot".concat(index === selectedIndex ? " embla__dot--selected" : "")
                            }, index))
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                ref: dragIndicatorRef,
                className: "drag-indicator absolute top-[-5%] left-[5%] transform  rounded-full text-white text-center text-[10px] bg-black flex items-center justify-center",
                style: {
                    opacity: 0,
                    scale: 0.5,
                    width: "100px",
                    height: "100px",
                    fontSize: "20px"
                },
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "flex flex-col justify-center items-center",
                    children: [
                        /*#__PURE__*/ _jsx("p", {
                            className: "text-white text-center text-[14px]",
                            children: "100%"
                        }),
                        " ",
                        /*#__PURE__*/ _jsx("p", {
                            className: "text-center text-white text-[10px]",
                            children: "Made In Taiwan"
                        })
                    ]
                })
            })
        ]
    });
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (EmblaCarousel)));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7651:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports usePrevNextButtons, PrevButton, NextButton */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const usePrevNextButtons = (emblaApi, onButtonClick)=>{
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
    const onPrevButtonClick = useCallback(()=>{
        if (!emblaApi) return;
        emblaApi.scrollPrev();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [
        emblaApi,
        onButtonClick
    ]);
    const onNextButtonClick = useCallback(()=>{
        if (!emblaApi) return;
        emblaApi.scrollNext();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [
        emblaApi,
        onButtonClick
    ]);
    const onSelect = useCallback((emblaApi)=>{
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);
    useEffect(()=>{
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect).on("select", onSelect);
    }, [
        emblaApi,
        onSelect
    ]);
    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    };
};
const PrevButton = (props)=>{
    const { children, ...restProps } = props;
    return /*#__PURE__*/ _jsxs("button", {
        className: "embla__button embla__button--prev",
        type: "button",
        ...restProps,
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "w-[20px] h-[20px] rounded-full bg-white flex justify-center items-center",
                children: "✒︎"
            }),
            children
        ]
    });
};
const NextButton = (props)=>{
    const { children, ...restProps } = props;
    return /*#__PURE__*/ _jsxs("button", {
        className: "embla__button embla__button--prev",
        type: "button",
        ...restProps,
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "w-[20px] h-[20px] rounded-full bg-white flex justify-center items-center",
                children: "✒︎"
            }),
            children
        ]
    });
};


/***/ }),

/***/ 8649:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const Footer = ()=>/*#__PURE__*/ _jsx("footer", {
        className: "flex justify-center py-8 px-4 md:px-8"
    });
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (Footer)));


/***/ }),

/***/ 5915:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const Header = ()=>/*#__PURE__*/ _jsx("header", {
        children: /*#__PURE__*/ _jsx("h1", {
            className: "header",
            children: "Embla Carousel Parallax React"
        })
    });
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (Header)));


/***/ }),

/***/ 4822:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _EmblaCarousel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6186);
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5915);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8649);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_EmblaCarousel__WEBPACK_IMPORTED_MODULE_2__]);
_EmblaCarousel__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





const OPTIONS = {
    dragFree: true,
    loop: true
};
// Define an array of slide objects with iframe content
const SLIDES = [
    {
        image: "/images/IMG_5587.jpg",
        title: "Fourth Slide",
        description: "Description for the fourth slide."
    },
    {
        image: "/images/截圖-2024-12-05-晚上9.47.11.png",
        title: "Third Slide",
        description: "Description for the third slide."
    },
    {
        image: "/images/截圖-2024-12-05-晚上9.46.54.png",
        title: "Third Slide",
        description: "Description for the third slide."
    },
    {
        image: "/images/截圖-2024-12-05-晚上9.47.32.png",
        title: "Fourth Slide",
        description: "Description for the fourth slide."
    },
    {
        image: "/images/截圖-2024-12-05-晚上9.47.11.png",
        title: "Third Slide",
        description: "Description for the third slide."
    },
    {
        image: "/images/截圖-2024-12-05-晚上9.46.54.png",
        title: "Third Slide",
        description: "Description for the third slide."
    }
];
const App = ()=>/*#__PURE__*/ _jsx(_Fragment, {
        children: /*#__PURE__*/ _jsx(EmblaCarousel, {
            slides: SLIDES,
            options: OPTIONS
        })
    });
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (App)));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4073:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9816);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5675);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);




const PopupAd = ()=>{
    const [isVisible, setIsVisible] = useState(false);
    // 在组件挂载后5秒显示广告
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsVisible(true);
        }, 5000); // 5000ms = 5秒
        // 清除定时器，避免组件卸载后定时器仍然存在
        return ()=>clearTimeout(timer);
    }, []);
    // 关闭广告
    const closeAd = ()=>{
        setIsVisible(false);
    };
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            isVisible && /*#__PURE__*/ _jsx("div", {
                className: "jsx-4ef84ca9f4b5dba6" + " " + "popup-overlay",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "jsx-4ef84ca9f4b5dba6" + " " + "popup-container w-[95%] md:w-[60%] 2xl:w-[55%]",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "jsx-4ef84ca9f4b5dba6" + " " + "popup-header ",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "jsx-4ef84ca9f4b5dba6"
                                }),
                                /*#__PURE__*/ _jsx("button", {
                                    onClick: closeAd,
                                    className: "jsx-4ef84ca9f4b5dba6" + " " + "close-btn  ",
                                    children: "X"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "jsx-4ef84ca9f4b5dba6" + " " + "popup-body",
                            children: /*#__PURE__*/ _jsx(Image, {
                                src: "/images/hot_sale/S__4579335.jpg",
                                alt: "popup-ad",
                                placeholder: "empty",
                                loading: "lazy",
                                width: 800,
                                height: 600
                            })
                        })
                    ]
                })
            }),
            _jsx(_JSXStyle, {
                id: "4ef84ca9f4b5dba6",
                children: ".popup-overlay.jsx-4ef84ca9f4b5dba6{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;z-index:9999999999}.popup-container.jsx-4ef84ca9f4b5dba6{background:transparent;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;padding:20px;-webkit-animation:popup.5s ease-in-out;-moz-animation:popup.5s ease-in-out;-o-animation:popup.5s ease-in-out;animation:popup.5s ease-in-out}.popup-header.jsx-4ef84ca9f4b5dba6{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;padding-bottom:10px}.popup-body.jsx-4ef84ca9f4b5dba6{margin:10px 0}.popup-footer.jsx-4ef84ca9f4b5dba6{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-webkit-justify-content:flex-end;-moz-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.close-btn.jsx-4ef84ca9f4b5dba6{background:#f44;color:white;border:none;width:25px;height:25px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;cursor:pointer}.close-btn.jsx-4ef84ca9f4b5dba6:hover{background:#f22}@-webkit-keyframes popup{0%{-webkit-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(1);transform:scale(1)}}@-moz-keyframes popup{0%{-moz-transform:scale(0);transform:scale(0)}100%{-moz-transform:scale(1);transform:scale(1)}}@-o-keyframes popup{0%{-o-transform:scale(0);transform:scale(0)}100%{-o-transform:scale(1);transform:scale(1)}}@keyframes popup{0%{-webkit-transform:scale(0);-moz-transform:scale(0);-o-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(1);-moz-transform:scale(1);-o-transform:scale(1);transform:scale(1)}}"
            })
        ]
    });
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (PopupAd)));


/***/ }),

/***/ 2140:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6197);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_1__]);
framer_motion__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = "2024-9-24";
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const ShiftingCountdown = ()=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: " p-4",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "mx-auto flex w-[80%] xl:max-w-5xl items-center bg-white",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CountdownItem, {
                    unit: "Day",
                    text: "days"
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CountdownItem, {
                    unit: "Hour",
                    text: "hours"
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CountdownItem, {
                    unit: "Minute",
                    text: "minutes"
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CountdownItem, {
                    unit: "Second",
                    text: "seconds"
                })
            ]
        })
    });
};
const CountdownItem = ({ unit, text })=>{
    const { ref, time } = useTimer(unit);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex  h-24 xl:h-36 w-1/4 flex-col items-center justify-center gap-3 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "relative w-full overflow-hidden text-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                    ref: ref,
                    className: "block text-lg xl:text-2xl font-medium text-black md:text-4xl lg:text-6xl xl:text-7xl",
                    children: time
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: "text-xs font-light text-slate-500 md:text-sm lg:text-base",
                children: text
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShiftingCountdown);
// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit)=>{
    const [ref, animate] = (0,framer_motion__WEBPACK_IMPORTED_MODULE_1__.useAnimate)();
    const intervalRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    const timeRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(0);
    const [time, setTime] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        intervalRef.current = setInterval(handleCountdown, 1000);
        return ()=>clearInterval(intervalRef.current || undefined);
    }, []);
    const handleCountdown = async ()=>{
        const end = new Date(COUNTDOWN_FROM);
        const now = new Date();
        const distance = +end - +now;
        let newTime = 0;
        if (unit === "Day") {
            newTime = Math.floor(distance / DAY);
        } else if (unit === "Hour") {
            newTime = Math.floor(distance % DAY / HOUR);
        } else if (unit === "Minute") {
            newTime = Math.floor(distance % HOUR / MINUTE);
        } else {
            newTime = Math.floor(distance % MINUTE / SECOND);
        }
        if (newTime !== timeRef.current) {
            // Exit animation
            await animate(ref.current, {
                y: [
                    "0%",
                    "-50%"
                ],
                opacity: [
                    1,
                    0
                ]
            }, {
                duration: 0.35
            });
            timeRef.current = newTime;
            setTime(newTime);
            // Enter animation
            await animate(ref.current, {
                y: [
                    "50%",
                    "0%"
                ],
                opacity: [
                    0,
                    1
                ]
            }, {
                duration: 0.35
            });
        }
    };
    return {
        ref,
        time
    };
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9676:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ ProductCarousel)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2184);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2406);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3015);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1759);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7644);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(swiper_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var swiper_css_navigation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3039);
/* harmony import */ var swiper_css_navigation__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(swiper_css_navigation__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var swiper_css_pagination__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5392);
/* harmony import */ var swiper_css_pagination__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(swiper_css_pagination__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var swiper_css_scrollbar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4158);
/* harmony import */ var swiper_css_scrollbar__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(swiper_css_scrollbar__WEBPACK_IMPORTED_MODULE_10__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([swiper_modules__WEBPACK_IMPORTED_MODULE_2__, _nextui_org_react__WEBPACK_IMPORTED_MODULE_3__, swiper_react__WEBPACK_IMPORTED_MODULE_4__]);
([swiper_modules__WEBPACK_IMPORTED_MODULE_2__, _nextui_org_react__WEBPACK_IMPORTED_MODULE_3__, swiper_react__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





 // Import Link for internal navigation

// Import Swiper styles




// Fetch products from API
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
function ProductCarousel() {
    const [products, setProducts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [isClient, setIsClient] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // Track if client-side rendering is active
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchData = async ()=>{
            const fetchedProducts = await fetchAllProducts();
            setProducts(fetchedProducts);
            setLoading(false);
        };
        fetchData();
        // Set isClient to true after component mounts to ensure it's only rendered client-side
        setIsClient(true);
    }, []);
    if (loading || !isClient) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            children: "Loading..."
        }); // Display loading until data is fetched and client is ready
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "e-full m-0 py-5 xl:py-[100px]",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_4__.Swiper, {
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    500: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 3
                    },
                    1024: {
                        slidesPerView: 4
                    }
                },
                modules: [
                    swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Navigation,
                    swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Pagination,
                    swiper_modules__WEBPACK_IMPORTED_MODULE_2__.A11y
                ],
                spaceBetween: 10,
                className: "m-0 p-0",
                autoplay: true,
                navigation: true,
                loop: true,
                children: products.map((product)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(swiper_react__WEBPACK_IMPORTED_MODULE_4__.SwiperSlide, {
                        className: "group px-0",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_5___default()), {
                            href: `/product/${product.slug}`,
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_3__.Card, {
                                className: " bg-transparent bg-white  p-0 m-0 shadow-none",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_3__.CardHeader, {
                                        className: ""
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_3__.CardBody, {
                                        className: "pb-[30px]",
                                        children: [
                                            isClient && product.images[0]?.src && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                loading: "lazy",
                                                alt: product.name,
                                                className: "rounded-xl group-hover:scale-105 duration-200",
                                                src: product.images[0]?.src || "/images/default.jpg",
                                                width: 500,
                                                height: 300
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: "description flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: "p-4 flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                                                className: "text-black",
                                                                children: product.name
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("b", {
                                                                className: "text-black",
                                                                children: [
                                                                    "Price: $",
                                                                    product.price
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                                        href: "#",
                                                        className: "border  border-gray-400 text-black p-1 text-[12px] font-bold rounded-[30px] w-1/2 mx-auto mt-4 text-center bg-[#91AD9E]",
                                                        children: "BUY NOW"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    }, product.id))
            })
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9620:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6197);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_2__]);
framer_motion__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const video = (/* unused pure expression or super */ null && ([
    ""
]));
const imgs = [
    "/images/S__4677656.png"
];
const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
    type: "spring",
    mass: 3,
    stiffness: 400,
    damping: 50
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (()=>{
    const [imgIndex, setImgIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const dragX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const intervalRef = setInterval(()=>{
            const x = dragX.get();
            if (x === 0) {
                setImgIndex((pv)=>{
                    if (pv === imgs.length - 1) {
                        return 0;
                    }
                    return pv + 1;
                });
            }
        }, AUTO_DELAY);
        return ()=>clearInterval(intervalRef);
    }, []);
    const onDragEnd = ()=>{
        const x = dragX.get();
        if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
            setImgIndex((pv)=>pv + 1);
        } else if (x >= DRAG_BUFFER && imgIndex > 0) {
            setImgIndex((pv)=>pv - 1);
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "relative mx-auto w-full sm:w-[80%] xl:w-[75%]  mt-[20px] md:mt-[100px] 2xl:mt-[50px] overflow-hidden  py-0",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
                drag: "x",
                dragConstraints: {
                    left: 0,
                    right: 0
                },
                style: {
                    x: dragX
                },
                animate: {
                    translateX: `-${imgIndex * 100}%`
                },
                transition: SPRING_OPTIONS,
                onDragEnd: onDragEnd,
                className: "flex cursor-grab items-center active:cursor-grabbing",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Images, {
                    imgIndex: imgIndex
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(GradientEdges, {})
        ]
    });
});
const Images = ({ imgIndex })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: imgs.map((imgSrc, idx)=>{
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {
                style: {
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%"
                },
                animate: {
                    scale: imgIndex === idx ? 0.95 : 0.85
                },
                transition: SPRING_OPTIONS,
                className: "aspect-video w-screen shrink-0 rounded-xl bg-neutral-800 object-cover"
            }, idx);
        })
    });
};
const Dots = ({ imgIndex, setImgIndex })=>{
    return /*#__PURE__*/ _jsx("a", {
        href: "/qa",
        className: "mt-4 flex w-full justify-center gap-2 ",
        children: imgs.map((_, idx)=>{
            return /*#__PURE__*/ _jsx("button", {
                onClick: ()=>setImgIndex(idx),
                className: `h-3 w-3 rounded-full transition-colors ${idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"}`
            }, idx);
        })
    });
};
const GradientEdges = ()=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] "
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px]  "
            })
        ]
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4370:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2406);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__]);
_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const tabs = [
    {
        id: "熱銷品01",
        label: "熱銷品01",
        content: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "flex  overflow-x-auto border border-black w-[400px]  gap-4",
            children: [
                " ",
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Card, {
                    className: "py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
                            className: "overflow-hidden py-0 my-0 mx-0 px-0",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Image, {
                                alt: "Card background",
                                className: " ",
                                src: "/images/截圖-2024-12-05-晚上9.47.11.png",
                                width: 250
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
                            className: "p-8 flex-col items-start",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-tiny uppercase font-bold",
                                    children: "Daily Mix"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                                    className: "text-default-500",
                                    children: "12 Tracks"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                                    className: "font-bold text-large",
                                    children: "Frontend Radio"
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Card, {
                    className: "py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
                            className: "overflow-hidden py-0 my-0 mx-0 px-0",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Image, {
                                alt: "Card background",
                                className: " ",
                                src: "/images/截圖-2024-12-05-晚上9.47.11.png",
                                width: 250
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
                            className: "p-8 flex-col items-start",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-tiny uppercase font-bold",
                                    children: "Daily Mix"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                                    className: "text-default-500",
                                    children: "12 Tracks"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                                    className: "font-bold text-large",
                                    children: "Frontend Radio"
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Card, {
                    className: "py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
                            className: "overflow-hidden py-0 my-0 mx-0 px-0",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Image, {
                                alt: "Card background",
                                className: " ",
                                src: "/images/截圖-2024-12-05-晚上9.47.11.png",
                                width: 250
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
                            className: "p-8 flex-col items-start",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-tiny uppercase font-bold",
                                    children: "Daily Mix"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                                    className: "text-default-500",
                                    children: "12 Tracks"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                                    className: "font-bold text-large",
                                    children: "Frontend Radio"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    },
    {
        id: "熱銷品02",
        label: "熱銷品02",
        content: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Card, {
            className: "py-0 my-0 w-[300px] mx-0 ",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
                    className: "overflow-hidden py-0 my-0 mx-0 px-0",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Image, {
                        alt: "Card background",
                        className: " ",
                        src: "/images/截圖-2024-12-05-晚上9.47.32.png",
                        width: 250
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
                    className: "p-8 flex-col items-start",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: "text-tiny uppercase font-bold",
                            children: "Daily Mix"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                            className: "text-default-500",
                            children: "12 Tracks"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                            className: "font-bold text-large",
                            children: "Frontend Radio"
                        })
                    ]
                })
            ]
        })
    },
    {
        id: "熱銷品03",
        label: "熱銷品03",
        content: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Card, {
            className: "py-0 my-0 w-[300px] mx-0 ",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
                    className: "overflow-hidden py-0 my-0 mx-0 px-0",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.Image, {
                        alt: "Card background",
                        className: " ",
                        src: "/images/截圖-2024-12-05-晚上9.46.54.png",
                        width: 250
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
                    className: "p-8 flex-col items-start",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: "text-tiny uppercase font-bold",
                            children: "Daily Mix"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                            className: "text-default-500",
                            children: "12 Tracks"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                            className: "font-bold text-large",
                            children: "Frontend Radio"
                        })
                    ]
                })
            ]
        })
    }
];
const TabCardExample = ()=>{
    const [selectedTab, setSelectedTab] = useState(tabs[0].id);
    const handleTabChange = (key)=>{
        setSelectedTab(key);
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "px-[10px] mx-auto",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "flex flex-col lg:flex-row",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "TabsTitle   w-full lg:w-1/2 flex justify-start items-start flex-col",
                        children: [
                            /*#__PURE__*/ _jsx("h2", {
                                children: "童裝，親膚膏質感！"
                            }),
                            /*#__PURE__*/ _jsx("h4", {
                                className: "text-[28px] font-semibold",
                                children: "令人瞠目一新的技巧和教程"
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                className: "mt-5",
                                children: "限制不存在。 從中性色到令人震驚的明亮，在我們的指甲油顏色系列中表達你的色調。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "w-full mt-8 lg:mt-0 lg:w-1/2",
                        children: /*#__PURE__*/ _jsx(Tabs, {
                            selectedKey: selectedTab,
                            onSelectionChange: handleTabChange,
                            children: tabs.map((tab)=>/*#__PURE__*/ _jsx(Tab, {
                                    title: tab.label,
                                    className: "border" // 确保没有其他额外的样式影响
                                }, tab.id))
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "mt-4 flex overflow-x-auto whitespace-nowrap",
                children: tabs.filter((tab)=>tab.id === selectedTab).map((tab)=>/*#__PURE__*/ _jsx("div", {
                        className: "inline-block flex-shrink-0",
                        children: tab.content
                    }, tab.id))
            })
        ]
    });
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (TabCardExample)));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4246:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6593);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8097);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([clsx__WEBPACK_IMPORTED_MODULE_0__, tailwind_merge__WEBPACK_IMPORTED_MODULE_1__]);
([clsx__WEBPACK_IMPORTED_MODULE_0__, tailwind_merge__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_1__.twMerge)((0,clsx__WEBPACK_IMPORTED_MODULE_0__.clsx)(inputs));
}

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

/***/ 4158:
/***/ (() => {



/***/ }),

/***/ 7644:
/***/ (() => {



/***/ })

};
;