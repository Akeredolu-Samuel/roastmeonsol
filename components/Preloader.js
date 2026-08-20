"use client";

import { useEffect, useRef, useState } from "react";

const EXIT_MS = 700;
const EXIT_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";
const HARD_FALLBACK_PAD_MS = 2000;

function easeOutCubic(t) {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return 1 - Math.pow(1 - clamped, 3);
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export default function Preloader({ duration = 1500, onDone, label = "roastmeonsol" }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  const onDoneRef = useRef(onDone);
  const durationRef = useRef(duration);
  const finishedRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
    durationRef.current = duration;
  });

  useEffect(() => {
    let alive = true;
    let rafId = 0;
    let exitTimer = 0;
    let fallbackTimer = 0;
    let exitStarted = false;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const restoreScroll = () => {
      body.style.overflow = previousOverflow;
    };

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      restoreScroll();
      if (alive) {
        setProgress(100);
        setDone(true);
      }
      if (typeof onDoneRef.current === "function") {
        onDoneRef.current();
      }
    };

    if (prefersReducedMotion()) {
      finish();
      return () => {
        alive = false;
        restoreScroll();
      };
    }

    const beginExit = () => {
      if (!alive || exitStarted || finishedRef.current) return;
      exitStarted = true;
      setProgress(100);
      setExiting(true);
      exitTimer = window.setTimeout(finish, EXIT_MS + 20);
    };

    const total = Math.max(1, Number(durationRef.current) || 1);
    const start =
      typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now()
        : Date.now();

    const tick = (now) => {
      if (!alive || finishedRef.current) return;
      const elapsed = now - start;
      const t = elapsed / total;
      setProgress(Math.round(easeOutCubic(t) * 100));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        beginExit();
      }
    };

    rafId = window.requestAnimationFrame(tick);
    fallbackTimer = window.setTimeout(finish, total + HARD_FALLBACK_PAD_MS);

    return () => {
      alive = false;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackTimer);
      restoreScroll();
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden={exiting ? "true" : undefined}
      className="fixed inset-0 z-[9000] overflow-hidden bg-rm-bg motion-reduce:hidden"
      style={{
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${EXIT_MS}ms ${EXIT_EASING}`,
        willChange: "transform",
      }}
    >
      <div className="absolute left-0 top-0 px-6 pt-8 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-rm-faint">
          {label} — loading
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 flex items-end px-6 pb-10 sm:px-10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={`${label} loading`}
      >
        <span className="font-display tabular-nums tracking-tight text-rm-text text-[clamp(4.5rem,14vw,9rem)] leading-[0.8]">
          {progress}
        </span>
        <span className="mb-[0.35em] ml-2 font-mono text-[clamp(0.75rem,1.6vw,1.1rem)] tracking-tight text-rm-faint">
          %
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-rm-border-subtle">
        <div
          className="h-px w-full bg-rm-accent"
          style={{
            transform: `scaleX(${progress / 100})`,
            transformOrigin: "left center",
            transition: "transform 120ms linear",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
