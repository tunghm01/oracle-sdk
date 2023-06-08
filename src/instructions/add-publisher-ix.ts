import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
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

export async function addPublisher(
  program: Program<Oracle>,
  params: AddPublisherParams
): Promise<Instruction> {
  const { accounts, inputs } = params;

  const ix = await program.instruction.addPublisher(params.inputs.bump, {
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
