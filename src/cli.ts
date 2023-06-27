#! /usr/bin/env node

require("dotenv").config();
import { Command } from "commander";
import * as anchor from "@project-serum/anchor";
import { Program, Idl } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { SYSVAR_RENT_PUBKEY, PublicKey, Connection } from "@solana/web3.js";
import { keypairFromJson, PDA, ProductClient, Context, AssetType } from "./index";

import ProgramIDL from "./artifacts/oracle.json";
import { Oracle } from "./artifacts/oracle";
import ownerKey from "./.wallets/owner.json";

const figlet = require("figlet");
const program = new Command();

const MAINNET_RPC = "https://api-mainnet-beta.renec.foundation:8899/";
const TESTNET_RPC = "https://api-testnet.renec.foundation:8899/";
const LOCAL_RPC = "http://localhost:8899/";

console.log(figlet.textSync("Oracle Program"));
console.log("");

async function connectCluster(
  rpc: string,
  ownerKey: number[],
  programId: PublicKey
): Promise<Program<Oracle>> {
  const connection = new Connection(rpc);
  const wallet = new NodeWallet(keypairFromJson(ownerKey));
  const anchorProvider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
  const peggedProgram: any = new Program(ProgramIDL as Idl, programId, anchorProvider);
  const program = peggedProgram as Program<Oracle>;
  return program;
}

program
  .command("init")
  .description("initialize a new oracle controller.")
  .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
  .option("-v, --version <number>", "Version of the controller", "1")
  .action(async (params) => {
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

    const program = await connectCluster(rpc, ownerKey, new PublicKey(process.env.PROGRAM_ID));
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

    const pda = new PDA(programId);
    const controller = pda.controller(version);
    const signature = await program.rpc.initialize(controller.bump, version, {
      accounts: {
        authority: program.provider.wallet.publicKey,
        controller: controller.key,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    });

    console.log(`oracle controller: ${controller.key.toBase58()}`);
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
  });

//yarn cli addPair -n localnet -qs VND -qt FitRv8WbYZVfRZSc2nU2HjwBJv4f69JjPtcmo3GL7amh -bs USD -bt 14qVe8V34bXt7prLKRrkP5spScRQRJeoosojdrZDKm31 -max 25000.23 -min 22000.32
program
  .command("addPair")
  .description("add a new oracle pair.")
  .option("-qs, --quoteSymbol <string>", "The symbol of quote. Example: VND")
  .option("-qt, --quoteToken <string>", "The token of quote. Example: reVND")
  .option("-bs, --baseSymbol <string>", "The symbol of base. Example: USD")
  .option("-bt, --baseToken <string>", "The token of base. Example: reUSD")
  .option(
    "-max, --maxPrice <number>",
    "The maximum price. Example: maximum 1 reUSD = 25000.83 reVND"
  )
  .option(
    "-min, --minPrice <number>",
    "The minimum price. Example: minimum 1 reUSD = 22000.23 reVND"
  )
  .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
  .option("-v, --version <number>", "Version of the controller", "1")
  .action(async (params) => {
    let { version, network, quoteSymbol, quoteToken, baseSymbol, baseToken, maxPrice, minPrice } =
      params;

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
    quoteToken = new PublicKey(quoteToken);
    baseToken = new PublicKey(baseToken);

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

    const program = await connectCluster(rpc, ownerKey, new PublicKey(process.env.PROGRAM_ID));
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

    const ctx = Context.withProvider(provider, program.programId);
    const tx = await ProductClient.new(
      ctx,
      AssetType.Forex,
      baseSymbol,
      baseToken,
      quoteSymbol,
      quoteToken,
      expo,
      maxPrice,
      minPrice,
      windowSize,
      wallet.publicKey,
      version
    );
    const signature = await tx.buildAndExecute();
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
  });

program
  .command("addRelayer")
  .description("add a new oracle relayer.")
  .option("-qt, --quoteToken <string>", "The token of quote. Example: reVND")
  .option("-bt, --baseToken <string>", "The token of base. Example: reUSD")
  .option("-r, --relayer <string>", "The relayer address")
  .option("-n, --network <string>", "Network: mainnet, testnet, localnet", "mainnet")
  .option("-v, --version <number>", "Version of the controller", "1")
  .action(async (params) => {
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
    quoteToken = new PublicKey(quoteToken);
    baseToken = new PublicKey(baseToken);
    relayer = new PublicKey(relayer);

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
    const program = await connectCluster(rpc, ownerKey, new PublicKey(process.env.PROGRAM_ID));
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

    const ctx = Context.withProvider(provider, program.programId);
    const productClient = await ProductClient.getProduct(ctx, quoteToken, baseToken, version);

    const tx = await productClient.addPublisher(productClient.ctx.wallet.publicKey, relayer);
    const signature = await tx.buildAndExecute();
    console.log(`https://explorer.renec.foundation/tx/${signature}?cluster=${network}`);
    console.log("DONE");
  });

program.parse();
