import { NextRequest, NextResponse } from "next/server";
import { analyzeRoomImage } from "@/lib/gemini";
import { AnalysisRequest } from "@/types/analysis";

// Supported image MIME types
const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
]);

// Maximum allowable base64 payload size: ~12MB (representing ~9MB raw image file)
const MAX_PAYLOAD_BYTES = 12 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Verify content length
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        {
          error:
            "Image file is too large. Please select a photo under 10MB.",
          code: "PAYLOAD_TOO_LARGE",
        },
        { status: 413 }
      );
    }

    // 2. Parse request body safely
    let body: AnalysisRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON request payload.",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    const { image, question, mimeType } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          error: "Missing image data in request.",
          code: "MISSING_IMAGE",
        },
        { status: 400 }
      );
    }

    // 3. Extract and validate MIME type and base64 data
    let cleanBase64 = image.trim();
    let detectedMime = (mimeType || "").toLowerCase().trim();

    // If it's a data URL (e.g., data:image/jpeg;base64,...), extract components
    const dataUrlMatch = cleanBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      detectedMime = dataUrlMatch[1].toLowerCase().trim();
      cleanBase64 = dataUrlMatch[2].trim();
    }

    if (!detectedMime) {
      detectedMime = "image/jpeg";
    }

    if (!SUPPORTED_MIME_TYPES.has(detectedMime)) {
      return NextResponse.json(
        {
          error: `Unsupported image type (${detectedMime}). Please submit a JPEG, PNG, or WebP photo.`,
          code: "UNSUPPORTED_MEDIA_TYPE",
        },
        { status: 415 }
      );
    }

    // Approximate size check of base64
    const approxByteSize = (cleanBase64.length * 3) / 4;
    if (approxByteSize > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        {
          error:
            "The image is too large. Please take or select a photo under 10MB.",
          code: "IMAGE_TOO_LARGE",
        },
        { status: 413 }
      );
    }

    // 4. Sanitize optional question
    let sanitizedQuestion: string | undefined = undefined;
    if (typeof question === "string") {
      const trimmed = question.trim();
      if (trimmed.length > 0) {
        // Enforce maximum question length of 500 characters
        sanitizedQuestion = trimmed.slice(0, 500);
      }
    }

    // 5. Check API key presence before invoking
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your environment or .env.local file.",
          code: "CONFIG_MISSING",
        },
        { status: 503 }
      );
    }

    // 6. Invoke Gemini with a server-side timeout promise (28 seconds)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Analysis timed out. Please try again with a clear photo.")),
        28000
      )
    );

    const result = await Promise.race([
      analyzeRoomImage(cleanBase64, detectedMime, sanitizedQuestion),
      timeoutPromise,
    ]);

    const duration = Date.now() - startTime;
    // Log only safe operational metrics: no image bytes, no questions, no secret keys
    console.log(`[HavenCheck API] Image analysis completed successfully in ${duration}ms`);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (err: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error(`[HavenCheck API] Image analysis failed after ${duration}ms: ${errorMessage}`);

    // Check for common Gemini API errors and provide compassionate, actionable messages
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return NextResponse.json(
        {
          error:
            "Gemini rate limit reached. Please wait a moment before requesting another check.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    if (errorMessage.includes("API key not valid") || errorMessage.includes("INVALID_ARGUMENT")) {
      return NextResponse.json(
        {
          error:
            "The Gemini API key appears to be invalid or unauthorized. Please verify GEMINI_API_KEY.",
          code: "INVALID_API_KEY",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to complete the room check at this moment. Please check your connection and try again.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        code: "ANALYSIS_FAILED",
      },
      { status: 500 }
    );
  }
}
