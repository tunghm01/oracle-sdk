import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
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

export async function postPrice(
  program: Program<Oracle>,
  params: PostPriceParams
): Promise<Instruction> {
  const { accounts, inputs } = params;

  const ix = await program.instruction.postPrice(params.inputs.price, {
    accounts: {
      ...accounts,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    },
  });

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
