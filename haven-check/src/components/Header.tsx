"use client";

import React from "react";
import { Info, Sparkles, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenAbout: () => void;
  onToggleGrounding: () => void;
  showGrounding: boolean;
}

export function Header({
  onOpenAbout,
  onToggleGrounding,
  showGrounding,
}: HeaderProps) {
  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="aero-glass px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
        {/* Subtle decorative Aero glossy highlight strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-sky-300 via-sky-500 to-teal-500 shadow-md border border-white/80 overflow-hidden flex-shrink-0">
            {/* Glossy sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-1/2" />
            <ShieldCheck className="w-6 h-6 text-white drop-shadow relative z-10" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-sky-950 flex items-center gap-1.5">
                HavenCheck
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 shadow-xs">
                  Gemini Grounding
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-sky-800/90 font-medium">
              A calm, text-first room companion for reassurance & sensory grounding
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={onToggleGrounding}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium flex items-center gap-1.5 transition-all ${
              showGrounding
                ? "bg-emerald-600 text-white shadow-sm border border-emerald-700"
                : "aero-btn-secondary"
            }`}
            aria-pressed={showGrounding}
            aria-label="Toggle sensory grounding exercise"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showGrounding ? "Hide Grounding" : "Grounding Space"}</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="aero-btn-secondary px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium flex items-center gap-1.5"
            aria-label="Open About and Limitations"
          >
            <Info className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
            <span>About & Limits</span>
          </button>
        </div>
      </div>
    </header>
  );
}
