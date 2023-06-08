import { AccountsCoder } from "@project-serum/anchor";
import { accountsCoder, ProductData, PriceData, PublisherData, AccountName } from "../types";

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

/**
 * Class decorator to define an interface with static methods
 * Reference: https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-295685298
 */
function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

function parseAnchorAccount(accountName: AccountName, data: Buffer) {
  const discriminator = AccountsCoder.accountDiscriminator(accountName);
  if (discriminator.compare(data.slice(0, 8))) {
    console.error("incorrect account name during parsing");
    return null;
  }

  try {
    return accountsCoder.decode(accountName, data);
  } catch (_e) {
    console.error("unknown account name during parsing");
    return null;
  }
}

// YOUR ACCOUNTS
@staticImplements<ParsableEntity<ProductData>>()
export class ParsableProduct {
  private constructor() {}

  public static parse(data: Buffer | undefined | null): ProductData | null {
    if (!data) {
      return null;
    }

    try {
      return parseAnchorAccount(AccountName.Product, data);
    } catch (e) {
      console.error(`error while parsing Product: ${e}`);
      return null;
    }
  }
}

@staticImplements<ParsableEntity<PriceData>>()
export class ParsablePrice {
  private constructor() {}

  public static parse(data: Buffer | undefined | null): PriceData | null {
    if (!data) {
      return null;
    }

    try {
      return parseAnchorAccount(AccountName.Price, data);
    } catch (e) {
      console.error(`error while parsing Price: ${e}`);
      return null;
    }
  }
}

@staticImplements<ParsableEntity<PublisherData>>()
export class ParsablePublisher {
  private constructor() {}

  public static parse(data: Buffer | undefined | null): PublisherData | null {
    if (!data) {
      return null;
    }

    try {
      return parseAnchorAccount(AccountName.Publisher, data);
    } catch (e) {
      console.error(`error while parsing Publisher: ${e}`);
      return null;
    }
  }
}
