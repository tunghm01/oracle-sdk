"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherStatus = exports.ProductStatus = exports.AssetType = exports.AccountName = exports.accountsCoder = exports.OracleIDL = void 0;
const anchor_1 = require("@project-serum/anchor");
const oracle_json_1 = __importDefault(require("../artifacts/oracle.json"));
exports.OracleIDL = oracle_json_1.default;
exports.accountsCoder = new anchor_1.AccountsCoder(exports.OracleIDL);
var AccountName;
(function (AccountName) {
    AccountName["Controller"] = "Controller";
    AccountName["Product"] = "Product";
    AccountName["Price"] = "Price";
    AccountName["Publisher"] = "Publisher";
})(AccountName = exports.AccountName || (exports.AccountName = {}));
exports.AssetType = {
    Forex: { forex: {} },
    Crypto: { crypto: {} },
};
exports.ProductStatus = {
    Unknown: { unknown: {} },
    Offline: { offline: {} },
    Online: { online: {} },
};
exports.PublisherStatus = {
    Unknown: { unknown: {} },
    Valid: { valid: {} },
};
