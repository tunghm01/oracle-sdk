"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const anchor_1 = require("@project-serum/anchor");
const types_1 = require("./types");
const fetcher_1 = require("./fetcher");
const methods_1 = require("./methods");
/**
 * @category Core
 */
class Context {
    static from(connection, wallet, programId, fetcher = new fetcher_1.AccountFetcher(connection), opts = anchor_1.Provider.defaultOptions()) {
        const anchorProvider = new anchor_1.Provider(connection, wallet, opts);
        const program = new anchor_1.Program(types_1.OracleIDL, programId, anchorProvider);
        return new Context(anchorProvider, anchorProvider.wallet, program, fetcher, opts);
    }
    static fromWorkspace(provider, program, fetcher = new fetcher_1.AccountFetcher(provider.connection), opts = anchor_1.Provider.defaultOptions()) {
        return new Context(provider, provider.wallet, program, fetcher, opts);
    }
    static withProvider(provider, programId, fetcher = new fetcher_1.AccountFetcher(provider.connection), opts = anchor_1.Provider.defaultOptions()) {
        const program = new anchor_1.Program(types_1.OracleIDL, programId, provider);
        return new Context(provider, provider.wallet, program, fetcher, opts);
    }
    constructor(provider, wallet, program, fetcher, opts) {
        this.connection = provider.connection;
        this.wallet = wallet;
        this.opts = opts;
        // It's a hack but it works on Anchor workspace *shrug*
        this.program = program;
        this.provider = provider;
        this.fetcher = fetcher;
        this.methods = new methods_1.Methods(this);
    }
}
exports.Context = Context;
