"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RoastCard from "@/components/RoastCard";
import { X } from "@/components/icons";

const FORCE_REVEAL_MS = 900;
const BLOOM_EASE = [0.16, 1, 0.3, 1];

const SCAN_LINES = [
  "Pulling your dirty laundry off-chain…",
  "Counting the rugs you funded…",
  "Measuring exit liquidity…",
  "Checking who sold into you…",
  "Drafting the public execution…",
];

export default function RoastOverlay({ open, onClose, loading, error, roast }) {
  const reduce = useReducedMotion() ?? false;
  const [forced, setForced] = useState(false);
  const [scan, setScan] = useState(0);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const requestClose = useCallback(() => {
    if (typeof closeRef.current === "function") closeRef.current();
  }, []);

  const backdropPress = useRef(false);
  const onBackdropMouseDown = useCallback((event) => {
    backdropPress.current = event.target === event.currentTarget;
  }, []);
  const onBackdropClick = useCallback(
    (event) => {
      if (backdropPress.current && event.target === event.currentTarget) requestClose();
      backdropPress.current = false;
    },
    [requestClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, requestClose]);

  useEffect(() => {
    if (!open) return undefined;
    if (typeof document === "undefined") return undefined;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    let gutter = 0;
    try {
      gutter = window.innerWidth - document.documentElement.clientWidth;
    } catch {
      gutter = 0;
    }
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForced(false);
      return undefined;
    }
    const timer = setTimeout(() => setForced(true), FORCE_REVEAL_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !loading) return undefined;
    const id = setInterval(() => setScan((n) => (n + 1) % SCAN_LINES.length), 1100);
    return () => clearInterval(id);
  }, [open, loading]);

  const panelInitial = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 };
  const panelAnimate = reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const panelTransition = reduce
    ? { duration: 0.2, ease: "linear" }
    : { duration: 0.5, ease: BLOOM_EASE };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="roast-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Wallet roast"
          className="fixed inset-0 z-[8000] flex items-center justify-center overflow-y-auto overscroll-contain bg-rm-bg/95 px-4 py-14 backdrop-blur-xl sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onMouseDown={onBackdropMouseDown}
          onClick={onBackdropClick}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-[8%] top-[6%] h-[52vmin] w-[52vmin] rounded-full blur-[80px] sm:blur-[110px]"
              style={{
                opacity: 0.14,
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, var(--rm-accent), transparent 68%)",
              }}
              animate={
                reduce
                  ? undefined
                  : { x: [0, 46, -18, 0], y: [0, -30, 26, 0], scale: [1, 1.12, 0.96, 1] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }
              }
            />
            <motion.div
              className="absolute bottom-[4%] right-[6%] h-[46vmin] w-[46vmin] rounded-full blur-[80px] sm:blur-[120px]"
              style={{
                opacity: 0.1,
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, var(--rm-yellow), transparent 70%)",
              }}
              animate={
                reduce
                  ? undefined
                  : { x: [0, -38, 22, 0], y: [0, 28, -20, 0], scale: [1, 0.94, 1.1, 1] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 27, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }
              }
            />
          </div>

          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-rm-border text-rm-muted transition hover:text-rm-text sm:right-6 sm:top-6"
          >
            <X size={16} strokeWidth={1.5} />
          </button>

          <motion.div
            className="relative z-[1] flex max-h-[calc(100dvh_-_7rem)] w-full max-w-5xl flex-col overflow-y-auto"
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={panelTransition}
            style={forced ? { opacity: 1, transform: "none" } : undefined}
          >
            {loading ? (
              <div className="flex min-h-[42vh] flex-col items-center justify-center px-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-rm-faint">
                  roastmeonsol — scanning
                </p>
                <p className="mt-6 font-display text-[clamp(2.4rem,8vw,4.5rem)] leading-none">
                  READING THE CHAIN
                </p>
                <p className="mt-5 max-w-sm font-mono text-[12px] text-rm-muted">
                  {SCAN_LINES[scan]}
                </p>
                <div className="mt-8 h-px w-48 overflow-hidden bg-rm-border">
                  <motion.div
                    className="h-px bg-rm-accent"
                    animate={reduce ? undefined : { x: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: "40%" }}
                  />
                </div>
              </div>
            ) : error ? (
              <div className="border border-rm-border bg-rm-card px-6 py-10 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-rm-accent">
                  Roast aborted
                </p>
                <p className="mt-4 text-lg">{error}</p>
                <button
                  type="button"
                  onClick={requestClose}
                  className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-rm-muted"
                >
                  Close
                </button>
              </div>
            ) : roast ? (
              <RoastCard roast={roast} />
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
