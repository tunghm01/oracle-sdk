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

  public async addProduct(params: ixs.AddProductParams) {
    this.ix = await ixs.addProduct(this.ctx.program, params);
    return this;
  }

  public async addPublisher(params: ixs.AddPublisherParams) {
    this.ix = await ixs.addPublisher(this.ctx.program, params);
    return this;
  }

  public async rmPublisher(params: ixs.RemovePublisherParams) {
    this.ix = await ixs.rmPublisher(this.ctx.program, params);
    return this;
  }

  public async setSafeRange(params: ixs.SetSafeRangeParams) {
    this.ix = await ixs.setSafeRange(this.ctx.program, params);
    return this;
  }

  public toTx(): TransactionBuilder {
    const tx = new TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet);
    return this.ix ? tx.addInstruction(this.ix) : tx;
  }
}
