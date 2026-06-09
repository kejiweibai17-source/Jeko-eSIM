"use strict";
(() => {
var exports = {};
exports.id = 313;
exports.ids = [313];
exports.modules = {

/***/ 4222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
async function handler(req, res) {
    try {
        const response = await fetch("https://starislandbaby.com/test/wp-admin/admin-ajax.php?action=generate_nonce", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            return res.status(500).json({
                error: "Failed to fetch nonce"
            });
        }
        const data = await response.json();
        if (!data.success) {
            return res.status(500).json({
                error: "Failed to retrieve nonce"
            });
        }
        return res.status(200).json({
            nonce: data.data.nonce
        });
    } catch (error) {
        console.error("Error fetching nonce:", error);
        return res.status(500).json({
            error: "Internal Server Error"
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
var __webpack_exports__ = (__webpack_exec__(4222));
module.exports = __webpack_exports__;

})();