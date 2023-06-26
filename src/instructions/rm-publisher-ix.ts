import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
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

export async function rmPublisher(
  program: Program<Oracle>,
  params: RemovePublisherParams
): Promise<Instruction> {
  const { accounts } = params;

  const ix = await program.instruction.removePublisher({
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
