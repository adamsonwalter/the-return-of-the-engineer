# AGENTS.md — Operational Briefing

## Project Identity

**Name:** The Return of the Engineer
**Status:** Interactive manuscript archive; React web app
**Brand:** Part of "The Nominal Man" ecosystem (Substack + Archive)
**Purpose:** Immersive, gated reader experience for paid Guild members

---

## Codebase Structure

```
the-return-of-the-engineer/
├── app.jsx                 # Main React component (single file)
├── README.md              # Brand architecture + feature overview
├── AGENTS.md              # This file
├── .git/                  # Git history + remote to GitHub
└── resources/
    ├── RISE_OF_THE_ENGINEER_FULL_MANUSCRIPT.pdf
    ├── FIELD_MANUAL_FOR_THE_REMNANT.pdf
    ├── LINCHPIN_OS_BATTLE_BRIEFING_2027.pdf
    ├── THE RETURN OF THE ENGINEER.pdf
    └── gemini.google.com-Gemini copy.pdf
```

---

## `app.jsx` — Architectural Overview

### **Constants**
```javascript
const apiKey = "";              // Runtime-provided Gemini API key
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const REMNANT_KNOWLEDGEBASE = {...};  // System prompt for Remnant persona
const VETO_MAP = {...};         // Nominal → Functional terminology mapping
```

### **Core Components**

| Component | Role | Props |
|-----------|------|-------|
| `VetoText` | Wraps text; applies strikethrough + replacement when `isFunctional=true` | `{ children, isFunctional }` |
| `GridTelemetry` | Displays simulated grid frequency (47.5–52.5 Hz) + system load | `{ isFunctional }` |
| `App` (default export) | Main component; orchestrates UI, state, Gemini calls | — |

### **State Management** (all in App component)

```javascript
const [isFunctional, setIsFunctional] = useState(false);       // VETO toggle
const [activeChapter, setActiveChapter] = useState(0);        // Current chapter ID (0–10)
const [isSidebarOpen, setIsSidebarOpen] = useState(false);    // Mobile menu
const [deconInput, setDeconInput] = useState("");             // Reality Deconstructor input
const [deconResult, setDeconResult] = useState("");           // Deconstructor output
const [isDeconLoading, setIsDeconLoading] = useState(false);  // Deconstructor loading state
const [chatInput, setChatInput] = useState("");               // NEURAL_LINK input
const [chatMessages, setChatMessages] = useState([]);         // Chat history
const [isChatLoading, setIsChatLoading] = useState(false);    // Chat loading state
const [isTtsLoading, setIsTtsLoading] = useState(false);      // VOCAL_SYNC loading state
```

### **Data Model: Chapters**

```javascript
const chapters = [
  {
    id: 0,
    title: "Preface: The End of the Hallucination",
    content: "The era of managing the narrative is dead..."  // Full narrative text
  },
  // ... 10 more chapters (IDs 1–10)
];
```

**Note:** Content is stored inline (no external CMS). Each chapter has a `title` and expanded `content` string.

### **Key Functions**

| Function | Purpose | API Dependency |
|----------|---------|-----------------|
| `fetchWithRetry()` | HTTP call with exponential backoff (5 retries) | None |
| `handleDeconstruct()` | Sends text to Gemini for "brutalist" deconstruction | Gemini |
| `handleChat()` | Sends message to Gemini (Remnant Engineer persona) | Gemini |
| `handleTts()` | Converts chapter text to audio via Gemini TTS; plays in browser | Gemini |
| `pcmToWav()` | Converts PCM base64 (from Gemini audio) to WAV blob | None |

### **UI Layout (Responsive)**

```
[HEADER: Logo | Grid Telemetry | VETO Toggle | Menu Button]

[MAIN:
  [SIDEBAR (desktop): System Sync status]
  [CONTENT: Title | Chapters | VetoText wrapping]
  [SIDEBAR (desktop): Spine Sync progress bar]
]

[FOOTER (mobile): Remnant_Node | Toolkit button]

[SIDEBAR (mobile modal): Navigation | Reality Deconstructor | NEURAL_LINK]
```

---

## API Integration (Optional)

### **When API Key Is Missing**
- Deconstructor: Shows "NO_API_KEY — Add a Gemini key to enable deconstruction."
- NEURAL_LINK: Shows "NO_API_KEY — Add a Gemini key to enable the Neural Link."
- VOCAL_SYNC: Silently disabled (console warning only)
- **Read-only mode:** All chapters, Veto toggle, Grid Telemetry, Spine Sync still fully functional

