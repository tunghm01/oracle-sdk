import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
export type RemovePublisherParams = {
    accounts: {
        authority: PublicKey;
        controller: PublicKey;
        product: PublicKey;
        publisher: PublicKey;
    };
};
export declare function rmPublisher(program: Program<Oracle>, params: RemovePublisherParams): Promise<Instruction>;
