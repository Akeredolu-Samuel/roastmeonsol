import { NextResponse } from "next/server";
import { getShare } from "@/lib/share-cache";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  const row = getShare(id);
  if (!row?.png) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(row.png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}
