import { NextResponse } from "next/server";
import { generateChallenge } from "@/lib/wallet-auth";

export async function POST(request: Request) {
  try {
    const { accountId } = (await request.json()) as { accountId: string };

    if (!accountId || accountId.length !== 56 || !accountId.startsWith("G")) {
      return NextResponse.json(
        { error: "Invalid Stellar account address" },
        { status: 400 }
      );
    }

    const challengeXdr = generateChallenge(accountId);

    return NextResponse.json({
      challenge: challengeXdr,
      networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015",
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}