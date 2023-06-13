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
exports.ProductClient = void 0;
const anchor_1 = require("@project-serum/anchor");
const __1 = require("..");
class ProductClient {
    constructor(ctx, productKey, productData, priceData, pda) {
        this.ctx = ctx;
        this.productData = productData;
        this.priceData = priceData;
        this.productKey = productKey;
        this.pda = pda;
    }
    static getProduct(ctx, quote, base) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = new __1.PDA(ctx.program.programId);
            const product = pda.product(quote, base);
            const productData = yield ctx.fetcher.getProduct(product.key, true);
            if (!productData) {
                throw new Error(`Product of ${base}/${quote} not found`);
            }
            const priceData = yield ctx.fetcher.getPrice(productData.priceAccount, true);
            if (!priceData) {
                throw new Error(`Price of ${base}/${quote} not found`);
            }
            return new ProductClient(ctx, product.key, productData, priceData, pda);
        });
    }
    // Only admin authority
    static new(ctx, assetType, baseCurrency, baseMint, quoteCurrency, quoteMint, expo, maxPrice, minPrice, windowSize, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            const _expo = new anchor_1.BN(expo);
            const _maxPrice = ProductClient.convertToPriceFormat(maxPrice, expo);
            const _minPrice = ProductClient.convertToPriceFormat(minPrice, expo);
            const _windowSize = new anchor_1.BN(windowSize);
            const pda = new __1.PDA(ctx.program.programId);
            const controller = pda.controller();
            const product = pda.product(quoteCurrency, baseCurrency);
            const price = pda.price(product.key);
            const tx = (yield ctx.methods.addProduct({
                accounts: {
                    authority,
                    controller: controller.key,
                    product: product.key,
                    price: price.key,
                    baseMint,
                    quoteMint,
                },
                inputs: {
                    assetType,
                    baseCurrency,
                    quoteCurrency,
                    expo: _expo,
                    maxPrice: _maxPrice.price,
                    minPrice: _minPrice.price,
                    windowSize: _windowSize,
                    productBump: product.bump,
                    priceBump: price.bump,
                },
            })).toTx();
            return tx;
        });
    }
    addPublisher(authority, authorityPublisher) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = this.pda.controller();
            const publisher = this.pda.publisher(authorityPublisher, this.productKey);
            const tx = (yield this.ctx.methods.addPublisher({
                accounts: {
                    controller: controller.key,
                    authority,
                    product: this.productKey,
                    authorityPublisher,
                    publisher: publisher.key,
                },
                inputs: {
                    bump: publisher.bump,
                },
            })).toTx();
            return tx;
        });
    }
    // Role: Publisher
    // @params newPrice = 23546.22
    postPrice(newPrice, authorityPublisher) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceInFormat = ProductClient.convertToPriceFormat(newPrice, this.productData.expo);
            const priceKey = this.pda.price(this.productKey);
            const publisherKey = this.pda.publisher(authorityPublisher, this.productKey);
            // check role
            yield this.getPublisher(authorityPublisher);
            const tx = (yield this.ctx.methods.postPrice({
                accounts: {
                    authority: authorityPublisher,
                    product: this.productKey,
                    price: priceKey.key,
                    publisher: publisherKey.key,
                },
                inputs: {
                    price: priceInFormat.price,
                },
            })).toTx();
            return tx;
        });
    }
    getPublisher(authorityPublisher) {
        return __awaiter(this, void 0, void 0, function* () {
            const publisherKey = this.pda.publisher(authorityPublisher, this.productKey);
            const publisherData = yield this.ctx.fetcher.getPublisher(publisherKey.key, true);
            if (!publisherData) {
                throw new Error(`${authorityPublisher.toBase58()} is not Publisher of ${this.productData.baseCurrency}/${this.productData.quoteCurrency}`);
            }
            return publisherData;
        });
    }
    getPrice(refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (refresh) {
                yield this.refresh();
            }
            let price = this.priceData.price.toNumber();
            const expo = this.productData.expo;
            if (expo < 0) {
                price = price / Math.pow(10, Math.abs(expo));
            }
            if (expo > 0) {
                price = price * Math.pow(10, expo);
            }
            return {
                price,
                symbol: `${this.productData.baseCurrency}/${this.productData.quoteCurrency}`,
                timestamp: this.priceData.timestamp.toNumber(),
                numberPublishers: this.priceData.numPublishers,
            };
        });
    }
    static convertToPriceFormat(number, desiredExpo) {
        if (desiredExpo > 0 || desiredExpo < -10) {
            throw new Error("desiredExpo must be in range [-10; 0]");
        }
        const stringValue = number.toString();
        const dotIndex = stringValue.indexOf(".");
        let price;
        let expo;
        if (dotIndex !== -1) {
            const integerPart = stringValue.substring(0, dotIndex);
            const decimalPart = stringValue.substring(dotIndex + 1);
            const currentDecimalLength = decimalPart.length;
            const diff = Math.abs(desiredExpo) - currentDecimalLength;
            if (diff > 0) {
                price = parseInt(integerPart + decimalPart + "0".repeat(diff), 10);
            }
            else if (diff < 0) {
                const roundedDecimalPart = decimalPart.substring(0, Math.abs(desiredExpo));
                price = parseInt(integerPart + roundedDecimalPart, 10);
            }
            else {
                price = parseInt(integerPart + decimalPart, 10);
            }
            expo = desiredExpo;
        }
        else {
            price = number * Math.pow(10, Math.abs(desiredExpo));
            expo = desiredExpo;
        }
        return { price: new anchor_1.BN(price), expo };
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const productData = yield this.ctx.fetcher.getProduct(this.productKey, true);
            if (!productData) {
                throw new Error(`Product of ${this.productData.baseCurrency}/${this.productData.quoteCurrency} not found`);
            }
            this.productData = productData;
            const priceData = yield this.ctx.fetcher.getPrice(productData.priceAccount, true);
            if (!priceData) {
                throw new Error(`Price of ${this.productData.baseCurrency}/${this.productData.quoteCurrency} not found`);
            }
            this.priceData = priceData;
            return this;
        });
    }
}
exports.ProductClient = ProductClient;
