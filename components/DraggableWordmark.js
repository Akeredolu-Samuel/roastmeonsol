"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EASE_BACK = "cubic-bezier(0.16,1,0.3,1)";
const EASE_BACK_MS = 600;
const HANDLE_BORDER = { border: "1px solid var(--rm-accent)" };

function formatReadout(x, y) {
  return "x: " + Math.round(x) + "  y: " + Math.round(y);
}

export default function DraggableWordmark({
  top = "GET",
  bottom = "ROASTED",
  hint = "DRAG TO MOVE",
  className = "",
}) {
  const [interactive, setInteractive] = useState(false);
  const [dragging, setDragging] = useState(false);

  const blockRef = useRef(null);
  const readoutRef = useRef(null);

  const activeRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0 });
  const releaseTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const endHandlerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

    const sync = () => {
      if (!mountedRef.current) return;
      setInteractive(fine.matches && !reduce.matches);
    };

    sync();

    const listen = (mql) => {
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", sync);
        return () => mql.removeEventListener("change", sync);
      }
      mql.addListener(sync);
      return () => mql.removeListener(sync);
    };

    const unlistenReduce = listen(reduce);
    const unlistenFine = listen(fine);

    return () => {
      unlistenReduce();
      unlistenFine();
    };
  }, []);

  const handleMove = useCallback((event) => {
    if (!activeRef.current) return;
    const node = blockRef.current;
    if (!node) return;

    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;

    node.style.transform = "translate3d(" + dx + "px, " + dy + "px, 0)";
    if (readoutRef.current) readoutRef.current.textContent = formatReadout(dx, dy);
  }, []);

  const detach = useCallback(() => {
    const node = blockRef.current;
    if (!node) return;

    node.removeEventListener("pointermove", handleMove);
    if (endHandlerRef.current) {
      node.removeEventListener("pointerup", endHandlerRef.current);
      node.removeEventListener("pointercancel", endHandlerRef.current);
    }

    if (pointerIdRef.current !== null) {
      try {
        if (
          typeof node.hasPointerCapture === "function" &&
          node.hasPointerCapture(pointerIdRef.current)
        ) {
          node.releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // Pointer already gone.
      }
      pointerIdRef.current = null;
    }
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    detach();
    activeRef.current = false;

    const node = blockRef.current;
    if (node) {
      node.style.transition = "transform " + EASE_BACK_MS + "ms " + EASE_BACK;
      node.style.transform = "translate3d(0px, 0px, 0)";

      if (releaseTimerRef.current !== null) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = setTimeout(() => {
        releaseTimerRef.current = null;
        const settled = blockRef.current;
        if (settled && !activeRef.current) settled.style.transition = "none";
      }, EASE_BACK_MS + 40);
    }

    if (mountedRef.current) setDragging(false);
  }, [detach]);

  endHandlerRef.current = handleEnd;

  const onPointerDown = useCallback(
    (event) => {
      if (!interactive) return;
      if (typeof event.button === "number" && event.button !== 0) return;

      const node = blockRef.current;
      if (!node) return;

      if (releaseTimerRef.current !== null) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
      detach();

      activeRef.current = true;
      pointerIdRef.current = event.pointerId;
      startRef.current = { x: event.clientX, y: event.clientY };

      node.style.transition = "none";
      node.style.transform = "translate3d(0px, 0px, 0)";

      try {
        node.setPointerCapture(event.pointerId);
      } catch {
        // Capture is optional.
      }

      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerup", handleEnd);
      node.addEventListener("pointercancel", handleEnd);

      setDragging(true);
    },
    [interactive, detach, handleMove, handleEnd]
  );

  useEffect(() => {
    return () => {
      const node = blockRef.current;
      if (node) {
        node.removeEventListener("pointermove", handleMove);
        if (endHandlerRef.current) {
          node.removeEventListener("pointerup", endHandlerRef.current);
          node.removeEventListener("pointercancel", endHandlerRef.current);
        }
      }
      if (releaseTimerRef.current !== null) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
      activeRef.current = false;
      pointerIdRef.current = null;
    };
  }, [handleMove]);

  useEffect(() => {
    if (interactive) return;
    detach();
    activeRef.current = false;
    if (releaseTimerRef.current !== null) {
      clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
    const node = blockRef.current;
    if (node) {
      node.style.transition = "none";
      node.style.transform = "translate3d(0px, 0px, 0)";
    }
    setDragging(false);
  }, [interactive, detach]);

  const lineClass =
    "block text-center font-display text-[clamp(4.2rem,18vw,13rem)] uppercase leading-[0.82] tracking-[0.01em]";

  return (
    <div className={"relative w-full select-none " + className}>
      <div
        ref={blockRef}
        onPointerDown={interactive ? onPointerDown : undefined}
        style={{
          transform: "translate3d(0px, 0px, 0)",
          transition: "none",
          touchAction: interactive ? "none" : "auto",
          willChange: interactive ? "transform" : "auto",
        }}
        className={
          "relative mx-auto w-fit " +
          (interactive ? "cursor-grab active:cursor-grabbing" : "cursor-default")
        }
      >
        <div className="relative px-3 py-1" style={{ border: "1px dashed var(--rm-accent)" }}>
          <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-sm bg-rm-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black">
            {hint}
          </span>

          {dragging ? (
            <span
              ref={readoutRef}
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 -translate-y-[calc(100%+8px)] whitespace-pre rounded-sm border border-rm-border bg-rm-card px-2 py-1 font-mono text-[10px] text-rm-muted"
            >
              {formatReadout(0, 0)}
            </span>
          ) : null}

          <span className={lineClass + " text-rm-text"}>{top}</span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-rm-bg"
            style={HANDLE_BORDER}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 bg-rm-bg"
            style={HANDLE_BORDER}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 bg-rm-bg"
            style={HANDLE_BORDER}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-rm-bg"
            style={HANDLE_BORDER}
          />
        </div>

        <span
          className={lineClass}
          style={{ color: "transparent", WebkitTextStroke: "1.5px var(--rm-text)" }}
        >
          {bottom}
        </span>
      </div>
    </div>
  );
}
