/// <reference types="node" />
import { ProductData, PriceData, PublisherData } from "../types";
/**
 * Static abstract class definition to parse entities.
 * @category Parsables
 */
export interface ParsableEntity<T> {
    /**
     * Parse account data
     *
     * @param accountData Buffer data for the entity
     * @returns Parsed entity
     */
    parse: (accountData: Buffer | undefined | null) => T | null;
}
export declare class ParsableProduct {
    private constructor();
    static parse(data: Buffer | undefined | null): ProductData | null;
}
export declare class ParsablePrice {
    private constructor();
    static parse(data: Buffer | undefined | null): PriceData | null;
}
export declare class ParsablePublisher {
    private constructor();
    static parse(data: Buffer | undefined | null): PublisherData | null;
}
