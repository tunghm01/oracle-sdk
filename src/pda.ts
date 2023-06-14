import * as anchor from "@project-serum/anchor";

export const ORACLE = "oracle";
export const PRODUCT_SEED = "product";
export const PRICE_SEED = "price0";
export const PUBLISHER_SEED = "publisher";

export interface PDAInfo {
  key: anchor.web3.PublicKey;
  bump: number;
}

export class PDA {
  readonly programId: anchor.web3.PublicKey;

  public constructor(programId: anchor.web3.PublicKey) {
    this.programId = programId;
  }

  controller = (version = 1): PDAInfo => {
    const _version: anchor.BN = new anchor.BN(version);
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(ORACLE), _version.toArrayLike(Buffer, "le", 2)],
      this.programId
    );
    return {
      key: pda,
      bump: bump,
    };
  };

  product = (quote: anchor.web3.PublicKey, base: anchor.web3.PublicKey, version = 1): PDAInfo => {
    const _version: anchor.BN = new anchor.BN(version);
    const controller = this.controller(version);

    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(PRODUCT_SEED),
        controller.key.toBuffer(),
        _version.toArrayLike(Buffer, "le", 2),
        quote.toBuffer(),
        base.toBuffer(),
      ],
      this.programId
    );
    return {
      key: pda,
      bump: bump,
    };
  };

  price = (product: anchor.web3.PublicKey): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(PRICE_SEED), product.toBuffer()],
      this.programId
    );
    return {
      key: pda,
      bump: bump,
    };
  };

  publisher = (
    authority: anchor.web3.PublicKey,
    product: anchor.web3.PublicKey,
    version = 1
  ): PDAInfo => {
    const controller = this.controller(version);

    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(PUBLISHER_SEED),
        controller.key.toBuffer(),
        product.toBuffer(),
        authority.toBuffer(),
      ],
      this.programId
    );
    return {
      key: pda,
      bump: bump,
    };
  };
}
