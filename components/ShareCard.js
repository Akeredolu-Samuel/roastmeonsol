"use client";

import BoxFrame from "@/components/BoxFrame";
import { Mark } from "@/components/icons";

function scoreTone(score) {
  if (score >= 70) return "text-rm-accent";
  if (score >= 40) return "text-rm-yellow";
  return "text-rm-text";
}

export default function ShareCard({ roast, cardRef }) {
  if (!roast) return null;
  const stats = roast.stats || {};

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden bg-rm-bg text-rm-text"
      style={{
        width: 960,
        height: 540,
        backgroundImage:
          "radial-gradient(rgba(245,245,245,0.14) 1px, transparent 1.15px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="absolute inset-5">
        <BoxFrame accent dashed className="flex h-full bg-rm-card/90">
          <div className="grid h-full w-full grid-cols-[280px_1fr]">
            <div className="flex flex-col justify-between border-r border-dashed border-rm-accent/80 px-7 py-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-rm-faint">
                roastmeonsol
              </p>
              <div>
                <p className={`font-display leading-none ${scoreTone(roast.score)}`} style={{ fontSize: 168 }}>
                  {roast.score}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.28em] text-rm-faint">
                  Degen score / 100
                </p>
              </div>
              <p className="font-mono text-[11px] text-rm-muted">{roast.wallet}</p>
            </div>

            <div className="flex flex-col px-8 py-7">
              <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.28em] text-rm-muted">
                <Mark name={roast.icon} size={15} className="text-rm-accent" />
                {roast.title}
              </p>
              <p className="mt-3 flex items-center gap-3 text-[28px] tracking-tight">
                <Mark name={roast.icon} size={26} className="shrink-0 text-rm-yellow" />
                {roast.personality}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <StatBox n={stats.txCount} l="transactions" />
                <StatBox n={stats.tokensTouched} l="tokens" />
                <StatBox n={stats.memeCoins} l="meme coins" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatBox n={`${stats.biggestTxSol} SOL`} l="biggest tx" />
                <StatBox n={stats.bestMonth || "—"} l="best month" accent />
              </div>

              <div className="mt-auto border-t border-dashed border-rm-border pt-5">
                <p className="text-[22px] leading-snug tracking-tight">“{roast.verdict}”</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-rm-faint">
                  roastmeonsol
                </p>
              </div>
            </div>
          </div>
        </BoxFrame>
      </div>
    </div>
  );
}

function StatBox({ n, l, accent = false }) {
  return (
    <BoxFrame className="bg-rm-bg/60 px-3 py-3">
      <div className={`font-mono text-[18px] leading-none ${accent ? "text-rm-yellow" : "text-rm-text"}`}>
        {n}
      </div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-rm-faint">{l}</div>
    </BoxFrame>
  );
}
