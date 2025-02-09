"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var axios_1 = require("axios");
var uuid_1 = require("uuid");
var router = (0, express_1.Router)();
var HISTORY_FILE = path_1.default.join(__dirname, '../../data/searchHistory.json'); // Ensure the path is correct
// ✅ POST Request to retrieve weather data and save search history
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var city, geoResponse, _a, lat, lon, weatherResponse, weatherData, history_1, historyData, error_1, newEntry, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                city = req.body.city;
                if (!city) {
                    return [2 /*return*/, res.status(400).json({ error: 'City is required' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, axios_1.default.get("https://api.openweathermap.org/geo/1.0/direct?q=".concat(city, "&limit=1&appid=").concat(process.env.OPENWEATHER_API_KEY))];
            case 2:
                geoResponse = _b.sent();
                if (geoResponse.data.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'City not found' })];
                }
                _a = geoResponse.data[0], lat = _a.lat, lon = _a.lon;
                return [4 /*yield*/, axios_1.default.get("https://api.openweathermap.org/data/2.5/forecast?lat=".concat(lat, "&lon=").concat(lon, "&appid=").concat(process.env.OPENWEATHER_API_KEY, "&units=metric"))];
            case 3:
                weatherResponse = _b.sent();
                weatherData = weatherResponse.data;
                history_1 = [];
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, promises_1.default.readFile(HISTORY_FILE, 'utf8')];
            case 5:
                historyData = _b.sent();
                history_1 = JSON.parse(historyData);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error('History file not found or empty, creating a new one.');
                return [3 /*break*/, 7];
            case 7:
                newEntry = { id: (0, uuid_1.v4)(), city: city, lat: lat, lon: lon };
                history_1.push(newEntry);
                return [4 /*yield*/, promises_1.default.writeFile(HISTORY_FILE, JSON.stringify(history_1, null, 2))];
            case 8:
                _b.sent();
                res.json(weatherData);
                return [3 /*break*/, 10];
            case 9:
                error_2 = _b.sent();
                console.error('Error fetching weather data:', error_2);
                res.status(500).json({ error: 'Error fetching weather data' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// ✅ GET search history
router.get('/history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, history_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, promises_1.default.readFile(HISTORY_FILE, 'utf8')];
            case 1:
                data = _a.sent();
                history_2 = JSON.parse(data);
                res.json(history_2);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error reading search history:', error_3);
                res.status(500).json({ error: 'Error reading search history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ BONUS: DELETE city from search history
router.delete('/history/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cityId, data, history_3, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cityId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, promises_1.default.readFile(HISTORY_FILE, 'utf8')];
            case 2:
                data = _a.sent();
                history_3 = JSON.parse(data);
                // Remove the city by ID
                history_3 = history_3.filter(function (entry) { return entry.id !== cityId; });
                return [4 /*yield*/, promises_1.default.writeFile(HISTORY_FILE, JSON.stringify(history_3, null, 2))];
            case 3:
                _a.sent();
                res.json({ message: 'City deleted' });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error('Error deleting city from history:', error_4);
                res.status(500).json({ error: 'Error deleting city' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
