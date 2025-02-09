"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var index_js_1 = require("./api/index.js");
var htmlRoutes_js_1 = require("./htmlRoutes.js");
router.use('/api', index_js_1.default);
router.use('/', htmlRoutes_js_1.default);
exports.default = router;
