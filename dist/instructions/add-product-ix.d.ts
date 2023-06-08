/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
export type AddProductParams = {
    accounts: {
        authority: PublicKey;
        controller: PublicKey;
        product: PublicKey;
        price: PublicKey;
    };
    inputs: {
        assetType: object;
        baseCurrency: string;
        quoteCurrency: string;
        expo: BN;
        maxPrice: BN;
        minPrice: BN;
        windowSize: BN;
        productBump: number;
        priceBump: number;
    };
};
export declare function addProduct(program: Program<Oracle>, params: AddProductParams): Promise<Instruction>;
