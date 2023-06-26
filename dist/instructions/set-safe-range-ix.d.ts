/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
export type SetSafeRangeParams = {
    accounts: {
        authority: PublicKey;
        controller: PublicKey;
        product: PublicKey;
    };
    inputs: {
        maxPrice: BN;
        minPrice: BN;
    };
};
export declare function setSafeRange(program: Program<Oracle>, params: SetSafeRangeParams): Promise<Instruction>;
