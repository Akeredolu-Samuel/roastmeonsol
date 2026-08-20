import { NextResponse } from "next/server";
import { putShare } from "@/lib/share-cache";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  const roast = body?.roast;
  const image = typeof body?.image === "string" ? body.image : "";
  if (!roast || !roast.title || !image.startsWith("data:image/png")) {
    return NextResponse.json({ error: "Need roast + png." }, { status: 400 });
  }

  const comma = image.indexOf(",");
  const b64 = comma >= 0 ? image.slice(comma + 1) : "";
  let png;
  try {
    png = Buffer.from(b64, "base64");
  } catch {
    return NextResponse.json({ error: "Bad png." }, { status: 400 });
  }
  if (!png.length || png.length > 4_500_000) {
    return NextResponse.json({ error: "Image too large." }, { status: 413 });
  }

  const id = putShare({ roast, png });
  return NextResponse.json({ id, path: `/r/${id}` });
}
