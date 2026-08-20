"use client";

import {
  Ban,
  Copy,
  Crosshair,
  Download,
  Droplets,
  Eye,
  Flame,
  FlaskConical,
  Fuel,
  Image,
  LoaderCircle,
  Radio,
  TrendingDown,
  X,
  Zap,
  Dices,
} from "lucide-react";

const MAP = {
  spectator: Eye,
  dust: TrendingDown,
  exit: Droplets,
  fomo: Zap,
  gas: Fuel,
  collector: Image,
  rekt: Ban,
  addict: Radio,
  ape: Crosshair,
  lab: FlaskConical,
  weekend: Dices,
  degen: Flame,
};

export function Mark({ name = "degen", className = "", size = 16, strokeWidth = 1.5 }) {
  const Icon = MAP[name] || Flame;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

export function IconXLogo({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export {
  Ban,
  Copy,
  Crosshair,
  Download,
  Droplets,
  Eye,
  Flame,
  FlaskConical,
  Fuel,
  Image,
  LoaderCircle,
  Radio,
  TrendingDown,
  X,
  Zap,
  Dices,
};
