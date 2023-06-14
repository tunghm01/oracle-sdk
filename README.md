# oracle-sdk

## How to use
```javascript
import {
  PublicKey,
  Connection,
  Keypair,
  Commitment,
} from "@solana/web3.js";
import { AnchorProvider, Wallet, BN, Address } from "@project-serum/anchor";
import { Context, ProductClient, ORACLE_PROGRAM_ID_TESTNET } from "@renec-foundation/oracle-sdk";


...

// yourKey = Keypair.fromSecretKey(Uint8Array.from([124, 149, 222, 31, 236, 142, 29, 95...]));

const commitment: Commitment = "confirmed";
const connection = new Connection(consts.RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(yourKey);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, new PublicKey(ORACLE_PROGRAM_ID_TESTNET));


const quote = REUSD_TESTNET;
const base = REVND_TESTNET;
const newPrice = 24500.35;

const productClient = await ProductClient.getProduct(ctx, quote, base);
const tx = await productClient.postPrice(
    newPrice,
    productClient.ctx.wallet.publicKey
);

await tx.buildAndExecute();
await productClient.refresh();

const price = await productClient.getPrice();
console.log("price", price);
```

+ Output
```json
price {
  "price": 25000,
  "symbol": "VND/USD",
  "timestamp": 1686731721,
  "numberPublishers": 1
}
```