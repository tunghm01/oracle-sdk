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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFetcher = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const parsing_1 = require("./parsing");
class AccountFetcher {
    constructor(connection, cache) {
        this._cache = {};
        this.connection = connection;
        this._cache = cache !== null && cache !== void 0 ? cache : {};
    }
    /*** Public Methods ***/
    /**
     * Retrieve minimum balance for rent exemption of a Token Account;
     *
     * @param refresh force refresh of account rent exemption
     * @returns minimum balance for rent exemption
     */
    getTokenAccountRentExempt(refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // This value should be relatively static or at least not break according to spec
            // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
            if (!this._tokenAccountRentExempt || refresh) {
                this._tokenAccountRentExempt = yield this.connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
            }
            return this._tokenAccountRentExempt;
        });
    }
    /**
     * Update the cached value of all entities currently in the cache.
     * Uses batched rpc request for network efficient fetch.
     */
    refreshAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = Object.keys(this._cache);
            const data = yield this.bulkRequest(addresses);
            for (const [idx, [key, cachedContent]] of Object.entries(this._cache).entries()) {
                const entity = cachedContent.entity;
                const value = entity.parse(data[idx]);
                this._cache[key] = { entity, value };
            }
        });
    }
    /*** Private Methods ***/
    /**
     * Retrieve from cache or fetch from rpc, an account
     */
    get(address, entity, refresh) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const key = address.toBase58();
            const cachedValue = (_a = this._cache[key]) === null || _a === void 0 ? void 0 : _a.value;
            if (cachedValue !== undefined && !refresh) {
                return cachedValue;
            }
            const accountInfo = yield this.connection.getAccountInfo(address);
            const accountData = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data;
            const value = entity.parse(accountData);
            this._cache[key] = { entity, value };
            return value;
        });
    }
    /**
     * Retrieve from cache or fetch from rpc, a list of accounts
     */
    list(addresses, entity, refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = addresses.map((address) => address.toBase58());
            const cachedValues = keys.map((key) => {
                var _a;
                return [
                    key,
                    refresh ? undefined : (_a = this._cache[key]) === null || _a === void 0 ? void 0 : _a.value,
                ];
            });
            /* Look for accounts not found in cache */
            const undefinedAccounts = [];
            cachedValues.forEach(([key, value], cacheIndex) => {
                if (value === undefined) {
                    undefinedAccounts.push({ cacheIndex, key });
                }
            });
            /* Fetch accounts not found in cache */
            if (undefinedAccounts.length > 0) {
                const data = yield this.bulkRequest(undefinedAccounts.map((account) => account.key));
                undefinedAccounts.forEach(({ cacheIndex, key }, dataIndex) => {
                    var _a;
                    const value = entity.parse(data[dataIndex]);
                    (0, tiny_invariant_1.default)(((_a = cachedValues[cacheIndex]) === null || _a === void 0 ? void 0 : _a[1]) === undefined, "unexpected non-undefined value");
                    cachedValues[cacheIndex] = [key, value];
                    this._cache[key] = { entity, value };
                });
            }
            const result = cachedValues
                .map(([_, value]) => value)
                .filter((value) => value !== undefined);
            (0, tiny_invariant_1.default)(result.length === addresses.length, "not enough results fetched");
            return result;
        });
    }
    /**
     * Make batch rpc request
     */
    bulkRequest(addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = [];
            const chunk = 100; // getMultipleAccounts has limitation of 100 accounts per request
            for (let i = 0; i < addresses.length; i += chunk) {
                const addressesSubset = addresses.slice(i, i + chunk);
                const res = this.connection._rpcRequest("getMultipleAccounts", [
                    addressesSubset,
                    { commitment: this.connection.commitment },
                ]);
                responses.push(res);
            }
            const combinedResult = [];
            (yield Promise.all(responses)).forEach((res) => {
                var _a;
                (0, tiny_invariant_1.default)(!res.error, `bulkRequest result error: ${res.error}`);
                (0, tiny_invariant_1.default)(!!((_a = res.result) === null || _a === void 0 ? void 0 : _a.value), "bulkRequest no value");
                res.result.value.forEach((account) => {
                    if (!account || account.data[1] !== "base64") {
                        combinedResult.push(null);
                    }
                    else {
                        combinedResult.push(Buffer.from(account.data[0], account.data[1]));
                    }
                });
            });
            (0, tiny_invariant_1.default)(combinedResult.length === addresses.length, "bulkRequest not enough results");
            return combinedResult;
        });
    }
    // YOUR CODE:
    getProduct(address, refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get((0, anchor_1.translateAddress)(address), parsing_1.ParsableProduct, refresh);
        });
    }
    getPrice(address, refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get((0, anchor_1.translateAddress)(address), parsing_1.ParsablePrice, refresh);
        });
    }
    getPublisher(address, refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get((0, anchor_1.translateAddress)(address), parsing_1.ParsablePublisher, refresh);
        });
    }
}
exports.AccountFetcher = AccountFetcher;
