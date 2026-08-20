/** Known Solana blue chips — never counted as memes. */
export const BLUECHIP_MINTS = new Set([
  "So11111111111111111111111111111111111111112", // wSOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "USDSwr9ApdHk5kv7J9Ntj6Yy9o4sGqfZHTbBTxWbitw", // USDS
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo", // PYUSD
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", // jitoSOL
  "bSo13r4TkiE4KumL71LsHTPpL2euWALHaKGo9gUuWEf", // bSOL
  "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v", // jupSOL
  "infNXi6QzrYRumUcgpyPJTzXkqHZjzS2AZr1JYCkx2d", // infSOL
  "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", // HNT
  "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33Wc4Vhs", // JUP (old)
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", // JUP
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // RAY
  "HZ1JovNiVvGRTq37Mx6w2iDiK3xTJcHrtK7SWaTm6z8", // PYTH
  "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", // RENDER
]);

export const BLUECHIP_SYMBOLS = new Set([
  "SOL",
  "WSOL",
  "USDC",
  "USDT",
  "USDS",
  "USD1",
  "FDUSD",
  "PYUSD",
  "MSOL",
  "JITOSOL",
  "BSOL",
  "JUPSOL",
  "INFSOL",
  "HNT",
  "JUP",
  "RAY",
  "ORCA",
  "PYTH",
  "RENDER",
  "JTO",
  "W",
  "WBTC",
  "WETH",
]);

/** Explicit memes we want to name on the card. */
export const TOKEN_SYMBOLS = {
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "BONK",
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: "WIF",
  "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr": "POPCAT",
  MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5: "MEW",
  "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump": "PNUT",
  "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN": "TRUMP",
  "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump": "FARTCOIN",
  ukHH6c7mMyiWCf1b9pnWe25TTbRx1VdB6S7BhtPhun: "BOME",
  "7BgBvyjrZX3YdY9xCAyP1nHvNDuEHqwHBlk9NBeYAvpH": "SLERF",
  ED5nyyWEzpPPiWimP8vYmMsayKYwDW6gAOPr7u4H5UXW: "MOODENG",
  "85VBFQZC9TZkfaptBWjvUw7CbFUi53z1bcKbs8wt5VW5": "W",
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC",
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT",
  So11111111111111111111111111111111111111112: "SOL",
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: "JUP",
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: "mSOL",
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: "jitoSOL",
};

export const KNOWN_MEME_MINTS = new Set([
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
  "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
  "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
  "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
  "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
  "ukHH6c7mMyiWCf1b9pnWe25TTbRx1VdB6S7BhtPhun",
  "7BgBvyjrZX3YdY9xCAyP1nHvNDuEHqwHBlk9NBeYAvpH",
  "ED5nyyWEzpPPiWimP8vYmMsayKYwDW6gAOPr7u4H5UXW",
]);

export function symbolForMint(mint) {
  if (!mint) return "UNK";
  return TOKEN_SYMBOLS[mint] || mint.slice(0, 4).toUpperCase();
}

export function isBluechipMint(mint) {
  return BLUECHIP_MINTS.has(mint);
}

export function isMemeMint(mint, symbol) {
  if (!mint) return false;
  if (BLUECHIP_MINTS.has(mint)) return false;
  if (KNOWN_MEME_MINTS.has(mint)) return true;
  if (typeof mint === "string" && mint.endsWith("pump")) return true;
  const sym = (symbol || "").toUpperCase();
  if (sym && BLUECHIP_SYMBOLS.has(sym)) return false;
  return Boolean(sym);
}
