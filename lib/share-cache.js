const g = globalThis;
if (!g.__roastmeShare) g.__roastmeShare = new Map();

const TTL_MS = 1000 * 60 * 60 * 24;
const MAX = 200;

function prune(store) {
  const now = Date.now();
  for (const [id, row] of store) {
    if (now - row.at > TTL_MS) store.delete(id);
  }
  if (store.size <= MAX) return;
  const extra = store.size - MAX;
  const keys = store.keys();
  for (let i = 0; i < extra; i += 1) {
    const k = keys.next().value;
    if (k) store.delete(k);
  }
}

export function putShare({ roast, png }) {
  const store = g.__roastmeShare;
  prune(store);
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  store.set(id, { roast, png, at: Date.now() });
  return id;
}

export function getShare(id) {
  if (!id) return null;
  const row = g.__roastmeShare.get(id);
  if (!row) return null;
  if (Date.now() - row.at > TTL_MS) {
    g.__roastmeShare.delete(id);
    return null;
  }
  return row;
}
