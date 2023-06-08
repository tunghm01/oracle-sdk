import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { Context, PDA } from "..";
import { ProductData, PriceData, PriceResult } from "../types";

export class ProductClient {
  ctx: Context;
  public productData: ProductData;
  public priceData: PriceData;
  public productKey: PublicKey;
  public pda: PDA;

  constructor(
    ctx: Context,
    productKey: PublicKey,
    productData: ProductData,
    priceData: PriceData,
    pda: PDA
  ) {
    this.ctx = ctx;
    this.productData = productData;
    this.priceData = priceData;
    this.productKey = productKey;
    this.pda = pda;
  }

  public static async getProduct(
    ctx: Context,
    quote: string,
    base: string
  ): Promise<ProductClient> {
    const pda = new PDA(ctx.program.programId);
    const product = pda.product(quote, base);

    const productData = await ctx.fetcher.getProduct(product.key, true);
    if (!productData) {
      throw new Error(`Product of ${base}/${quote} not found`);
    }
    const priceData = await ctx.fetcher.getPrice(productData.priceAccount, true);
    if (!priceData) {
      throw new Error(`Price of ${base}/${quote} not found`);
    }
    return new ProductClient(ctx, product.key, productData, priceData, pda);
  }

  // newPrice = 23546.22
  public async postPrice(
    newPrice: number,
    authorityPublisher: PublicKey
  ): Promise<TransactionBuilder> {
    const priceInFormat = ProductClient.convertToPriceFormat(newPrice, this.productData.expo);

    const priceKey = this.pda.price(this.productKey);
    const publisherKey = this.pda.publisher(authorityPublisher, this.productKey);

    const tx = (
      await this.ctx.methods.postPrice({
        accounts: {
          authority: authorityPublisher,
          product: this.productKey,
          price: priceKey.key,
          publisher: publisherKey.key,
        },
        inputs: {
          price: priceInFormat.price,
        },
      })
    ).toTx();

    return tx;
  }

  public async getPrice(refresh = false): Promise<PriceResult> {
    if (refresh) {
      await this.refresh();
    }

    let price = this.priceData.price.toNumber();
    const expo = this.productData.expo;

    if (expo < 0) {
      price = price / 10 ** Math.abs(expo);
    }

    if (expo > 0) {
      price = price * 10 ** expo;
    }

    return {
      price,
      symbol: `${this.productData.baseCurrency}/${this.productData.quoteCurrency}`,
      timestamp: this.priceData.timestamp.toNumber(),
      numberPublishers: this.priceData.numPublishers,
    };
  }

  public static convertToPriceFormat(
    number: number,
    desiredExpo: number
  ): { price: BN; expo: number } {
    if (desiredExpo > 0 || desiredExpo < -10) {
      throw new Error("desiredExpo must be in range [-10; 0]");
    }
    const stringValue: string = number.toString();
    const dotIndex: number = stringValue.indexOf(".");

    let price: number;
    let expo: number;

    if (dotIndex !== -1) {
      const integerPart: string = stringValue.substring(0, dotIndex);
      const decimalPart: string = stringValue.substring(dotIndex + 1);
      const currentDecimalLength: number = decimalPart.length;

      const diff = Math.abs(desiredExpo) - currentDecimalLength;
      console.log(diff);
      if (diff > 0) {
        price = parseInt(integerPart + decimalPart + "0".repeat(diff), 10);
      } else if (diff < 0) {
        const roundedDecimalPart = decimalPart.substring(0, Math.abs(desiredExpo));
        price = parseInt(integerPart + roundedDecimalPart, 10);
      } else {
        price = parseInt(integerPart + decimalPart, 10);
      }

      expo = desiredExpo;
    } else {
      price = number * Math.pow(10, Math.abs(desiredExpo));
      expo = desiredExpo;
    }

    return { price: new BN(price), expo };
  }
  public async refresh(): Promise<ProductClient> {
    const productData = await this.ctx.fetcher.getProduct(this.productKey, true);
    if (!productData) {
      throw new Error(
        `Product of ${this.productData.baseCurrency}/${this.productData.quoteCurrency} not found`
      );
    }
    this.productData = productData;

    const priceData = await this.ctx.fetcher.getPrice(productData.priceAccount, true);
    if (!priceData) {
      throw new Error(
        `Price of ${this.productData.baseCurrency}/${this.productData.quoteCurrency} not found`
      );
    }
    this.priceData = priceData;

    return this;
  }
}
