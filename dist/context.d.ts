import { Provider, Program } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { OracleType } from "./types";
import { AccountFetcher } from "./fetcher";
import { Methods } from "./methods";
import { PDA } from "./pda";
/**
 * @category Core
 */
export declare class Context {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly opts: ConfirmOptions;
    readonly program: Program<OracleType>;
    readonly provider: Provider;
    readonly fetcher: AccountFetcher;
    readonly methods: Methods;
    readonly pda: PDA;
    static from(connection: Connection, wallet: Wallet, programId: PublicKey, fetcher?: AccountFetcher, opts?: ConfirmOptions): Context;
    static fromWorkspace(provider: Provider, program: Program, fetcher?: AccountFetcher, opts?: ConfirmOptions): Context;
    static withProvider(provider: Provider, programId: PublicKey, fetcher?: AccountFetcher, opts?: ConfirmOptions): Context;
    constructor(provider: Provider, wallet: Wallet, program: Program, fetcher: AccountFetcher, opts: ConfirmOptions);
}
