"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, Camera, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string, mimeType: string) => void;
  onStartCamera: () => void;
}

export function ImageUploader({
  onImageSelected,
  onStartCamera,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Safely scale and read image to prevent oversized payloads
  const processFile = (file: File) => {
    setError(null);

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!file.type.startsWith("image/") && !validTypes.includes(file.type.toLowerCase())) {
      setError("Please select a standard photo file (JPEG, PNG, or WebP).");
      return;
    }

    // Size limit check (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError("File exceeds 15MB. Please choose a smaller photo.");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        setError("Failed to read image data.");
        setIsProcessing(false);
        return;
      }

      // Resize huge mobile camera images via canvas to max 1600px dimension
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          // Fallback to raw data url
          onImageSelected(rawDataUrl, file.type || "image/jpeg");
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        onImageSelected(compressedDataUrl, "image/jpeg");
        setIsProcessing(false);
      };

      img.onerror = () => {
        setError("Unable to process the image format.");
        setIsProcessing(false);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      setError("Error reading the image file.");
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onStartCamera}
          className="aero-btn-primary py-3.5 px-5 flex items-center justify-center gap-2.5 text-base shadow-md group"
          aria-label="Start camera to take a photo"
        >
          <Camera className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true" />
          <span>Start Camera</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aero-btn-secondary py-3.5 px-5 flex items-center justify-center gap-2.5 text-base shadow-sm group"
          aria-label="Upload a photo from device"
        >
          <UploadCloud className="w-5 h-5 text-sky-600 transition-transform group-hover:scale-110" aria-hidden="true" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image file"
      />

      {/* Drop Zone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-sky-500 bg-sky-100/70 scale-[1.01]"
            : "border-sky-200/90 bg-white/50 hover:bg-white/80 hover:border-sky-300"
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        aria-label="Drag and drop a photo or click to browse"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center text-sky-700 shadow-2xs border border-white">
            <ImageIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {isProcessing ? "Processing photo..." : "Drop a room photo here or click to browse"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WebP up to 15MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
