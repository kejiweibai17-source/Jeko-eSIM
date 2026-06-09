"use strict";
(() => {
var exports = {};
exports.id = 579;
exports.ids = [579];
exports.modules = {

/***/ 2311:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
async function handler(req, res) {
    const { method } = req;
    const API_BASE = process.env.WC_API_BASE;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;
    if (!API_BASE || !consumerKey || !consumerSecret) {
        return res.status(500).json({
            error: "API credentials missing"
        });
    }
    const url = `https://starislandbaby.com/test/wp-json/wc/store/cart`;
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${authHeader}`
            },
            credentials: "include"
        });
        const text = await response.text(); // 先轉為文字，確保不是 HTML
        try {
            const data = JSON.parse(text); // 嘗試轉換為 JSON
            return res.status(response.status).json(data);
        } catch (jsonError) {
            console.error("WooCommerce API 回應非 JSON:", text);
            return res.status(500).json({
                error: "Invalid JSON response",
                details: text
            });
        }
    } catch (error) {
        console.error("API 錯誤:", error);
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
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(2311));
module.exports = __webpack_exports__;

})();