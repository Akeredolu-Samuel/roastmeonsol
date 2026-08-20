const LAMPORTS = 1e9;

function heliusKey() {
  const key = process.env.HELIUS_API_KEY;
  if (!key) throw new Error("HELIUS_API_KEY is not set");
  return key;
}

function rpcUrl() {
  return `https://mainnet.helius-rpc.com/?api-key=${heliusKey()}`;
}

async function rpc(method, params, { signal } = {}) {
  const res = await fetch(rpcUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "roastmeonsol", method, params }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Helius RPC ${method} failed (${res.status})`);
  }
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message || `Helius RPC ${method} error`);
  }
  return json.result;
}

export async function getSignatures(address, { limit = 1000, signal } = {}) {
  return rpc("getSignaturesForAddress", [address, { limit }], { signal });
}

export async function getBalanceLamports(address, { signal } = {}) {
  const result = await rpc("getBalance", [address], { signal });
  return typeof result === "number" ? result : result?.value ?? 0;
}

/**
 * Enhanced parsed history. Two pages (up to 200 txs) is enough signal
 * for a roast without lighting the rate limit on fire.
 */
export async function getEnhancedTransactions(address, { pages = 2, limit = 100, signal } = {}) {
  const key = heliusKey();
  const all = [];
  let before;

  for (let i = 0; i < pages; i += 1) {
    const url = new URL(`https://api.helius.xyz/v0/addresses/${address}/transactions`);
    url.searchParams.set("api-key", key);
    url.searchParams.set("limit", String(limit));
    if (before) url.searchParams.set("before", before);

    const res = await fetch(url, { signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Helius history failed (${res.status}) ${body.slice(0, 180)}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    before = batch[batch.length - 1]?.signature;
    if (batch.length < limit) break;
  }

  return all;
}

export async function getBalances(address, { signal } = {}) {
  const key = heliusKey();
  const url = `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${key}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return { nativeBalance: 0, tokens: [] };
  const json = await res.json();
  return {
    nativeBalance: json.nativeBalance ?? 0,
    tokens: Array.isArray(json.tokens) ? json.tokens : [],
  };
}

export async function fetchWalletData(address, { signal } = {}) {
  const [signatures, transactions, balances, lamports] = await Promise.all([
    getSignatures(address, { signal }).catch(() => []),
    getEnhancedTransactions(address, { signal }).catch(() => []),
    getBalances(address, { signal }).catch(() => ({ nativeBalance: 0, tokens: [] })),
    getBalanceLamports(address, { signal }).catch(() => 0),
  ]);

  const nativeLamports =
    typeof balances.nativeBalance === "number"
      ? balances.nativeBalance
      : balances.nativeBalance?.lamports || lamports || 0;

  return {
    signatures: Array.isArray(signatures) ? signatures : [],
    transactions: Array.isArray(transactions) ? transactions : [],
    tokens: balances.tokens || [],
    solBalance: nativeLamports / LAMPORTS,
  };
}
