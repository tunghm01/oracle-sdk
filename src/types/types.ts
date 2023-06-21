import { BN, AccountsCoder, Idl } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Oracle } from "../artifacts/oracle";
import IDL from "../artifacts/oracle.json";

export type OracleType = Oracle;
export const OracleIDL = IDL as Idl;
export const accountsCoder = new AccountsCoder(OracleIDL);

export enum AccountName {
  Controller = "Controller",
  Product = "Product",
  Price = "Price",
  Publisher = "Publisher",
}

export const AssetType = {
  Forex: { forex: {} },
  Crypto: { crypto: {} },
};

export const ProductStatus = {
  Unknown: { unknown: {} },
  Offline: { offline: {} },
  Online: { online: {} },
};

export const PublisherStatus = {
  Unknown: { unknown: {} },
  Valid: { valid: {} },
};

export type PriceResult = {
  price: number;
  symbol: string;
  numberPublishers: number;
  timestamp: number;
};

export type ProductData = {
  version: number;
  status: object; // ProductStatus
  assetType: object; // AssetType
  quoteCurrency: String;
  quoteMint: PublicKey;
  baseCurrency: String;
  baseMint: PublicKey;
  priceAccount: PublicKey;
  expo: number;
  maxPrice: BN;
  minPrice: BN;
  windowSize: BN;
  controller: PublicKey;
  bump: number[];
};

export type PriceData = {
  version: number;
  status: object; // PriceStatus
  productAccount: PublicKey;
  price: BN;
  numPublishers: number;
  timestamp: BN;
  prevPrice: BN;
  prevTimestamp: BN;
  bump: number[];
};

export type PublisherData = {
  status: object; // PublisherStatus
  authority: PublicKey;
  product: PublicKey;
  controller: PublicKey;
  lastPushTimestamp: BN;
  bump: number[];
};
