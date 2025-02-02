"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var cors_1 = require("cors");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
// Load environment variables
dotenv_1.default.config();
// Convert ES module URL to __dirname equivalent
var __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var __dirname = node_path_1.default.dirname(__filename);
// Import routes
var index_js_1 = require("./routes/index.js");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// ✅ Middleware for JSON & URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Enable CORS for client-server communication
app.use((0, cors_1.default)());
// ✅ Serve static files (React/Vite frontend)
var clientDistPath = node_path_1.default.join(__dirname, '..', 'client', 'dist');
app.use(express_1.default.static(clientDistPath));
// ✅ Connect API routes
app.use(index_js_1.default);
// ✅ SPA Handling: Serve index.html for unknown routes
app.get('*', function (req, res) {
    var indexPath = node_path_1.default.join(clientDistPath, 'index.html');
    res.sendFile(indexPath, function (err) {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Server error: Unable to load frontend');
        }
    });
});
// ✅ Start the server
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT)); });
