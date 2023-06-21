/// <reference types="bn.js" />
import { BN, AccountsCoder, Idl } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Oracle } from "../artifacts/oracle";
export type OracleType = Oracle;
export declare const OracleIDL: Idl;
export declare const accountsCoder: AccountsCoder<string>;
export declare enum AccountName {
    Controller = "Controller",
    Product = "Product",
    Price = "Price",
    Publisher = "Publisher"
}
export declare const AssetType: {
    Forex: {
        forex: {};
    };
    Crypto: {
        crypto: {};
    };
};
export declare const ProductStatus: {
    Unknown: {
        unknown: {};
    };
    Offline: {
        offline: {};
    };
    Online: {
        online: {};
    };
};
export declare const PublisherStatus: {
    Unknown: {
        unknown: {};
    };
    Valid: {
        valid: {};
    };
};
export type PriceResult = {
    price: number;
    symbol: string;
    numberPublishers: number;
    timestamp: number;
};
export type ProductData = {
    version: number;
    status: object;
    assetType: object;
    quoteCurrency: String;
    quoteMint: PublicKey;
    baseCurrency: String;
    baseMint: PublicKey;
    priceAccount: PublicKey;
    expo: number;
    maxPrice: BN;
    minPrice: BN;
    windowSize: BN;
    controller: PublicKey;
    bump: number[];
};
export type PriceData = {
    version: number;
    status: object;
    productAccount: PublicKey;
    price: BN;
    numPublishers: number;
    timestamp: BN;
    prevPrice: BN;
    prevTimestamp: BN;
    bump: number[];
};
export type PublisherData = {
    status: object;
    authority: PublicKey;
    product: PublicKey;
    controller: PublicKey;
    lastPushTimestamp: BN;
    bump: number[];
};
