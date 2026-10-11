"use client";

import React from "react";

export function FrutigerAeroBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Luminous Top Sky Sunbeam Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-white/70 via-sky-200/20 to-transparent rounded-full blur-3xl opacity-70" />

      {/* Floating Translucent Frutiger Aero Bubbles */}
      <div
        className="aero-bubble absolute top-12 left-[8%] w-24 h-24 opacity-60"
        style={{ transform: "scale(1)" }}
      />
      <div
        className="aero-bubble absolute top-36 right-[10%] w-36 h-36 opacity-50"
        style={{ transform: "scale(1)" }}
      />
      <div
        className="aero-bubble absolute bottom-24 left-[12%] w-28 h-28 opacity-45"
        style={{ transform: "scale(1)" }}
      />
      <div
        className="aero-bubble absolute bottom-40 right-[15%] w-20 h-20 opacity-40"
        style={{ transform: "scale(1)" }}
      />
      <div
        className="aero-bubble absolute top-1/2 left-[3%] w-16 h-16 opacity-30"
        style={{ transform: "scale(1)" }}
      />

      {/* Bottom Nature Horizon Wave / Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-100/40 via-sky-100/20 to-transparent" />
    </div>
  );
}
