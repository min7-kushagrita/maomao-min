# Implementation Plan - AI Virtual Try-On API Integration, Lookbook & Occasion Combos

Integrate cutting-edge AI Virtual Try-On capabilities and fashion styling tools into the **Pixel Fit** website. The plan addresses the dual-image try-on requirement (upload person image + garment image separately and generate a realistic composite try-on), adds a rich curated **Lookbook**, introduces an **Occasion-Specific Combination generator**, and provides an end-to-end integration architecture with API configurations.

---

## 1. Top Recommended AI Models & APIs for Virtual Try-On (Person + Garment)

Here are the industry-leading AI models and API services specifically designed for virtual try-on where a **person image** and a **garment image** are provided separately:

| Service / Model | Provider / Endpoint | Best For | Typical Pricing | Key Inputs & Format |
|---|---|---|---|---|
| **IDM-VTON** *(State of the Art)* | Hosted on [Replicate](https://replicate.com/cuuupid/idm-vton) (`cuuupid/idm-vton`) or [Segmind](https://www.segmind.com/models/idm-vton) | Photorealistic cloth draping, preserves body shape, skin tones, wrinkles, and folds | ~$0.02 - $0.05 / run (Replicate) or Segmind credits | `human_img`, `garm_img`, `garment_des`, `category` (`upper_body`, `lower_body`, `dresses`) |
| **Fashn.ai** | Direct API (`api.fashn.ai/v1/run`) | Commercial e-commerce virtual try-on, fast turnaround, background preserving | ~$0.04 - $0.075 / image | `model_image`, `garment_image`, `category` (`tops`, `bottoms`, `one-pieces`), `mode` (`balanced`/`quality`) |
| **Kolors Virtual Try-On** | Kuaishou / Replicate (`kwaivgi/kling-vton` / Kolors) | High fidelity texture transfer, complex patterns and logos | Pay-per-second GPU (~$0.03 / image) | `human_image`, `cloth_image`, `category` |
| **Segmind IDM-VTON** | Segmind REST API (`api.segmind.com/v1/idm-vton`) | Easiest zero-setup REST API, handles base64 directly | $0.012 / request | `human_img` (base64/url), `garm_img` (base64/url), `category` |

### Recommendation for this Project:
1. **Primary Choice**: **IDM-VTON (via Replicate or Segmind)**. It is the gold standard in academic and commercial benchmarks for maintaining accurate body posture and cloth alignment.
2. **Alternative**: **Fashn.ai**, which is explicitly optimized for fast fashion web apps.

---

## 2. Proposed Changes & Features to Integrate

### A. Quick Action Ribbon & Menus (`index.html`)
- Add **"✨ AI Try-On"** button in the top ribbon and under the **Image** / **File** menus.
- Add **"📖 Lookbook"** button in the ribbon and menus to browse trending pre-assembled outfits.
- Add **"🎯 Occasion"** selector dropdown or button to quickly generate outfits based on event type (Wedding, Interview, Party, Date Night, Casual, Gym, Beach).

### B. AI Try-On Studio Modal (`index.html`, `style.css`, `script.js`)
- **Dual Upload Station**:
  - **Slot 1 (Person Image)**: Drag-and-drop / file upload / take selfie with webcam / use active mannequin or current canvas snapshot / select from ready-to-test sample human models.
  - **Slot 2 (Garment Image)**: Drag-and-drop / file upload / pick from wardrobe tray / select sample tops, bottoms, or dresses.
- **Controls & Settings**:
  - Garment Type selector (`upper_body`, `lower_body`, `dresses`).
  - Provider Selector:
    - **Interactive Demo / Instant Simulation** (Works out of the box with zero setup for instant testing and preview).
    - **Replicate API (IDM-VTON)** (Live cloud inference).
    - **Segmind API (IDM-VTON)** (Live REST API).
    - **Fashn.ai API** (Live commercial API).
    - **Custom Backend URL** (For secure server-side proxy).
  - API Key setting drawer (saved securely in user's browser `localStorage`).
- **Generation & Live Progress**:
  - Animated progress bar with step-by-step status messages ("Segmenting garment...", "Aligning pose...", "Draping cloth...", "Synthesizing high-res texture...").
- **Result Viewer**:
  - Side-by-Side comparison or Before/After interactive slider.
  - **"Apply to Canvas"**: Immediately loads the generated model into the MS Paint canvas editor so the user can continue drawing, styling, adding hats/accessories.
  - **"Download Result"**: Export high-resolution PNG.

### C. Lookbook Modal & Engine (`index.html`, `style.css`, `script.js`)
- Curated collection of trendy outfits with high-vibe metadata:
  - *Cyber Y2K Rave*
  - *90s Grunge Garage*
  - *Harajuku Pastel Pop*
  - *Tokyo Streetwear*
  - *Vintage Academia*
  - *Cottagecore Picnic*
- Each Lookbook card displays:
  - Mini composite preview of the outfit.
  - Breakdown of garments used (Top, Bottom, Shoes, Accessories).
  - Style tags & color palette swatches.
  - **"Equip Look"** button (instantly dresses the canvas mannequin).
  - **"Send to AI Try-On"** button (transfers the outfit garments directly into the AI Studio).

### D. Occasion-Specific Outfit Generator (`index.html`, `script.js`)
- Dedicated occasion presets:
  - 💼 **Job Interview / Smart Casual** (Tailored flannel/blazer, dark trousers, classic shoes)
  - 🥂 **Cocktail Party / Night Out** (Statement tops, leather jackets, stylish boots)
  - ☕ **Casual Weekend / Coffee Date** (Relaxed tee, denim, sneakers, beanie)
  - 🏖️ **Beach / Summer Festival** (Crop tops, shorts, sun shades, sandals)
  - 🎸 **Rock Concert / Underground Rave** (Graphic tees, distressed bottoms, neon accessories)
  - 💍 **Wedding Celebration / Formal** (Dressed up coordinating palette)
- Instant generation algorithm that evaluates category compatibility, aesthetic tags, and color balance to generate an occasion-appropriate look.

### E. Step-by-Step API Integration & Backend Architecture (`docs` / helper files)
- Provide a lightweight **Node.js/Express** proxy server script (`server.js` or `api-proxy.js`) and **Python/FastAPI** snippet.
- This prevents exposing API keys in client-side code and solves CORS restrictions enforced by external APIs.

---

## 3. Verification Plan

### Automated / Syntax Check
- Verify `index.html` structure and modal bindings.
- Validate `script.js` for syntax errors using `node -c script.js` or equivalent.
- Ensure CSS in `style.css` maintains the nostalgic Windows 98 / Y2K aesthetic while presenting sleek modern UX.

### Manual Verification Flows
1. **AI Studio**:
   - Open AI Try-On Studio modal.
   - Upload or pick person image; upload or pick garment image.
   - Click "Generate Try-On" in Demo Mode -> Verify progress bar, generated result, and side-by-side view.
   - Test "Equip to Canvas" -> Verify the generated try-on appears on the canvas.
   - Test API key storage in localStorage.
2. **Lookbook**:
   - Open Lookbook -> Filter by aesthetic tags -> Click "Equip Look" -> Confirm all items load onto canvas accurately.
   - Click "Send to AI Try-On" -> Verify garment is loaded into AI studio.
3. **Occasion Generator**:
   - Select an occasion (e.g., "Party / Night Out") -> Click "Generate Occasion Fit" -> Verify matching coordinated clothes are equipped.
