"use strict";
(() => {
var exports = {};
exports.id = 54;
exports.ids = [54];
exports.modules = {

/***/ 4345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
// /pages/api/cart/add.js
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }
    const { productId, quantity } = req.body;
    // 確保傳入的 productId 和 quantity
    if (!productId || !quantity) {
        return res.status(400).json({
            error: "Product ID and quantity are required"
        });
    }
    try {
        const response = await fetch("https://starislandbaby.com/test/wp-json/wc/store/cart/add-item", {
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
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(4345));
module.exports = __webpack_exports__;

})();