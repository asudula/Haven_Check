"use client";

import React from "react";
import { RefreshCw, CheckCircle2, Shield } from "lucide-react";

interface ImagePreviewProps {
  imageDataUrl: string;
  onClear: () => void;
  isScanning: boolean;
}

export function ImagePreview({
  imageDataUrl,
  onClear,
  isScanning,
}: ImagePreviewProps) {
  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-white/90 bg-slate-900 group aspect-[4/3] max-h-[360px] flex items-center justify-center">
        {/* Render preview image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUrl}
          alt="Selected room photo preview"
          className="w-full h-full object-contain sm:object-cover"
        />

        {/* Glossy overlay badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-sky-950 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-white">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span>Photo Ready</span>
        </div>

        {/* Change photo button */}
        {!isScanning && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={onClear}
              className="aero-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-md bg-white/95"
              aria-label="Choose or take a different photo"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Change Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Pre-scan privacy & notice */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-950 text-xs leading-relaxed">
        <Shield className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p>
          This photo will be sent to the Gemini API for visual grounding analysis. No photos or questions are stored in a database or local storage.
        </p>
      </div>
    </div>
  );
}
