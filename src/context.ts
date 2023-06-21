import { Provider, Idl, Program } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { OracleIDL, OracleType } from "./types";
import { AccountFetcher } from "./fetcher";
import { Methods } from "./methods";
import { PDA } from "./pda";
/**
 * @category Core
 */
export class Context {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly opts: ConfirmOptions;
  readonly program: Program<OracleType>;
  readonly provider: Provider;
  readonly fetcher: AccountFetcher;
  readonly methods: Methods;
  readonly pda: PDA;

  public static from(
    connection: Connection,
    wallet: Wallet,
    programId: PublicKey,
    fetcher = new AccountFetcher(connection),
    opts: ConfirmOptions = Provider.defaultOptions()
  ): Context {
    const anchorProvider = new Provider(connection, wallet, opts);
    const program = new Program(OracleIDL, programId, anchorProvider);
    return new Context(anchorProvider, anchorProvider.wallet, program, fetcher, opts);
  }

  public static fromWorkspace(
    provider: Provider,
    program: Program,
    fetcher = new AccountFetcher(provider.connection),
    opts: ConfirmOptions = Provider.defaultOptions()
  ) {
    return new Context(provider, provider.wallet, program, fetcher, opts);
  }

  public static withProvider(
    provider: Provider,
    programId: PublicKey,
    fetcher = new AccountFetcher(provider.connection),
    opts: ConfirmOptions = Provider.defaultOptions()
  ): Context {
    const program = new Program(OracleIDL, programId, provider);
    return new Context(provider, provider.wallet, program, fetcher, opts);
  }

  public constructor(
    provider: Provider,
    wallet: Wallet,
    program: Program,
    fetcher: AccountFetcher,
    opts: ConfirmOptions
  ) {
    this.connection = provider.connection;
    this.wallet = wallet;
    this.opts = opts;
    // It's a hack but it works on Anchor workspace *shrug*
    this.program = program as unknown as Program<OracleType>;
    this.provider = provider;
    this.fetcher = fetcher;
    this.methods = new Methods(this);
    this.pda = new PDA(this.program.programId);
  }

  // TODO: Add another factory method to build from on-chain IDL
}
