import { NextResponse } from "next/server";
import { getTransactionHistory, StellarDataError } from "@stellarscope/stellar-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10;
    const order = (searchParams.get("order") as "asc" | "desc") ?? "desc";
    const cursor = searchParams.get("cursor") ?? undefined;

    const result = await getTransactionHistory(id, { limit, order, cursor });
    return NextResponse.json(result);
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
