import * as anchor from "@project-serum/anchor";
export declare const ORACLE = "oracle";
export declare const PRODUCT_SEED = "product";
export declare const PRICE_SEED = "price0";
export declare const PUBLISHER_SEED = "publisher";
export interface PDAInfo {
    key: anchor.web3.PublicKey;
    bump: number;
}
export declare class PDA {
    readonly programId: anchor.web3.PublicKey;
    constructor(programId: anchor.web3.PublicKey);
    controller: (version?: number) => PDAInfo;
    product: (quote: anchor.web3.PublicKey, base: anchor.web3.PublicKey, version?: number) => PDAInfo;
    price: (product: anchor.web3.PublicKey) => PDAInfo;
    publisher: (authority: anchor.web3.PublicKey, product: anchor.web3.PublicKey, version?: number) => PDAInfo;
}
