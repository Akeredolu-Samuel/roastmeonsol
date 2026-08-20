import { NextResponse } from "next/server";
import { isValidSolanaAddress, shortenAddress } from "@/lib/address";
import { fetchWalletData } from "@/lib/helius";
import { computeStats } from "@/lib/stats";
import { generateRoast } from "@/lib/gemini";
import { fallbackRoast } from "@/lib/fallback";

export const runtime = "nodejs";
export const maxDuration = 60;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map();

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

export async function POST(request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Slow down — even your bags need a minute." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a wallet address." }, { status: 400 });
  }

  const address = typeof body?.wallet === "string" ? body.wallet.trim() : "";
  if (!isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: "That is not a Solana address. Paste a real one." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const kill = setTimeout(() => controller.abort(), 45_000);

  try {
    const data = await fetchWalletData(address, { signal: controller.signal });
    const stats = computeStats({ address, ...data });
    let copy;
    try {
      copy = await generateRoast({
        wallet: address,
        stats,
        signal: controller.signal,
      });
    } catch {
      copy = fallbackRoast(stats);
    }

    return NextResponse.json({
      wallet: shortenAddress(address),
      walletFull: address,
      score: stats.score,
      title: copy.title,
      icon: copy.icon || stats.personality.icon || "degen",
      personality: copy.personality,
      roast: copy.roast,
      verdict: copy.verdict,
      stats: {
        txCount: stats.txCount,
        tokensTouched: stats.tokensTouched,
        memeCoins: stats.memeCoins,
        biggestTxSol: stats.biggestTxSol,
        bestMonth: stats.bestMonth,
        bestMonthTxs: stats.bestMonthTxs,
        failedTx: stats.failedTx,
        swaps: stats.swaps,
        solBalance: stats.solBalance,
        feesSol: stats.feesSol,
      },
      saved: false,
    });
  } catch (err) {
    const message =
      err?.name === "AbortError"
        ? "The chain took too long. Try again."
        : err?.message || "Roast failed. The bags live to see another day.";
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(kill);
  }
}
