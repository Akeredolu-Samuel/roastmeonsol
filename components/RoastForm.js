"use client";

import { useState } from "react";
import { isValidSolanaAddress } from "@/lib/address";
import BoxFrame from "@/components/BoxFrame";
import { Flame, LoaderCircle } from "@/components/icons";

export default function RoastForm({ onSubmit, loading }) {
  const [wallet, setWallet] = useState("");
  const [hint, setHint] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const value = wallet.trim();
    if (!isValidSolanaAddress(value)) {
      setHint("Paste a real Solana address.");
      return;
    }
    setHint("");
    onSubmit(value);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl">
      <label htmlFor="wallet" className="sr-only">
        Solana wallet address
      </label>
      <BoxFrame className="bg-rm-card/80 focus-within:border-rm-accent">
        <input
          id="wallet"
          name="wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Paste Solana wallet address"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent px-4 py-4 font-mono text-[13px] text-rm-text outline-none placeholder:text-rm-faint sm:px-5 sm:text-[15px]"
        />
      </BoxFrame>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-rm-accent px-5 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle size={15} className="animate-spin" />
        ) : (
          <Flame size={15} strokeWidth={1.75} />
        )}
        {loading ? "Roasting…" : "Roast my wallet"}
      </button>
      {hint ? (
        <p className="mt-3 text-center font-mono text-[11px] text-rm-accent">{hint}</p>
      ) : (
        <p className="mt-3 text-center font-mono text-[11px] text-rm-faint">
          Nothing is saved. We read the chain, roast you, forget you.
        </p>
      )}
    </form>
  );
}
