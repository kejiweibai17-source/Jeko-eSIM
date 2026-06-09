exports.id = 4;
exports.ids = [4];
exports.modules = {

/***/ 9605:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ CartProvider),
/* harmony export */   j: () => (/* binding */ useCart)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


// 創建一個空的購物車 context
const CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();
// CartProvider 組件，用於包裹應用並提供購物車上下文
const CartProvider = ({ children })=>{
    const [cartItems, setCartItems] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [totalPrice, setTotalPrice] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    // 確保只有在客戶端執行時才使用 localStorage
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(storedCartItems);
    }, []);
    // 更新 localStorage 中的購物車資料
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (cartItems.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [
        cartItems
    ]);
    // 計算總價
    const calculateTotalPrice = ()=>{
        const total = cartItems.reduce((acc, item)=>acc + parseFloat(item.price) * item.quantity, 0);
        setTotalPrice(total);
    };
    // 每次 cartItems 更新時計算總價
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        calculateTotalPrice();
    }, [
        cartItems
    ]);
    // 添加商品到購物車
    // 添加商品到購物車
    const addToCart = (product)=>{
        if (!product.color || !product.size) {
            console.warn("商品缺少顏色或尺寸資料", product);
            return;
        }
        // 檢查是否已經有相同的商品在購物車中
        const existingItem = cartItems.find((item)=>item.id === product.id && item.color === product.color && item.size === product.size);
        if (existingItem) {
            // 如果已經有相同商品，則更新數量
            setCartItems((prevItems)=>prevItems.map((item)=>item.id === existingItem.id && item.color === existingItem.color && item.size === existingItem.size ? {
                        ...item,
                        quantity: item.quantity + product.quantity
                    } // 增加數量
                     : item));
        } else {
            // 如果沒有相同商品，則新增商品到購物車
            setCartItems((prevItems)=>[
                    ...prevItems,
                    product
                ]);
        }
    };
    // 刪除商品
    // 刪除商品
    const removeFromCart = (productId, color, size)=>{
        const updatedCartItems = cartItems.filter((item)=>item.id !== productId || item.color !== color || item.size !== size);
        setCartItems(updatedCartItems);
        // 更新 localStorage
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    };
    // 清空購物車
    const clearCart = ()=>{
        setCartItems([]); // 清空購物車
        localStorage.removeItem("cartItems"); // 清除 localStorage 中的購物車資料
    };
    // 修改商品數量
    const updateQuantity = (productId, color, size, newQuantity)=>{
        if (newQuantity <= 0) return; // 防止數量為 0 或負數
        setCartItems((prevItems)=>prevItems.map((item)=>item.id === productId && item.color === color && item.size === size ? {
                    ...item,
                    quantity: newQuantity
                } : item));
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CartContext.Provider, {
        value: {
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            totalPrice
        },
        children: children
    });
};
// 自訂 Hook，方便其他組件使用購物車資料
const useCart = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);


/***/ }),

/***/ 6004:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _src_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9734);
/* harmony import */ var _src_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_globals_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2406);
/* harmony import */ var _components_context_CartContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9605);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__]);
_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// pages/_app.js

 // 确保路径正确
 // 如果使用 NextUI 的 Provider
 // 引入 CartProvider
function MyApp({ Component, pageProps }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_2__.NextUIProvider, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_context_CartContext__WEBPACK_IMPORTED_MODULE_3__/* .CartProvider */ .Z, {
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                ...pageProps
            })
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9734:
/***/ (() => {



/***/ })

};
;