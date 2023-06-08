import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { Context } from "./context";
import * as ixs from "./instructions";

export class Methods {
  public ctx: Context;
  public ix: Instruction | null | undefined;

  public constructor(ctx: Context, ix?: Instruction) {
    this.ctx = ctx;
    this.ix = ix;
  }

  public async postPrice(params: ixs.PostPriceParams) {
    this.ix = await ixs.postPrice(this.ctx.program, params);
    return this;
  }

  public toTx(): TransactionBuilder {
    const tx = new TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet);
    return this.ix ? tx.addInstruction(this.ix) : tx;
  }
}
