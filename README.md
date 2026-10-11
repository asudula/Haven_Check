# HavenCheck — Calm Room-Checking Companion

> **A text-first visual grounding companion for people experiencing perception distress or schizophrenia, powered by Google Gemini and designed in optimistic Frutiger Aero aesthetic.**

Built for **HackNC** &bull; **Community Track** &bull; **Best Use of Gemini API** &bull; **Frutiger Aero Special Track**

---

## 🌟 Hackathon Pitch

### 🤝 Community Track Fit
For individuals experiencing schizophrenia, sensory overwhelm, or perception distress, asking *"Is someone in the room with me?"* is a profoundly vulnerable experience. Traditional digital tools often stigmatize, clinicalize, or dismiss these experiences.

**HavenCheck** is a compassionate, text-first visual grounding companion. A user intentionally takes or uploads a single room photo. HavenCheck performs an objective, calm assessment:
1. **Always runs a Person Check** — calmly answering whether any human figure is visible in the frame using non-absolute, non-judgmental language (*"I don't detect a person in this image"*).
2. **Answers an optional specific question** — such as *"Do you see my backpack?"* or *"Is that a coat on the chair?"*
3. **Provides an objective scene overview and visibility notes** — explicitly identifying dim lighting, shadows, obscured corners, or angle limitations so the user has context without fear.
4. **Never makes absolute claims of reality** — it respects the user, avoids diagnosing or treating, refuses to confirm persecutory narratives, and includes built-in mental health support helplines (988, Crisis Text Line 741741, SAMHSA).

### 🤖 Best Use of Gemini API
HavenCheck leverages the official **Google GenAI SDK (`@google/genai`)** with Gemini's state-of-the-art multimodal vision capabilities (`gemini-3.5-flash`):
- **Multimodal Visual Reasoning**: Analyzes high-resolution indoor photographs alongside natural-language inquiries.
- **Strict Structured JSON Schema**: Uses `responseMimeType: "application/json"` and `responseSchema` to guarantee consistent, type-safe output:
  ```json
  {
    "personCheck": "I don't detect a person in this image.",
    "questionAnswer": "I can see what appears to be a dark jacket draped over the back of the desk chair.",
    "sceneDescription": "An indoor room with a wooden desk, an office chair, a closed doorway, and a lamp providing warm light.",
    "uncertainty": "The far corner behind the desk is cast in shadow, limiting visibility in that area."
  }
  ```
- **Strict Ethical Prompt Engineering**:
  - Distinguishes ambiguous silhouettes (e.g. coats on doors, shadows) rather than jumping to conclusions.
  - Never claims *"No one is in the room"* — only states what the single camera perspective reveals.
  - Refuses to validate frightening, persecutory, or paranoid interpretations (e.g. never asserts someone is "hiding" or "watching").
- **Zero-Retention Ephemeral Privacy**: Neither image data, questions, nor analysis results are ever written to databases, disk, analytics, or training logs. The scan lives only in active browser memory and can be cleared instantly with one click.

### 🌐 Frutiger Aero Special Track Fit
HavenCheck is styled in an optimistic, early-2000s **Frutiger Aero** aesthetic inspired by sky, water, nature, and friendly technology:
- **Calm, Reassuring Palette**: Soft gradients of sky blue, aqua, marine teal, and fresh leafy green.
- **Tactile Skeuomorphic Sheens**: Glossy pill buttons with top specular highlights, glass-like drop shadows, and translucent frosted panels (`backdrop-filter: blur()`).
- **Nature & Water Accents**: Ambient floating water bubbles, luminous horizon glow, and grounding leaf accents.
- **Accessible & Calming**: Fully compliant with WCAG AAA/AA text contrast ratios (deep navy text on frosted cloud surfaces), visible keyboard focus rings, semantic markup, and complete `@media (prefers-reduced-motion)` suppression to avoid sensory agitation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v20+ recommended)
- **npm** (v9+)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Enter Project Directory
```bash
cd /Users/lucas/.gemini/antigravity/scratch/haven-check
```

### 2. Configure Environment Variables
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

*(Optional: You may also set `GEMINI_MODEL=gemini-2.5-flash` or `GEMINI_MODEL=gemini-2.0-flash` if desired.)*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy Guarantees

- **Server-Side API Key Protection**: `GEMINI_API_KEY` is loaded exclusively inside server-side route handlers (`/api/analyze`). It is never bundled into client JavaScript, exposed in headers, or logged.
- **Ephemeral Scan Lifecycle**: Images captured from the camera or selected from disk are held in volatile browser memory for the duration of the current scan. No database, session storage, local storage, or telemetry storage is used.
- **Privacy Notice Before Transmission**: Clear user consent is shown on screen before any image is sent to Gemini for visual analysis.
- **Zero Logging of Sensitive Data**: The server logs operational performance metrics (e.g. `completed in 1240ms`), but explicitly suppresses image payloads, user questions, and credentials from server logs.
- **Immediate Camera Teardown**: The camera hardware stream is only engaged upon explicit user request and is immediately stopped (`stream.getTracks().forEach(t => t.stop())`) upon capture, cancel, or modal exit.

---

## 📱 Mobile, Camera & HTTPS Notes

### Camera Permissions & Secure Contexts
Browsers require a **Secure Context** to access the camera hardware via `navigator.mediaDevices.getUserMedia`:
- **Local Development**: `http://localhost:3000` is treated as a secure context by all major browsers (Chrome, Safari, Firefox, Edge). Camera access works immediately on localhost.
- **Production Deployment**: Must be deployed over **HTTPS** (e.g. Vercel, Netlify, Cloudflare Pages, AWS) for camera access to function.
- **Testing on Mobile over LAN**: If accessing your development machine from a smartphone over local Wi-Fi (e.g. `http://192.168.1.X:3000`), mobile browsers may block direct camera access due to lack of HTTPS. For mobile testing:
  - Use an HTTPS tunnel such as `ngrok http 3000` or `tailscale funnel`.
  - Alternatively, use the built-in **"Upload Photo"** button, which natively prompts mobile devices for their camera app (`capture="environment"`).
- **Graceful Fallbacks**: If camera access is denied, blocked, or unavailable, HavenCheck seamlessly displays a clear error explanation and provides an immediate one-click option to upload an image file instead.

---

## 🩺 Important Limitations & Ethical Notice

HavenCheck is an assistive visual grounding tool designed to offer reassuring, objective descriptions of a photograph.
- **Single Angle Limitation**: The app analyzes only what is framed in a single photograph. It cannot see outside the camera's field of view, behind closed doors, or beneath furniture.
- **Not Medical Advice**: HavenCheck does not diagnose, treat, prevent, or cure any mental health condition, including schizophrenia. It does not replace a doctor, psychiatrist, clinician, or trusted support person.
- **Crisis Support**: If you or someone you know is in emotional crisis, free confidential help is available 24/7:
  - **988 Suicide & Crisis Lifeline**: Dial or text `988` (US & Canada).
  - **Crisis Text Line**: Text `HOME` to `741741`.
  - **SAMHSA National Helpline**: `1-800-662-4357`.
  - **International**: [findahelpline.com](https://findahelpline.com/)

---

## 🛠️ Verification & Quality Commands

```bash
# Run ESLint
npm run lint

# Run TypeScript Type Check
npx tsc --noEmit

# Run Production Build
npm run build
```
