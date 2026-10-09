import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { item_type, target, label } = (await request.json()) as {
      item_type: "account" | "asset";
      target: string;
      label?: string;
    };

    if (!item_type || !target) {
      return NextResponse.json(
        { error: "item_type and target are required" },
        { status: 400 }
      );
    }

    const { data: watchlist } = await supabase
      .from("watchlists")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!watchlist) {
      return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("watchlist_items")
      .insert({
        watchlist_id: id,
        item_type,
        target,
        label: label ?? null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}