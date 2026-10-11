"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Camera, X, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isInitializing, setIsInitializing] = useState(true);

  // Safely stop stream tracks and clear video source without React state updates
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopTracks();
      return;
    }

    let active = true;

    // Connect to camera asynchronously
    const connectCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            "Camera access is not supported by your current browser. You can upload a photo file instead."
          );
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        if (!active) return;
        const errName = (err as { name?: string })?.name || "";
        if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
          setError(
            "Camera permission was denied. Please allow camera permissions in your browser or choose 'Upload a photo'."
          );
        } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
          setError("No camera was found on this device. Please choose 'Upload a photo'.");
        } else {
          setError(
            "Could not start the camera feed. Please check device permissions or select an image file."
          );
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    };

    connectCamera();

    return () => {
      active = false;
      stopTracks();
    };
  }, [isOpen, facingMode, stopTracks]);

  // Handle take still photo
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Create canvas to capture still frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Compress to clean JPEG
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Shut down video tracks immediately after capture
    stopTracks();

    onCapture(dataUrl);
    onClose();
  };

  const handleClose = () => {
    stopTracks();
    onClose();
  };

  const toggleFacingMode = () => {
    setIsInitializing(true);
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-modal-title"
    >
      <div className="aero-glass w-full max-w-xl overflow-hidden shadow-2xl border-white/90 bg-white/95 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 flex items-center justify-between border-b border-sky-100/80 bg-gradient-to-r from-sky-50/90 to-teal-50/90">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-700">
              <Camera className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="camera-modal-title" className="text-base font-bold text-sky-950">
                Take a Room Photo
              </h2>
              <p className="text-xs text-sky-800/80">Single photo capture — no continuous recording</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-sky-100 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative bg-slate-950 aspect-[4/3] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm text-white">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-slate-200 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="aero-btn-secondary px-4 py-2 text-xs font-semibold"
              >
                Use Photo Upload Instead
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => setIsInitializing(false)}
              />

              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                  <span className="text-xs font-medium text-sky-200">Starting camera safely...</span>
                </div>
              )}

              {/* Viewfinder Guidance */}
              {!isInitializing && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 border border-white/20">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] bg-black/50 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      Single still capture
                    </span>
                    <span className="text-[11px] bg-black/50 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Hold still
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/90 bg-black/60 px-3 py-1 rounded-full inline-block backdrop-blur-xs shadow-xs">
                      Point at the area of the room you want checked
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-gradient-to-t from-sky-50 to-white flex items-center justify-between border-t border-sky-100">
          <button
            onClick={toggleFacingMode}
            disabled={!!error || isInitializing}
            className="aero-btn-secondary px-3 py-2 text-xs font-medium flex items-center gap-1.5"
            aria-label="Flip camera lens"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Flip Camera</span>
          </button>

          {/* Shutter Button */}
          <button
            onClick={handleSnap}
            disabled={!!error || isInitializing}
            className="w-16 h-16 rounded-full flex items-center justify-center relative transition-transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Capture photograph"
          >
            {/* Glossy aero ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg border-2 border-white" />
            <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center shadow-inner">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 shadow-xs" />
            </div>
          </button>

          <button
            onClick={handleClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
