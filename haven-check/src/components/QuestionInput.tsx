"use client";

import React from "react";
import { HelpCircle, X } from "lucide-react";

interface QuestionInputProps {
  question: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Do you see my backpack?",
  "Is there a jacket on the chair?",
  "Is the door open or closed?",
  "What is that shape in the corner?",
];

export function QuestionInput({
  question,
  onChange,
  disabled = false,
}: QuestionInputProps) {
  const maxLength = 500;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="user-question-input"
          className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" aria-hidden="true" />
          <span>Is there something specific you&apos;d like me to look for?</span>
          <span className="text-slate-500 font-normal text-xs">(Optional)</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {question.length}/{maxLength}
        </span>
      </div>

      <div className="relative">
        <input
          id="user-question-input"
          type="text"
          value={question}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder='e.g., "Do you see my backpack?" or "Is that a coat on the coatrack?"'
          className="aero-input w-full px-3.5 py-2.5 text-sm placeholder:text-slate-400 pr-9"
        />
        {question.length > 0 && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Clear question"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggested question chips */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
          {SUGGESTED_QUESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(sug)}
              className="text-xs px-2.5 py-1 rounded-full bg-white/70 hover:bg-sky-50 text-sky-800 border border-sky-200/80 transition-colors shadow-2xs font-medium"
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
