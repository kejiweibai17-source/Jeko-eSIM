"use strict";
(() => {
var exports = {};
exports.id = 740;
exports.ids = [740];
exports.modules = {

/***/ 9648:
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ 1665:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GET: () => (/* binding */ GET)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

async function GET(req) {
    try {
        const { NEXT_PUBLIC_WP_API_BASE_URL, NEXT_PUBLIC_WC_CONSUMER_KEY, NEXT_PUBLIC_WC_CONSUMER_SECRET } = process.env;
        // 确保环境变量存在
        if (!NEXT_PUBLIC_WP_API_BASE_URL || !NEXT_PUBLIC_WC_CONSUMER_KEY || !NEXT_PUBLIC_WC_CONSUMER_SECRET) {
            console.error("Missing required environment variables");
            return new Response(JSON.stringify({
                error: "Environment variables are not properly configured"
            }), {
                status: 500
            });
        }
        // 获取请求中的分类 ID 参数
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("category"); // 获取查询参数 `category`
        // 确保 categoryId 存在
        if (!categoryId) {
            return new Response(JSON.stringify({
                error: "Category ID is required"
            }), {
                status: 400
            });
        }
        // 获取当前时间戳，避免缓存
        const timestamp = new Date().getTime();
        // 第一步：通过分类 ID 获取产品
        const productsUrl = `${NEXT_PUBLIC_WP_API_BASE_URL}/wp-json/wc/v3/products?consumer_key=${NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${NEXT_PUBLIC_WC_CONSUMER_SECRET}&category=${categoryId}&timestamp=${timestamp}&per_page=100`;
        // 打印请求的 URL，确保 URL 正确
        console.log("Request URL for products:", productsUrl);
        // 使用 axios 获取产品数据
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(productsUrl);
        // 打印响应数据，查看是否正确筛选了产品
        console.log("Fetched products:", response.data);
        let products = response.data;
        // 如果没有产品，返回一个提示
        if (products.length === 0) {
            console.log("No products found for this category.");
        }
        // 返回筛选后的产品数据
        return new Response(JSON.stringify(products), {
            status: 200
        });
    } catch (error) {
        // 捕获错误并返回错误信息
        console.error("Error fetching products:", error.message);
        return new Response(JSON.stringify({
            error: `Failed to fetch products: ${error.message}`
        }), {
            status: 500
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(1665));
module.exports = __webpack_exports__;

})();