"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { CameraModal } from "@/components/CameraModal";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { QuestionInput } from "@/components/QuestionInput";
import { ResultsView } from "@/components/ResultsView";
import { AboutModal } from "@/components/AboutModal";
import { GroundingBox } from "@/components/GroundingBox";
import { FrutigerAeroBackground } from "@/components/FrutigerAeroBackground";
import { AnalysisResult } from "@/types/analysis";
import { Sparkles, AlertCircle, RefreshCw, Eye } from "lucide-react";

export default function Home() {
  // State for current scan (ephemeral in memory only)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [question, setQuestion] = useState<string>("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string>("");

  // UI state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Handle image selected from camera or upload
  const handleImageSelected = (dataUrl: string, mime: string = "image/jpeg") => {
    setImageDataUrl(dataUrl);
    setImageMimeType(mime);
    setError(null);
    setResult(null);
  };

  // Clear / Reset scan state completely
  const handleReset = () => {
    setImageDataUrl(null);
    setQuestion("");
    setSubmittedQuestion("");
    setResult(null);
    setError(null);
    setIsScanning(false);
  };

  // Perform Gemini image analysis
  const handleAnalyze = async () => {
    if (!imageDataUrl) {
      setError("Please take or upload a photo first.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setSubmittedQuestion(question.trim());

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageDataUrl,
          question: question.trim() || undefined,
          mimeType: imageMimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze the photo. Please try again.");
      }

      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-sky-200 selection:text-sky-900">
      <FrutigerAeroBackground />

      {/* Header */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        onToggleGrounding={() => setShowGrounding((prev) => !prev)}
        showGrounding={showGrounding}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Optional Sensory Grounding Box */}
        {showGrounding && (
          <GroundingBox onClose={() => setShowGrounding(false)} />
        )}

        {/* Primary Interactive Container */}
        <div className="aero-glass p-5 sm:p-8 space-y-6">
          {/* Reassuring Intro Banner when no image is loaded */}
          {!imageDataUrl && !result && (
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold border border-sky-200/80 shadow-2xs">
                <Eye className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                <span>Text-First Room Companion</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-sky-950">
                Need a calm second look at your room?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Take or upload a photo of your space. HavenCheck uses Gemini to calmly check for people and answer any specific question to help you feel grounded.
              </p>
            </div>
          )}

          {/* STEP 1: Select or Capture Photo */}
          {!imageDataUrl && !result && (
            <ImageUploader
              onImageSelected={handleImageSelected}
              onStartCamera={() => setIsCameraOpen(true)}
            />
          )}

          {/* STEP 2 & 3: Preview Photo, Input Question, and Scan */}
          {imageDataUrl && !result && (
            <div className="space-y-5">
              <ImagePreview
                imageDataUrl={imageDataUrl}
                onClear={handleReset}
                isScanning={isScanning}
              />

              <QuestionInput
                question={question}
                onChange={setQuestion}
                disabled={isScanning}
              />

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isScanning}
                  className="aero-btn-primary w-full py-4 px-6 text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg"
                  aria-label="Check this image with Gemini"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>Examining photo calmly with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-sky-200" aria-hidden="true" />
                      <span>Check this image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 & 5: Results View */}
          {result && (
            <ResultsView
              result={result}
              userQuestion={submittedQuestion}
              onReset={handleReset}
            />
          )}

          {/* Error Banner */}
          {error && (
            <div
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3 shadow-2xs"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-semibold">Notice</p>
                <p className="text-xs sm:text-sm text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-700 underline font-medium hover:text-red-900 pt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reassurance & Ethical Limitations Footnote */}
        <aside className="mt-6 text-center text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          <p>
            HavenCheck provides visual feedback on a single photograph. It is not a clinical service, medical advice, or replacement for human care.
          </p>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center text-xs text-sky-800/80 border-t border-sky-100/60 bg-white/40 backdrop-blur-xs">
        <p>
          Built for HackNC &bull; Community Track &bull; Powered by Google Gemini API &bull; Designed in Frutiger Aero
        </p>
      </footer>

      {/* Camera Viewfinder Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => handleImageSelected(dataUrl, "image/jpeg")}
      />

      {/* About & Limitations Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
