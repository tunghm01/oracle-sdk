/// <reference types="bn.js" />
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { Context, PDA } from "..";
import { ProductData, PriceData, PriceResult, PublisherData } from "../types";
export declare class ProductClient {
    ctx: Context;
    productData: ProductData;
    priceData: PriceData;
    productKey: PublicKey;
    pda: PDA;
    constructor(ctx: Context, productKey: PublicKey, productData: ProductData, priceData: PriceData, pda: PDA);
    static getProduct(ctx: Context, quote: string, base: string): Promise<ProductClient>;
    static new(ctx: Context, assetType: object, baseCurrency: string, baseMint: PublicKey, quoteCurrency: string, quoteMint: PublicKey, expo: number, maxPrice: number, minPrice: number, windowSize: number, authority: PublicKey): Promise<TransactionBuilder>;
    addPublisher(authority: PublicKey, authorityPublisher: PublicKey): Promise<TransactionBuilder>;
    postPrice(newPrice: number, authorityPublisher: PublicKey): Promise<TransactionBuilder>;
    getPublisher(authorityPublisher: PublicKey): Promise<PublisherData>;
    getPrice(refresh?: boolean): Promise<PriceResult>;
    static convertToPriceFormat(number: number, desiredExpo: number): {
        price: BN;
        expo: number;
    };
    refresh(): Promise<ProductClient>;
}
