"use strict";
(() => {
var exports = {};
exports.id = 127;
exports.ids = [127];
exports.modules = {

/***/ 9648:
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ 6415:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { NEXT_PUBLIC_WP_API_BASE_URL, NEXT_PUBLIC_WC_CONSUMER_KEY, NEXT_PUBLIC_WC_CONSUMER_SECRET } = process.env;
            // 获取请求中的slug参数
            const { slug } = req.query;
            console.log("Consumer Key:", NEXT_PUBLIC_WC_CONSUMER_KEY);
            console.log("Consumer Secret:", NEXT_PUBLIC_WC_CONSUMER_SECRET);
            if (!slug) {
                return res.status(400).json({
                    error: "Missing category slug in the request"
                });
            }
            // 获取分类 ID
            const categoryUrl = `${NEXT_PUBLIC_WP_API_BASE_URL}wp-json/wc/v3/products/categories?slug=${slug}&consumer_key=${NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${NEXT_PUBLIC_WC_CONSUMER_SECRET}`;
            console.log("Category Request URL:", categoryUrl);
            const categoryResponse = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(categoryUrl);
            if (categoryResponse.data.length === 0) {
                return res.status(404).json({
                    error: `Category with slug ${slug} not found`
                });
            }
            const categoryId = categoryResponse.data[0].id;
            console.log("Category ID:", categoryId);
            // 通过分页获取所有产品
            let allProducts = [];
            let page = 1;
            let hasMore = true;
            while(hasMore){
                const productUrl = `${NEXT_PUBLIC_WP_API_BASE_URL}wp-json/wc/v3/products?category=${categoryId}&per_page=100&page=${page}&consumer_key=${NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${NEXT_PUBLIC_WC_CONSUMER_SECRET}`;
                console.log("Product Request URL:", productUrl);
                const productResponse = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(productUrl);
                if (productResponse.data.length > 0) {
                    allProducts = [
                        ...allProducts,
                        ...productResponse.data
                    ];
                    page++; // 取下一页
                } else {
                    hasMore = false; // 没有更多产品时停止
                }
            }
            console.log("Fetched Products:", allProducts.length);
            // 返回所有产品数据
            res.status(200).json(allProducts);
        } catch (error) {
            console.error("Error fetching products by category slug:", error);
            res.status(500).json({
                error: "Failed to fetch products by category slug"
            });
        }
    } else {
        res.status(405).json({
            error: "Method Not Allowed"
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(6415));
module.exports = __webpack_exports__;

})();