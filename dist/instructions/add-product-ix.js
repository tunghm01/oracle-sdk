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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = void 0;
const web3_js_1 = require("@solana/web3.js");
function addProduct(program, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accounts, inputs } = params;
        const ix = yield program.instruction.addProduct(params.inputs.productBump, params.inputs.priceBump, params.inputs.quoteCurrency, params.inputs.baseCurrency, params.inputs.assetType, params.inputs.expo, params.inputs.maxPrice, params.inputs.minPrice, params.inputs.windowSize, {
            accounts: Object.assign(Object.assign({}, accounts), { systemProgram: web3_js_1.SystemProgram.programId, rent: web3_js_1.SYSVAR_RENT_PUBKEY }),
        });
        return {
            instructions: [ix],
            cleanupInstructions: [],
            signers: [],
        };
    });
}
exports.addProduct = addProduct;
