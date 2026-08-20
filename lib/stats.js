import { isBluechipMint, isMemeMint, symbolForMint } from "./tokens";

const LAMPORTS = 1e9;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMonth(year, monthIndex) {
  return `${MONTHS[monthIndex]} '${String(year).slice(-2)}`;
}

function bestMonthFromTimestamps(timestamps) {
  if (!timestamps.length) return { label: "—", txs: 0 };
  const buckets = new Map();
  for (const t of timestamps) {
    const d = new Date(t * 1000);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  let topKey = null;
  let topCount = 0;
  for (const [key, count] of buckets.entries()) {
    if (count > topCount) {
      topKey = key;
      topCount = count;
    }
  }
  const [year, month] = topKey.split("-").map(Number);
  return { label: formatMonth(year, month), txs: topCount };
}

export function computeStats({ address, signatures, transactions, tokens, solBalance }) {
  const txCount = signatures.length || transactions.length;
  const failedTx = signatures.filter((s) => s && s.err).length;

  const mintHits = new Map();
  const memeMints = new Set();
  let swaps = 0;
  let nftHits = 0;
  let biggestLamports = 0;
  let feesLamports = 0;
  const nativeSizes = [];
  const typeCounts = {};
  const descriptions = [];

  for (const tx of transactions) {
    const type = (tx.type || "UNKNOWN").toUpperCase();
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    if (type.includes("SWAP")) swaps += 1;
    if (type.includes("NFT")) nftHits += 1;
    feesLamports += num(tx.fee);

    if (tx.description && descriptions.length < 12) {
      descriptions.push(tx.description);
    }

    for (const transfer of tx.nativeTransfers || []) {
      const amount = num(transfer.amount);
      if (
        transfer.fromUserAccount === address ||
        transfer.toUserAccount === address
      ) {
        nativeSizes.push(amount);
        if (amount > biggestLamports) biggestLamports = amount;
      }
    }

    for (const transfer of tx.tokenTransfers || []) {
      const mint = transfer.mint;
      if (!mint || isBluechipMint(mint)) continue;
      mintHits.set(mint, (mintHits.get(mint) || 0) + 1);
      if (isMemeMint(mint, symbolForMint(mint)) || type.includes("SWAP")) {
        if (!isBluechipMint(mint)) memeMints.add(mint);
      }
    }
  }

  for (const token of tokens || []) {
    const mint = token.mint;
    if (!mint || isBluechipMint(mint)) continue;
    if (!mintHits.has(mint)) mintHits.set(mint, 1);
    if (isMemeMint(mint, token.symbol || symbolForMint(mint))) memeMints.add(mint);
  }

  const timestamps = signatures
    .map((s) => s.blockTime)
    .filter((t) => typeof t === "number" && t > 0)
    .sort((a, b) => a - b);

  let avgHoursBetween = null;
  let ageDays = null;
  if (timestamps.length >= 2) {
    const span = timestamps[timestamps.length - 1] - timestamps[0];
    ageDays = Math.max(1, span / 86400);
    avgHoursBetween = span / Math.max(1, timestamps.length - 1) / 3600;
  } else if (timestamps.length === 1) {
    ageDays = Math.max(1, (Date.now() / 1000 - timestamps[0]) / 86400);
  }

  const tokensTouched = mintHits.size;
  const memeCoins = memeMints.size;
  const failedRatio = txCount ? failedTx / txCount : 0;
  const swapRatio = transactions.length ? swaps / transactions.length : 0;
  const memeRatio = tokensTouched ? memeCoins / tokensTouched : 0;
  const txsPerDay = ageDays ? txCount / ageDays : txCount;
  const biggestSol = biggestLamports / LAMPORTS;
  const dustRatio = nativeSizes.length
    ? nativeSizes.filter((a) => a < 0.05 * LAMPORTS).length / nativeSizes.length
    : 0;
  const bestMonth = bestMonthFromTimestamps(timestamps);

  const score = scoreDegen({
    txCount,
    failedRatio,
    swapRatio,
    memeRatio,
    tokensTouched,
    txsPerDay,
    solBalance,
    biggestSol,
    nftHits,
    dustRatio,
    ageDays,
    sampledCapped: signatures.length >= 1000,
  });

  const personality = pickPersonality({
    txCount,
    failedRatio,
    swapRatio,
    memeRatio,
    tokensTouched,
    txsPerDay,
    nftHits,
    solBalance,
    memeCoins,
    biggestSol,
    dustRatio,
  });

  return {
    txCount,
    tokensTouched,
    memeCoins,
    biggestTxSol: round(biggestSol, 3),
    bestMonth: bestMonth.label,
    bestMonthTxs: bestMonth.txs,
    failedTx,
    swaps,
    nftHits,
    solBalance: round(solBalance, 4),
    feesSol: round(feesLamports / LAMPORTS, 4),
    ageDays: ageDays ? Math.round(ageDays) : null,
    txsPerDay: round(txsPerDay, 2),
    avgHoursBetween: avgHoursBetween ? round(avgHoursBetween, 2) : null,
    dustRatio: round(dustRatio, 2),
    sampledEnhanced: transactions.length,
    sampledSignatures: signatures.length,
    typeCounts,
    descriptions,
    score,
    personality,
  };
}

function logScale(value, maxAt, points) {
  const v = Math.max(0, value);
  const cap = Math.max(1, maxAt);
  return (Math.log10(v + 1) / Math.log10(cap + 1)) * points;
}

function scoreDegen(s) {
  // Volume is log-scaled so a 1000-tx sample cap cannot auto-max the score.
  const volume = clamp(logScale(s.txCount, 800, 14), 0, 14);
  const memes = clamp(s.memeRatio * 20, 0, 20);
  const zoo = clamp(s.tokensTouched / 5, 0, 10);

  let dust = 0;
  if (s.dustRatio > 0.7 && s.txCount > 40) dust = 16;
  else if (s.biggestSol > 0 && s.biggestSol < 0.15 && s.txCount > 40) dust = 14;
  else if (s.biggestSol < 0.5 && s.txCount > 30) dust = 10;
  else if (s.biggestSol < 1 && s.txCount > 50) dust = 6;
  else if (s.biggestSol > 40) dust = 1;

  const fails = clamp(s.failedRatio * 36, 0, 10);
  const cadence = clamp(logScale(s.txsPerDay, 12, 10), 0, 10);

  let rekt = 0;
  if (s.solBalance < 0.01 && s.txCount > 40) rekt = 10;
  else if (s.solBalance < 0.2 && s.txCount > 20) rekt = 6;
  else if (s.solBalance < 1 && s.txCount > 80) rekt = 3;

  const swaps = clamp(s.swapRatio * 12, 0, 8);
  const jpegs = s.nftHits > 10 ? 4 : s.nftHits > 4 ? 2 : 0;

  let score = 8 + volume + memes + zoo + dust + fails + cadence + rekt + swaps + jpegs;

  // Hitting the RPC sample ceiling is not extra degen by itself.
  if (s.sampledCapped) score -= 3;
  if (s.txCount < 4) score = Math.min(score, 18);
  if (s.txCount < 12 && s.memeCoins < 3) score = Math.min(score, 32);

  return Math.round(clamp(score, 4, 98));
}

function pickPersonality(s) {
  if (s.txCount < 4) {
    return { icon: "spectator", name: "The Tourist", title: "CERTIFIED SPECTATOR" };
  }
  if ((s.dustRatio > 0.55 || s.biggestSol < 0.6) && s.txCount > 80) {
    return { icon: "dust", name: "Dust Swap Addict", title: "CERTIFIED EXIT LIQUIDITY" };
  }
  if (s.memeRatio > 0.62 && s.tokensTouched >= 6) {
    return { icon: "exit", name: "Professional Exit Liquidity", title: "CERTIFIED EXIT LIQUIDITY" };
  }
  if (s.swapRatio > 0.45 && s.txsPerDay > 3) {
    return { icon: "fomo", name: "The FOMO Merchant", title: "CERTIFIED DEGEN" };
  }
  if (s.failedRatio > 0.18) {
    return { icon: "gas", name: "Priority Fee Donor", title: "CERTIFIED GAS STATION" };
  }
  if (s.nftHits > 10) {
    return { icon: "collector", name: "JPEG Bagholder", title: "CERTIFIED COLLECTOR" };
  }
  if (s.solBalance < 0.05 && s.txCount > 30) {
    return { icon: "rekt", name: "Rekt Historian", title: "CERTIFIED EMPTY BAG" };
  }
  if (s.txsPerDay > 8) {
    return { icon: "addict", name: "Terminally Online", title: "CERTIFIED ADDICT" };
  }
  if (s.memeCoins >= 3 && s.txCount < 25) {
    return { icon: "ape", name: "One-Shot Ape", title: "CERTIFIED APE" };
  }
  if (s.tokensTouched > 20) {
    return { icon: "lab", name: "The Lab Rat", title: "CERTIFIED DEGEN" };
  }
  return { icon: "weekend", name: "Weekend Degen", title: "CERTIFIED DEGEN" };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function round(n, d) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
