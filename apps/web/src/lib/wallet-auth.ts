import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Account,
  BASE_FEE,
  Transaction,
} from "@stellar/stellar-sdk";

const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE ?? Networks.TESTNET;

function getAuthSigner(): Keypair {
  const seed = process.env.AUTH_SIGNER_SEED;
  if (seed) {
    return Keypair.fromRawEd25519Seed(Buffer.from(seed, "base64").slice(0, 32));
  }
  return Keypair.random();
}

const AUTH_SIGNER = getAuthSigner();

export function generateChallenge(clientAccountId: string): string {
  const account = new Account(AUTH_SIGNER.publicKey(), "0");

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.manageData({
        source: clientAccountId,
        name: "StellarScope Auth",
        value: new Date().toISOString(),
      })
    )
    .setTimeout(300)
    .build();

  tx.sign(AUTH_SIGNER);
  return tx.toXDR();
}

export function verifyChallenge(
  signedXdr: string,
  clientAccountId: string
): boolean {
  try {
    const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE) as Transaction;

    if (tx.source !== clientAccountId) {
      return false;
    }

    const signatures = tx.signatures;
    if (signatures.length === 0) {
      return false;
    }

    const clientKeypair = Keypair.fromPublicKey(clientAccountId);
    const txHash = tx.hash();

    return signatures.some((sig) => {
      try {
        return clientKeypair.verify(txHash, sig.signature as unknown as Buffer);
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

export function getAuthSignerPublicKey(): string {
  return AUTH_SIGNER.publicKey();
}