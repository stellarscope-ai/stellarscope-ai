import { NextResponse } from "next/server";
import { getAccount, StellarDataError } from "@stellarscope/stellar-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = await getAccount(id);
    return NextResponse.json(account);
  } catch (err) {
    if (err instanceof StellarDataError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
