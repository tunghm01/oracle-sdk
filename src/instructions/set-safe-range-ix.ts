import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram } from "@solana/web3.js";
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

export async function setSafeRange(
  program: Program<Oracle>,
  params: SetSafeRangeParams
): Promise<Instruction> {
  const { accounts, inputs } = params;

  const ix = await program.instruction.setSafeRange(inputs.maxPrice, inputs.minPrice, {
    accounts: {
      ...accounts,
      systemProgram: SystemProgram.programId,
    },
  });

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