### **Gemini Endpoint Structure**

**Deconstruction request:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={apiKey}
Body: {
  contents: [{ parts: [{ text: deconInput }] }],
  systemInstruction: { parts: [{ text: REMNANT_KNOWLEDGEBASE + deconstruction prompt }] }
}
```

**Chat request:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={apiKey}
Body: {
  contents: [{ parts: [{ text: chatInput }] }],
  systemInstruction: { parts: [{ text: REMNANT_KNOWLEDGEBASE + concise prompt }] }
}
```

**TTS request:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={apiKey}
Body: {
  contents: [{ parts: [{ text: "Say in a deep industrial voice: {chapter text}" }] }],
  generationConfig: { responseModalities: ["AUDIO"], speechConfig: { ... } }
}
```

---

## Deployment Notes

### **Local Development**
```bash
# If you set up Vite (optional; not yet in repo)
npm install
npm run dev  # http://localhost:5173
```

### **Static Hosting**
The app is **pure React** (no backend). Can be deployed as:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Self-hosted on domain (e.g., archive.thenominalman.com)

**Required Environment:**
- Node 18+ (for build)
- Gemini API key (optional; app works without it)

---

## Style & Customization

### **Tailwind Classes in Use**
- Color palette: `bg-black`, `bg-zinc-*`, `text-orange-500`, `border-zinc-800`
- Animations: `animate-pulse`, `animate-scanline` (custom keyframe in inline `<style>`)
- Responsive: `hidden lg:block`, `lg:flex-row`, responsive text sizes (`text-sm` → `text-5xl`)

### **Custom Animation**
```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(800%); }
}
.animate-scanline { animation: scanline 8s linear infinite; }
```

### **Color Scheme**
- **Default:** Dark mode (bg-black, text-zinc-100)
- **Functional Mode (Veto On):** Slightly darker bg, orange accents glow
- **Active elements:** Orange `#ea580c`, blue `#3b82f6`

---

## What Agents Should Know

### **When Adding Features**
1. **Keep it in `app.jsx`** — Single-file architecture is intentional (immersive, self-contained, easier to version)
2. **Preserve narrative integrity** — Don't truncate or simplify chapter content; expand it
3. **Respect the Veto Map** — New nominal terms should map to functional equivalents
4. **Test without API key** — Ensure graceful degradation (read-only mode still works)
5. **Maintain terminal aesthetic** — Use `font-mono`, uppercase labels, zinc/orange palette

### **When Modifying Chapters**
- Edit the `content` property directly in the `chapters` array
- Use `<br />` for paragraph breaks if needed (JSX will handle it in prose wrapper)
- Test with Veto toggle ON to ensure VETO_MAP applies correctly

### **When Deploying**
1. Update GitHub repo name if domain changes (keep `the-return-of-the-engineer` as the canonical name)
2. Set `apiKey` env var at runtime (via `.env`, build config, or hosting platform)
3. Add `.gitignore` if any secrets are managed locally:
   ```
   .env
   .env.local
   node_modules/
   dist/
   ```

### **When Integrating with Substack**
- The app is **not embedded in Substack**; it's a **separate, gated platform** (e.g., `archive.thenominalman.com`)
- Substack CTA: *"Paid members: Access the full Archive experience at [domain]"*
- Authentication/paywall: Implement separately (could use third-party like Memberful or custom JWT)

---

## Git Workflow

**Remote:** `https://github.com/adamsonwalter/the-return-of-the-engineer`

**Commit Pattern:**
```
git add .
git commit -m "Descriptive message explaining changes"
git push origin main
```

**Branch Strategy:** Currently using `main` only (single-file, editorial process). If expanding, consider:
- `main` — production-ready
- `dev` — staging / feature integration
- Feature branches for major additions

---

## Known Limitations

1. **No CMS** — Chapters are hardcoded; use external CMS if frequent updates needed
2. **No Auth** — Paywall/gating logic not implemented (add separately)
3. **Inline Styling** — Some styles are inline JSX; could extract to CSS module if growing
4. **Single Component** — All state in one component; refactor if exceeding 1000 LOC
5. **No Tests** — No Jest/Vitest setup; consider adding if feature complexity grows

---

## Success Metrics

When agents work on this project, consider:
- ✅ Narrative integrity maintained (no lore contradictions)
- ✅ Veto mode toggles all nominal terms correctly
- ✅ App works in read-only mode (no API key)
- ✅ Responsive on mobile + desktop
- ✅ Gemini calls fail gracefully with helpful messages
- ✅ Git history is clean and commits are descriptive
