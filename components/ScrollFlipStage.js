"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const DEGRADE_QUERY = "(pointer: coarse), (max-width: 767px)";
const SPRING = { stiffness: 90, damping: 24, restDelta: 0.001 };
const END_SCALE = 0.72;
const END_Y_VH = -14;
const END_OPACITY = 0.15;
const MEASURE_FAILSAFE_MS = 1500;

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function clampRotate(value) {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 62;
  return Math.max(0, Math.min(85, n));
}

export default function ScrollFlipStage({
  children,
  scrollLength = "180vh",
  maxRotate = 62,
  className,
  fill = false,
}) {
  const outerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setEnhanced(false);
      return undefined;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mql = window.matchMedia(DEGRADE_QUERY);
    const sync = () => setEnhanced(!mql.matches);

    sync();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", sync);
      return () => mql.removeEventListener("change", sync);
    }
    mql.addListener(sync);
    return () => mql.removeListener(sync);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enhanced || typeof window === "undefined") return undefined;

    const id = window.setTimeout(() => {
      const el = outerRef.current;
      if (!el) return;
      if (el.getBoundingClientRect().height < 1) setEnhanced(false);
    }, MEASURE_FAILSAFE_MS);

    return () => window.clearTimeout(id);
  }, [enhanced]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const rotateEnd = clampRotate(maxRotate);
  const progress = useSpring(scrollYProgress, SPRING);
  const rotateX = useTransform(progress, [0, 1], [0, rotateEnd]);
  const scale = useTransform(progress, [0, 1], [1, END_SCALE]);
  const opacity = useTransform(progress, [0, 1], [1, END_OPACITY]);
  const y = useTransform(progress, (p) => {
    const v = p * END_Y_VH;
    return Math.abs(v) < 0.001 ? 0 : `${v}vh`;
  });

  const board = fill ? (
    <div className="flex h-full w-full flex-col justify-center">{children}</div>
  ) : (
    children
  );

  if (!enhanced) {
    return (
      <div ref={outerRef} className={cx("relative w-full py-16 sm:py-20", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={cx("relative w-full", className)}
      style={{ height: scrollLength }}
    >
      <div
        className="sticky top-0 flex w-full items-center justify-center"
        style={{
          height: "100svh",
          perspective: "1400px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        <motion.div
          className="dots transform-gpu h-full w-full overflow-hidden rounded-2xl border border-rm-border-subtle bg-rm-bg"
          style={{
            rotateX,
            scale,
            y,
            opacity,
            transformOrigin: "50% 15%",
            willChange: "transform, opacity",
          }}
        >
          {board}
        </motion.div>
      </div>
    </div>
  );
}
