"use client";

import React, { useEffect, useRef } from "react";
import { X, ShieldAlert, Heart, Eye, Lock, PhoneCall } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & trap focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        ref={modalRef}
        className="aero-glass max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border-white/90 bg-white/95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-sky-100/80 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-800 mb-1">
              <Heart className="w-5 h-5 text-sky-600" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wider uppercase">About HavenCheck</span>
            </div>
            <h2 id="about-modal-title" className="text-2xl font-bold text-sky-950">
              A Calm Visual Grounding Aid
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              HavenCheck is designed for people experiencing perception distress, anxiety, or schizophrenia who want a calm, objective second perspective when they feel someone or something might be in their space.
            </p>
          </div>

          {/* Important Ethical Disclaimers & Limits */}
          <div className="rounded-xl p-4 bg-sky-50 border border-sky-200 space-y-3">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-sky-950">
                  Visual Aid Based on One Still Photo
                </h3>
                <p className="text-xs text-sky-900/90 mt-1 leading-relaxed">
                  HavenCheck analyzes only what is captured within the frame of a single photo. It cannot see behind furniture, inside closed closets, behind curtains, or outside the lens view. It does not make absolute claims about physical reality beyond what is clearly visible.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-sky-200/80">
              <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Not Medical Advice or Emergency Care
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  This application is a companion tool, not a diagnostic or medical device. It cannot replace a mental health clinician, doctor, or trusted support person. If you are in immediate danger or distress, please reach out to dedicated support resources.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantees */}
          <div className="rounded-xl p-4 bg-emerald-50/80 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
              <Lock className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>Zero-Retention Ephemeral Privacy</span>
            </div>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              Your room photos and questions are sent securely to Google Gemini for visual analysis and kept only in your browser&apos;s current memory. They are <strong>never saved</strong> to a database, local storage, analytics, or training logs. When you clear the scan or refresh the tab, the image is wiped.
            </p>
          </div>

          {/* Support Resources */}
          <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <PhoneCall className="w-4 h-4 text-sky-700" aria-hidden="true" />
              <span>Need Support Right Now?</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>988 Suicide & Crisis Lifeline (US & Canada):</strong> Call or text{" "}
                <span className="font-semibold text-sky-800">988</span> (available 24/7, free and confidential).
              </li>
              <li>
                <strong>Crisis Text Line:</strong> Text{" "}
                <span className="font-semibold text-sky-800">HOME to 741741</span> to connect with a crisis counselor.
              </li>
              <li>
                <strong>SAMHSA National Helpline:</strong> Call{" "}
                <span className="font-semibold text-sky-800">1-800-662-4357</span> for mental health information and referrals.
              </li>
              <li>
                <strong>International Support:</strong> Find local hotlines at{" "}
                <a
                  href="https://findahelpline.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 underline font-medium hover:text-sky-900"
                >
                  findahelpline.com
                </a>.
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="aero-btn-primary px-5 py-2 text-sm font-semibold"
            >
              I Understand & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
