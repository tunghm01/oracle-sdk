import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { Oracle } from "../artifacts/oracle";
// import { AssetType } from "../types";

export type AddProductParams = {
  accounts: {
    authority: PublicKey;
    controller: PublicKey;
    product: PublicKey;
    price: PublicKey;
  };
  inputs: {
    assetType: object; // AssetType
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

export async function addProduct(
  program: Program<Oracle>,
  params: AddProductParams
): Promise<Instruction> {
  const { accounts, inputs } = params;

  const ix = await program.instruction.addProduct(
    params.inputs.productBump,
    params.inputs.priceBump,
    params.inputs.quoteCurrency,
    params.inputs.baseCurrency,
    params.inputs.assetType,
    params.inputs.expo,
    params.inputs.maxPrice,
    params.inputs.minPrice,
    params.inputs.windowSize,
    {
      accounts: {
        ...accounts,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
