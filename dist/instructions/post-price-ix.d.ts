/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
export type PostPriceParams = {
    accounts: {
        authority: PublicKey;
        product: PublicKey;
        price: PublicKey;
        publisher: PublicKey;
    };
    inputs: {
        price: BN;
    };
};
export declare function postPrice(program: Program<Oracle>, params: PostPriceParams): Promise<Instruction>;
