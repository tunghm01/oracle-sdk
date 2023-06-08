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

const commitment: Commitment = "confirmed";
const connection = new Connection(consts.RPC_ENDPOINT_URL, { commitment });
const wallet = new Wallet(your_keypair);
const provider = new AnchorProvider(connection, wallet, { commitment });

const ctx = Context.withProvider(provider, new PublicKey(ORACLE_PROGRAM_ID_TESTNET));


const quote = "USD";
const base = "VND";
const newPrice = 24500.35;

const productClient = await ProductClient.getProduct(ctx, quote, base);
const tx = await productClient.postPrice(
    newPrice,
    authorityPublisher.publicKey
);

await tx.addSigner(authorityPublisher).buildAndExecute();
await productClient.refresh();

const price = await productClient.getPrice();
console.log("price", price);
```

+ Output
```
```