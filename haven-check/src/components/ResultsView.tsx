"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { AnalysisResult } from "@/types/analysis";
import {
  UserCheck,
  HelpCircle,
  Eye,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
} from "lucide-react";

interface ResultsViewProps {
  result: AnalysisResult;
  userQuestion?: string;
  onReset: () => void;
}

const emptySubscribe = () => () => {};

export function ResultsView({
  result,
  userQuestion,
  onReset,
}: ResultsViewProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Safely check speech synthesis support using React's useSyncExternalStore
  const hasSpeechSupport = useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!hasSpeechSupport) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narration = [
      `Person check: ${result.personCheck}.`,
      result.questionAnswer ? `Regarding your question: ${result.questionAnswer}.` : "",
      `Visible room overview: ${result.sceneDescription}.`,
      result.uncertainty ? `Visibility note: ${result.uncertainty}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.9; // Calm, relaxed speaking pace
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Banner with Audio and Reset controls */}
      <div className="flex items-center justify-between gap-2 p-3 bg-white/70 rounded-2xl border border-sky-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-semibold text-sky-950">
            Grounding Assessment Complete
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasSpeechSupport && (
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isPlayingAudio
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-sky-800 hover:bg-sky-50 border border-sky-200"
              }`}
              aria-label={isPlayingAudio ? "Stop reading report aloud" : "Read report aloud calmly"}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sky-600" aria-hidden="true" />
                  <span className="hidden sm:inline">Listen Aloud</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onReset}
            className="aero-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            aria-label="Clear scan and start new check"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Check</span>
          </button>
        </div>
      </div>

      {/* 1. SECTION: Person Check (ALWAYS SHOWN) */}
      <div className="aero-glass-card p-5 border-sky-300/80 bg-gradient-to-b from-sky-50/90 via-white/95 to-teal-50/80 shadow-md">
        <div className="flex items-center gap-2.5 mb-2.5 pb-2.5 border-b border-sky-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white shadow-2xs">
            <UserCheck className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-sky-950">
              Person Check
            </h2>
            <p className="text-[11px] text-sky-800/80">
              Evaluated on every scan based on the submitted photograph
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium bg-white/70 p-3.5 rounded-xl border border-sky-100/80 shadow-2xs">
          {result.personCheck}
        </p>
      </div>

      {/* 2. SECTION: Your Question (Shown when user entered a question) */}
      {(userQuestion?.trim() || result.questionAnswer) && (
        <div className="aero-glass-card p-5 border-teal-300/80 bg-gradient-to-b from-teal-50/90 via-white/95 to-sky-50/80 shadow-md">
          <div className="flex items-center gap-2.5 mb-2.5 pb-2.5 border-b border-teal-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-2xs">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-teal-950">
                Your Question
              </h2>
              {userQuestion && (
                <p className="text-[11px] text-teal-800/80 italic">
                  &ldquo;{userQuestion}&rdquo;
                </p>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium bg-white/70 p-3.5 rounded-xl border border-teal-100/80 shadow-2xs">
            {result.questionAnswer || "The submitted photograph did not provide clear visual evidence regarding this inquiry."}
          </p>
        </div>
      )}

      {/* 3. SECTION: Visible Room Overview */}
      <div className="aero-glass-card p-4 sm:p-5 border-white/90 bg-white/85 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-sky-700" aria-hidden="true" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
            Visible Room Overview
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-6">
          {result.sceneDescription}
        </p>
      </div>

      {/* 4. SECTION: Visibility & Limitations (If present) */}
      {result.uncertainty && (
        <div className="rounded-xl p-4 bg-amber-50/90 border border-amber-200/90 text-amber-950 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <h3 className="text-xs sm:text-sm font-semibold">
              Visibility & Visual Limitations
            </h3>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed pl-6">
            {result.uncertainty}
          </p>
        </div>
      )}

      {/* Grounding Reminder Footer */}
      <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-center text-[11px] text-sky-800">
        This feedback describes a single still image. Remember that shadows, reflections, and narrow camera angles can obscure details.
      </div>

      {/* Reset Action */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={onReset}
          className="aero-btn-primary px-8 py-3 text-sm font-semibold shadow-md flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Check Another Area or Photo</span>
        </button>
      </div>
    </div>
  );
}
