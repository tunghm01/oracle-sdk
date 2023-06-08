import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
export type AddPublisherParams = {
    accounts: {
        authority: PublicKey;
        controller: PublicKey;
        product: PublicKey;
        publisher: PublicKey;
        authorityPublisher: PublicKey;
    };
    inputs: {
        bump: number;
    };
};
export declare function addPublisher(program: Program<Oracle>, params: AddPublisherParams): Promise<Instruction>;
