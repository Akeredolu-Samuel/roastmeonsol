"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Preloader from "@/components/Preloader";
import ScrollFlipStage from "@/components/ScrollFlipStage";
import DraggableWordmark from "@/components/DraggableWordmark";
import RoastForm from "@/components/RoastForm";
import RoastOverlay from "@/components/RoastOverlay";
import RoastCard from "@/components/RoastCard";
import Donate from "@/components/Donate";
import BoxFrame from "@/components/BoxFrame";
import { Reveal, fadeUp, staggerParent } from "@/components/motion";

const SAMPLE = {
  wallet: "7fKs…pL2m",
  score: 81,
  title: "CERTIFIED DEGEN",
  icon: "exit",
  personality: "Professional Exit Liquidity",
  roast: "You don't buy the dip. You ARE the dip.",
  verdict: "Your portfolio isn't diversified. It's just diversified ways to lose money.",
  stats: {
    txCount: 184,
    tokensTouched: 27,
    memeCoins: 13,
    biggestTxSol: 2.4,
    bestMonth: "Jan '25",
    failedTx: 11,
    swaps: 90,
    solBalance: 0.08,
    feesSol: 0.41,
  },
};

export default function Home() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roast, setRoast] = useState(null);

  async function roastWallet(wallet) {
    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Roast failed.");
        setRoast(null);
        return;
      }
      setRoast(json);
    } catch {
      setError("Network died mid-roast. Try again.");
      setRoast(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Preloader label="roastmeonsol" />
      <div className="grain" />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-rm-muted">
          roastmeonsol
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-rm-faint sm:inline">
            nothing saved
          </span>
          <Donate compact />
        </div>
      </header>

      <ScrollFlipStage scrollLength="200vh">
        <section className="dots flex min-h-[100svh] flex-col items-center justify-center px-4 pb-20 pt-24">
          <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.34em] text-rm-faint sm:text-[11px]">
            Reading the chain&nbsp;&nbsp;·&nbsp;&nbsp;block by block.
          </p>
          <span className="mb-8 rounded-sm bg-rm-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black">
            roastmeonsol
          </span>
          <DraggableWordmark top="GET" bottom="ROASTED" hint="Drag to move" />
          <p className="mt-10 max-w-md text-center text-[17px] text-rm-muted">
            Find out how badly you degen.
          </p>
          <div className="mt-10 w-full">
            <RoastForm onSubmit={roastWallet} loading={loading} />
          </div>
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.32em] text-rm-faint">
            Scroll
          </p>
        </section>
      </ScrollFlipStage>

      <section className="dots relative z-10 px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rm-faint">
              How it works
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.9]">
              WE READ THE LEDGER.
              <br />
              THEN WE TALK.
            </h2>
          </Reveal>

          <motion.ol
            className="mt-10 grid gap-5 sm:grid-cols-3"
            variants={staggerParent(reduce)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          >
            {[
              { n: "01", t: "Paste wallet", d: "No connect. No sign. Address only." },
              { n: "02", t: "Scan the chain", d: "Helius pulls txs, tokens, memes, fees." },
              { n: "03", t: "Get executed", d: "AI writes the roast. You post it on X." },
            ].map((step) => (
              <motion.li key={step.n} variants={fadeUp(reduce)}>
                <BoxFrame className="h-full bg-rm-card/80 p-5">
                  <p className="font-mono text-[10px] tracking-[0.24em] text-rm-accent">{step.n}</p>
                  <p className="mt-3 text-lg tracking-tight">{step.t}</p>
                  <p className="mt-2 text-sm text-rm-muted">{step.d}</p>
                </BoxFrame>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="dots relative z-10 px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rm-faint">
              The card people post
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9]">
              SHAREABLE BY DESIGN
            </h2>
            <p className="mt-4 max-w-lg text-rm-muted">
              Landscape for X. Boxy frames. Color only when it hurts. Watermarked roastmeonsol.
            </p>
          </Reveal>
          <div className="mt-8">
            <RoastCard roast={SAMPLE} example />
          </div>
        </div>
      </section>

      {roast ? (
        <section id="your-roast" className="dots relative z-10 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-rm-faint">
                Your roast
              </p>
            </Reveal>
            <RoastCard roast={roast} />
          </div>
        </section>
      ) : null}

      <section className="dots relative z-10 px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Donate />
          </Reveal>
        </div>
      </section>

      <footer className="dots border-t border-rm-border px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-rm-faint">
            roastmeonsol
          </p>
          <p className="text-sm text-rm-muted">
            Stats from public Solana data. Nothing stored.
          </p>
        </div>
      </footer>

      <RoastOverlay
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        error={error}
        roast={roast}
      />
    </>
  );
}
