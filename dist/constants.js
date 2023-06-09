"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.REUSD_TESTNET = exports.REVND_TESTNET = exports.ORACLE_PROGRAM_ID_TESTNET = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
exports.ORACLE_PROGRAM_ID_TESTNET = new anchor.web3.PublicKey("iXZdzEcBBog2t41gXcJvsxtdaydmMxVdHg3znHawb13");
exports.REVND_TESTNET = new anchor.web3.PublicKey("2biriGL1VxANfbdZWiNcyr3d8NndJFwpjUi7KT4ZTZkQ");
exports.REUSD_TESTNET = new anchor.web3.PublicKey("HKsJuy7nr8jP1LfUng1FuauMLrCsb5TooR7VNxjEygtP");
exports.VERSION = 1;
