import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { Context } from "./context";
import * as ixs from "./instructions";
export declare class Methods {
    ctx: Context;
    ix: Instruction | null | undefined;
    constructor(ctx: Context, ix?: Instruction);
    postPrice(params: ixs.PostPriceParams): Promise<this>;
    addProduct(params: ixs.AddProductParams): Promise<this>;
    addPublisher(params: ixs.AddPublisherParams): Promise<this>;
    toTx(): TransactionBuilder;
}
