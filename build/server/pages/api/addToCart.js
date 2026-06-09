"use strict";
(() => {
var exports = {};
exports.id = 900;
exports.ids = [900];
exports.modules = {

/***/ 6956:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addToCart: () => (/* binding */ addToCart)
/* harmony export */ });
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch(`${"https://starislandbaby.com/test/"}wp-json/wc/store/cart/add-item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                id: productId,
                quantity: quantity
            })
        });
        if (!response.ok) throw new Error("加入購物車失敗");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("加入購物車錯誤:", error);
        return null;
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(6956));
module.exports = __webpack_exports__;

})();