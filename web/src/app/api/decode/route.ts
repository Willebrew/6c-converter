import { NextRequest, NextResponse } from "next/server";
import { decode6ctoc } from "@/lib/decoder";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hex } = body;

    if (!hex || typeof hex !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'hex' field" },
        { status: 400 }
      );
    }

    const result = decode6ctoc(hex);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
