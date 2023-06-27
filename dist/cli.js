#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const commander_1 = require("commander");
const anchor = __importStar(require("@project-serum/anchor"));
const anchor_1 = require("@project-serum/anchor");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("./index");
const oracle_json_1 = __importDefault(require("./artifacts/oracle.json"));
const owner_json_1 = __importDefault(require("./.wallets/owner.json"));
const figlet = require("figlet");
const program = new commander_1.Command();
const MAINNET_RPC = "https://api-mainnet-beta.renec.foundation:8899/";
const TESTNET_RPC = "https://api-testnet.renec.foundation:8899/";
const LOCAL_RPC = "http://localhost:8899/";
console.log(figlet.textSync("Oracle Program"));
console.log("");
function connectCluster(rpc, ownerKey, programId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection(rpc);
        const wallet = new nodewallet_1.default((0, index_1.keypairFromJson)(ownerKey));
        const anchorProvider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
        const peggedProgram = new anchor_1.Program(oracle_json_1.default, programId, anchorProvider);
        const program = peggedProgram;
        return program;
    });
}
program
    .command("init")
    .description("initialize a new oracle controller.")
    .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
    .option("-v, --version <number>", "Version of the controller", "1")
    .action((params) => __awaiter(void 0, void 0, void 0, function* () {
    let { version, network } = params;
    console.log("Initializing a new oracle controller.");
    console.log("params:", params);
    if (isNaN(version)) {
        console.log("Error: -v or --version must be valid number");
        return;
    }
    version = parseInt(version);
    if (!network || (network !== "mainnet" && network !== "testnet" && network !== "localnet")) {
        console.log("Error: -n, --network is required. [mainnet, testnet, localnet]");
        return;
    }
    let rpc = MAINNET_RPC;
    if (network === "testnet") {
        rpc = TESTNET_RPC;
    }
    if (network === "localnet") {
        rpc = LOCAL_RPC;
    }
    if (!process.env.PROGRAM_ID) {
        console.log("PROGRAM_ID is not found in .env file");
        return;
    }
    const program = yield connectCluster(rpc, owner_json_1.default, new web3_js_1.PublicKey(process.env.PROGRAM_ID));
    const { provider, programId } = program;
    const { wallet } = provider;
    if (!wallet.publicKey) {
        console.log("Error: Please provide owner key. `export OWNER_KEY=`");
        return;
    }
    console.log(`RPC: ${rpc}`);
    console.log(`Owner: ${wallet.publicKey.toBase58()}`);
    console.log(`Oracle Id: ${programId.toBase58()}`);
    console.log();
    const pda = new index_1.PDA(programId);
    const controller = pda.controller(version);
    const signature = yield program.rpc.initialize(controller.bump, version, {
        accounts: {
            authority: program.provider.wallet.publicKey,
            controller: controller.key,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
    });
    console.log(`oracle controller: ${controller.key.toBase58()}`);
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
}));
//yarn cli addPair -n localnet -qs VND -qt FitRv8WbYZVfRZSc2nU2HjwBJv4f69JjPtcmo3GL7amh -bs USD -bt 14qVe8V34bXt7prLKRrkP5spScRQRJeoosojdrZDKm31 -max 25000.23 -min 22000.32
program
    .command("addPair")
    .description("add a new oracle pair.")
    .option("-qs, --quoteSymbol <string>", "The symbol of quote. Example: VND")
    .option("-qt, --quoteToken <string>", "The token of quote. Example: reVND")
    .option("-bs, --baseSymbol <string>", "The symbol of base. Example: USD")
    .option("-bt, --baseToken <string>", "The token of base. Example: reUSD")
    .option("-max, --maxPrice <number>", "The maximum price. Example: maximum 1 reUSD = 25000.83 reVND")
    .option("-min, --minPrice <number>", "The minimum price. Example: minimum 1 reUSD = 22000.23 reVND")
    .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
    .option("-v, --version <number>", "Version of the controller", "1")
    .action((params) => __awaiter(void 0, void 0, void 0, function* () {
    let { version, network, quoteSymbol, quoteToken, baseSymbol, baseToken, maxPrice, minPrice } = params;
    console.log("Adding a new oracle pair.");
    console.log("params:", params);
    if (!quoteSymbol || quoteSymbol === "") {
        console.log("Error: -qs, --quoteSymbol is required");
        return;
    }
    if (!baseSymbol || baseSymbol === "") {
        console.log("Error: -bs, --baseSymbol is required");
        return;
    }
    if (!quoteToken || quoteToken === "") {
        console.log("Error: -qt, --quoteToken is required");
        return;
    }
    if (!baseToken || baseToken === "") {
        console.log("Error: -bt, --baseToken is required");
        return;
    }
    quoteToken = new web3_js_1.PublicKey(quoteToken);
    baseToken = new web3_js_1.PublicKey(baseToken);
    if (isNaN(maxPrice)) {
        console.log("Error: -max, --maxPrice must be valid number");
        return;
    }
    if (isNaN(minPrice)) {
        console.log("Error: -min, --minPrice must be valid number");
        return;
    }
    if (isNaN(version)) {
        console.log("Error: -v or --version must be valid number");
        return;
    }
    version = parseInt(version);
    if (!network || (network !== "mainnet" && network !== "testnet" && network !== "localnet")) {
        console.log("Error: -n, --network is required. [mainnet, testnet, localnet]");
        return;
    }
    let rpc = MAINNET_RPC;
    if (network === "testnet") {
        rpc = TESTNET_RPC;
    }
    if (network === "localnet") {
        rpc = LOCAL_RPC;
    }
    if (!process.env.PROGRAM_ID) {
        console.log("PROGRAM_ID is not found in .env file");
        return;
    }
    const program = yield connectCluster(rpc, owner_json_1.default, new web3_js_1.PublicKey(process.env.PROGRAM_ID));
    const { provider, programId } = program;
    const { wallet } = provider;
    if (!wallet.publicKey) {
        console.log("Error: Please provide owner key. `export OWNER_KEY=`");
        return;
    }
    console.log(`RPC: ${rpc}`);
    console.log(`Owner: ${wallet.publicKey.toBase58()}`);
    console.log(`Oracle Id: ${programId.toBase58()}`);
    console.log();
    const expo = -2; // ~ 2 decimals
    const windowSize = 20; // 20s
    const ctx = index_1.Context.withProvider(provider, program.programId);
    const tx = yield index_1.ProductClient.new(ctx, index_1.AssetType.Forex, baseSymbol, baseToken, quoteSymbol, quoteToken, expo, maxPrice, minPrice, windowSize, wallet.publicKey, version);
    const signature = yield tx.buildAndExecute();
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
}));
program
    .command("addRelayer")
    .description("add a new oracle relayer.")
    .option("-qt, --quoteToken <string>", "The token of quote. Example: reVND")
    .option("-bt, --baseToken <string>", "The token of base. Example: reUSD")
    .option("-r, --relayer <string>", "The relayer address")
    .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
    .option("-v, --version <number>", "Version of the controller", "1")
    .action((params) => __awaiter(void 0, void 0, void 0, function* () {
    let { version, network, quoteToken, baseToken, relayer } = params;
    console.log("Adding a new oracle relayer.");
    console.log("params:", params);
    if (!relayer || relayer === "") {
        console.log("Error: -r, --relayer is required");
        return;
    }
    if (!quoteToken || quoteToken === "") {
        console.log("Error: -qt, --quoteToken is required");
        return;
    }
    if (!baseToken || baseToken === "") {
        console.log("Error: -bt, --baseToken is required");
        return;
    }
    quoteToken = new web3_js_1.PublicKey(quoteToken);
    baseToken = new web3_js_1.PublicKey(baseToken);
    relayer = new web3_js_1.PublicKey(relayer);
    if (isNaN(version)) {
        console.log("Error: -v or --version must be valid number");
        return;
    }
    version = parseInt(version);
    if (!network || (network !== "mainnet" && network !== "testnet" && network !== "localnet")) {
        console.log("Error: -n, --network is required. [mainnet, testnet, localnet]");
        return;
    }
    let rpc = MAINNET_RPC;
    if (network === "testnet") {
        rpc = TESTNET_RPC;
    }
    if (network === "localnet") {
        rpc = LOCAL_RPC;
    }
    if (!process.env.PROGRAM_ID) {
        console.log("PROGRAM_ID is not found in .env file");
        return;
    }
    const program = yield connectCluster(rpc, owner_json_1.default, new web3_js_1.PublicKey(process.env.PROGRAM_ID));
    const { provider, programId } = program;
    const { wallet } = provider;
    if (!wallet.publicKey) {
        console.log("Error: Please provide owner key. `export OWNER_KEY=`");
        return;
    }
    console.log(`RPC: ${rpc}`);
    console.log(`Owner: ${wallet.publicKey.toBase58()}`);
    console.log(`Oracle Id: ${programId.toBase58()}`);
    console.log();
    const ctx = index_1.Context.withProvider(provider, program.programId);
    const productClient = yield index_1.ProductClient.getProduct(ctx, quoteToken, baseToken, version);
    const tx = yield productClient.addPublisher(productClient.ctx.wallet.publicKey, relayer);
    const signature = yield tx.buildAndExecute();
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
}));
program.parse();
