import * as anchor from "@project-serum/anchor";

export function keypairFromJson(secretKey: number[]): anchor.web3.Keypair {
  return anchor.web3.Keypair.fromSecretKey(Uint8Array.from(secretKey));
}
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
