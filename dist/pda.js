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
exports.PDA = exports.PUBLISHER_SEED = exports.PRICE_SEED = exports.PRODUCT_SEED = exports.ORACLE = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
exports.ORACLE = "oracle";
exports.PRODUCT_SEED = "product";
exports.PRICE_SEED = "price0";
exports.PUBLISHER_SEED = "publisher";
class PDA {
    constructor(programId) {
        this.controller = (version = 1) => {
            const _version = new anchor.BN(version);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode(exports.ORACLE), _version.toArrayLike(Buffer, "le", 2)], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.product = (quote, base, version = 1) => {
            const _version = new anchor.BN(version);
            const controller = this.controller(version);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(exports.PRODUCT_SEED),
                controller.key.toBuffer(),
                _version.toArrayLike(Buffer, "le", 2),
                quote.toBuffer(),
                base.toBuffer(),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.price = (product) => {
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode(exports.PRICE_SEED), product.toBuffer()], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.publisher = (authority, product, version = 1) => {
            const controller = this.controller(version);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(exports.PUBLISHER_SEED),
                controller.key.toBuffer(),
                product.toBuffer(),
                authority.toBuffer(),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.programId = programId;
    }
}
exports.PDA = PDA;
