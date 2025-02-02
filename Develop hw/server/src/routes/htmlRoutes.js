"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var express_1 = require("express");
var __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var __dirname = node_path_1.default.dirname(__filename);
var router = (0, express_1.Router)();
// Define route to serve index.html
router.get('*', function (req, res) {
    res.sendFile(node_path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
exports.default = router;
