import { NextResponse } from "next/server";
import { verifyChallenge } from "@/lib/wallet-auth";
import { createServerClient } from "@/lib/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET ?? "your-super-secret-jwt-token-with-at-least-32-characters-long";

export async function POST(request: Request) {
  try {
    const { accountId, signedXdr } = (await request.json()) as {
      accountId: string;
      signedXdr: string;
    };

    if (!accountId || !signedXdr) {
      return NextResponse.json(
        { error: "accountId and signedXdr are required" },
        { status: 400 }
      );
    }

    const isValid = verifyChallenge(signedXdr, accountId);
    if (!isValid) {
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("display_name", accountId)
      .single();

    let userId: string;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          display_name: accountId,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      userId = newProfile.id;
    }

    const token = jwt.sign(
      {
        sub: userId,
        aud: "authenticated",
        role: "authenticated",
        wallet_address: accountId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    return NextResponse.json({
      token,
      user: {
        id: userId,
        walletAddress: accountId,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}