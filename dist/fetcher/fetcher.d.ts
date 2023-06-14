import { Connection } from "@solana/web3.js";
import { Address } from "@project-serum/anchor";
import { ProductData, PriceData, PublisherData } from "../";
import { ParsableEntity, ParsableProduct, ParsablePrice, ParsablePublisher } from "./parsing";
/**
 * Supported accounts
 */
type CachedValue = ParsableProduct | ParsablePrice | ParsablePublisher;
/**
 * Include both the entity (i.e. type) of the stored value, and the value itself
 */
interface CachedContent<T extends CachedValue> {
    entity: ParsableEntity<T>;
    value: CachedValue | null;
}
export declare class AccountFetcher {
    private readonly connection;
    private readonly _cache;
    private _tokenAccountRentExempt;
    constructor(connection: Connection, cache?: Record<string, CachedContent<CachedValue>>);
    /*** Public Methods ***/
    /**
     * Retrieve minimum balance for rent exemption of a Token Account;
     *
     * @param refresh force refresh of account rent exemption
     * @returns minimum balance for rent exemption
     */
    getTokenAccountRentExempt(refresh?: boolean): Promise<number>;
    /**
     * Update the cached value of all entities currently in the cache.
     * Uses batched rpc request for network efficient fetch.
     */
    refreshAll(): Promise<void>;
    /*** Private Methods ***/
    /**
     * Retrieve from cache or fetch from rpc, an account
     */
    private get;
    /**
     * Retrieve from cache or fetch from rpc, a list of accounts
     */
    private list;
    /**
     * Make batch rpc request
     */
    private bulkRequest;
    getProduct(address: Address, refresh?: boolean): Promise<ProductData | null>;
    getPrice(address: Address, refresh?: boolean): Promise<PriceData | null>;
    getPublisher(address: Address, refresh?: boolean): Promise<PublisherData | null>;
}
export {};
