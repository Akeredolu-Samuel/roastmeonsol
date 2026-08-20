"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { TiltCard } from "@/components/motion";
import ShareCard from "@/components/ShareCard";
import BoxFrame from "@/components/BoxFrame";
import { Download, IconXLogo, LoaderCircle, Mark } from "@/components/icons";

function scoreTone(score) {
  if (score >= 70) return "text-rm-accent";
  if (score >= 40) return "text-rm-yellow";
  return "text-rm-text";
}

export default function RoastCard({ roast, example = false }) {
  const shareRef = useRef(null);
  const [busy, setBusy] = useState(false);

  if (!roast) return null;
  const stats = roast.stats || {};

  async function capture() {
    const node = shareRef.current;
    if (!node) return null;
    return toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#080808",
      width: 960,
      height: 540,
    });
  }

  async function download() {
    setBusy(true);
    try {
      const dataUrl = await capture();
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `roastmeonsol-${roast.wallet.replace(/[^\w]/g, "")}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  }

  async function shareOnX() {
    setBusy(true);
    try {
      const dataUrl = await capture();
      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `roastmeonsol-${roast.wallet.replace(/[^\w]/g, "")}.png`, {
        type: "image/png",
      });

      const caption = [
        roast.title,
        `${roast.score}/100 degen · ${roast.personality}`,
        `“${roast.verdict}”`,
      ].join("\n");

      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: roast.title,
          text: `${caption}\nroastmeonsol`,
        });
        return;
      }

      let shareUrl = "";
      try {
        const res = await fetch("/api/share", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ roast, image: dataUrl }),
        });
        const json = await res.json();
        if (res.ok && json.path) shareUrl = `${window.location.origin}${json.path}`;
      } catch {
        shareUrl = "";
      }

      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch {
        // Clipboard image is a bonus; tweet still goes out.
      }

      const tweet = shareUrl ? `${caption}\n${shareUrl}` : `${caption}\nroastmeonsol`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[960px]">
      <TiltCard max={6}>
        <BoxFrame accent dashed className="bg-rm-card/90">
          <article className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
            <div className="flex flex-col justify-between border-b border-dashed border-rm-accent/70 px-6 py-6 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-rm-faint">
                  {example ? "example" : "roastmeonsol"}
                </span>
                <span className="font-mono text-[10px] text-rm-muted md:hidden">{roast.wallet}</span>
              </div>
              <div className="mt-6 md:mt-10">
                <p className={`font-display text-[7rem] leading-none md:text-[8.5rem] ${scoreTone(roast.score)}`}>
                  {roast.score}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-rm-faint">
                  Degen score / 100
                </p>
              </div>
              <p className="mt-6 hidden font-mono text-[11px] text-rm-muted md:block">{roast.wallet}</p>
            </div>

            <div className="flex flex-col px-6 py-6 sm:px-7">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-rm-muted">
                <Mark name={roast.icon} size={14} className="text-rm-accent" />
                {roast.title}
              </p>
              <p className="mt-2 flex items-center gap-2.5 text-xl tracking-tight sm:text-2xl">
                <Mark name={roast.icon} size={20} className="shrink-0 text-rm-yellow" />
                {roast.personality}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                <StatBox n={stats.txCount} l="transactions" />
                <StatBox n={stats.tokensTouched} l="tokens" />
                <StatBox n={stats.memeCoins} l="meme coins" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3">
                <StatBox n={`${stats.biggestTxSol} SOL`} l="biggest tx" />
                <StatBox n={stats.bestMonth || "—"} l="best month" accent />
              </div>

              <div className="mt-5 border-t border-dashed border-rm-border pt-5">
                <p className="text-[1.05rem] leading-snug tracking-tight sm:text-[1.15rem]">{roast.roast}</p>
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-rm-muted">
                  “{roast.verdict}”
                </p>
              </div>

              {example ? (
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-rm-faint">
                  Example card — yours gets Share on X
                </p>
              ) : (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={shareOnX}
                    disabled={busy}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-rm-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition hover:brightness-110 disabled:opacity-60"
                  >
                    {busy ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <IconXLogo size={13} />
                    )}
                    {busy ? "Rendering…" : "Share on X"}
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 border border-rm-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-rm-muted transition hover:text-rm-text disabled:opacity-60"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Save PNG
                  </button>
                </div>
              )}
            </div>
          </article>
        </BoxFrame>
      </TiltCard>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0"
        style={{ left: -2000, opacity: 1 }}
      >
        <ShareCard roast={roast} cardRef={shareRef} />
      </div>
    </div>
  );
}

function StatBox({ n, l, accent = false }) {
  return (
    <BoxFrame className="bg-rm-bg/50 px-2 py-3 sm:px-3">
      <div className={`font-mono text-[14px] leading-none sm:text-[16px] ${accent ? "text-rm-yellow" : "text-rm-text"}`}>
        {n}
      </div>
      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-rm-faint sm:text-[9px]">
        {l}
      </div>
    </BoxFrame>
  );
}
