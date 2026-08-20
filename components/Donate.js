"use client";

import { useState } from "react";
import { CREATOR_WALLET } from "@/lib/site";
import { shortenAddress } from "@/lib/address";
import BoxFrame from "@/components/BoxFrame";
import { Copy, ExternalLink } from "lucide-react";

export default function Donate({ compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CREATOR_WALLET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-rm-faint transition hover:text-rm-yellow"
      >
        {copied ? "copied" : "donate"}
      </button>
    );
  }

  return (
    <BoxFrame accent dashed className="bg-rm-bg/80 px-5 py-6 sm:px-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rm-faint">
        Donate to creator
      </p>
      <p className="mt-2 font-display text-[clamp(1.8rem,5vw,3.2rem)] leading-none">
        FUEL THE ROAST
      </p>
      <p className="mt-3 max-w-lg text-sm text-rm-muted">
        If the card made you laugh, send SOL. Nothing else is saved — including this.
      </p>
      <p className="mt-4 break-all font-mono text-[12px] text-rm-text sm:text-[13px]">
        {CREATOR_WALLET}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 bg-rm-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
        >
          <Copy size={13} strokeWidth={1.5} />
          {copied ? "Copied" : `Copy ${shortenAddress(CREATOR_WALLET, 4, 4)}`}
        </button>
        <a
          href={`solana:${CREATOR_WALLET}`}
          className="inline-flex items-center gap-2 border border-rm-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-rm-muted transition hover:text-rm-text"
        >
          <ExternalLink size={13} strokeWidth={1.5} />
          Open wallet
        </a>
      </div>
    </BoxFrame>
  );
}
