const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isValidSolanaAddress(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!BASE58_RE.test(trimmed)) return false;
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  return true;
}

export function shortenAddress(address, left = 4, right = 4) {
  if (!address || address.length <= left + right + 1) return address || "";
  return `${address.slice(0, left)}…${address.slice(-right)}`;
}
