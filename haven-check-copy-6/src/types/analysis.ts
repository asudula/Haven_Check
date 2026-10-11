export interface AnalysisResult {
  /** Assessment of whether any person or human figure appears in the photo */
  personCheck: string;
  /** Direct answer to the user's specific question, or null if no question was provided */
  questionAnswer: string | null;
  /** Calm, neutral visual description of the visible room or scene */
  sceneDescription: string;
  /** Explicit note regarding visibility, obstructions, lighting, or visual limitations */
  uncertainty: string | null;
  /** ISO timestamp when the scan was performed */
  timestamp: string;
}

export interface AnalysisRequest {
  /** Base64 data URL or raw base64 string */
  image: string;
  /** Optional user question regarding a specific item or detail */
  question?: string;
  /** Image MIME type (e.g. image/jpeg, image/png, image/webp) */
  mimeType?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: string;
}
