"use client";

import React, { useState } from "react";
import { Sparkles, Wind, Eye, Hand, Ear, Sun, X } from "lucide-react";

interface GroundingBoxProps {
  onClose: () => void;
}

export function GroundingBox({ onClose }: GroundingBoxProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      count: "5",
      label: "Things you can see",
      icon: Eye,
      description: "Look around gently. Notice 5 neutral, solid objects (e.g., the edge of a desk, a clock, a light switch, floorboards, shoes).",
    },
    {
      count: "4",
      label: "Things you can physically feel",
      icon: Hand,
      description: "Feel your feet firmly on the ground, the texture of your shirt, the cool surface of a table, or air on your hands.",
    },
    {
      count: "3",
      label: "Things you can hear",
      icon: Ear,
      description: "Listen for ambient sounds: distant traffic, the gentle hum of an appliance, or your own slow breath.",
    },
    {
      count: "2",
      label: "Things you can smell",
      icon: Wind,
      description: "Notice any scent nearby: fresh air from a window, laundry detergent, soap, or a sip of water.",
    },
    {
      count: "1",
      label: "Thing you are grateful for or love",
      icon: Sun,
      description: "Name one safe thought, comforting memory, or favorite pet that brings peace to your mind.",
    },
  ];

  return (
    <div className="aero-glass-card p-5 border-emerald-300/80 bg-gradient-to-b from-emerald-50/90 to-sky-50/90 shadow-lg relative my-4">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-emerald-100 transition-colors"
        aria-label="Close grounding guide"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">5-4-3-2-1 Grounding Practice</h2>
          <p className="text-xs text-slate-600">Re-anchor your senses into your physical surroundings</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {steps.map((s, idx) => {
          const isSelected = activeStep === idx;
          const Icon = s.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-white text-emerald-800 shadow-md border border-emerald-300 font-bold scale-102"
                  : "bg-white/50 text-slate-600 hover:bg-white/80 border border-white/60"
              }`}
              aria-label={`Step ${s.count}: ${s.label}`}
            >
              <span className="text-base font-bold text-emerald-600">{s.count}</span>
              <Icon className="w-3.5 h-3.5 mt-0.5 opacity-80" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Active step display */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/90 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-1">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            {steps[activeStep].count}
          </span>
          <span>{steps[activeStep].label}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
          {steps[activeStep].description}
        </p>
      </div>
    </div>
  );
}
