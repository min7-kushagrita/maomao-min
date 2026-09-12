/**
 * ============================================================================
 * PIXEL FIT — Y2K / MS PAINT VIRTUAL OUTFIT TRY-ON ENGINE
 * Pure Vanilla HTML5, CSS3, & Modern JavaScript (ES6)
 * ============================================================================
 */

/* ============================================================================
   1. 8-BIT SOUND SYNTHESIZER (Web Audio API)
   Zero external audio files required! 100% reliable, zero latency.
   ============================================================================ */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('pixelFit_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('pixelFit_muted', this.muted);
    return this.muted;
  }

  // Short crisp 8-bit UI button click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(750, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Rising blip when picking up / selecting item
  playPickup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Satisfying thud / snap when placing clothing item
  playDrop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Sparkling retro arcade arpeggio on Randomize
  playRandomize() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + index * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  // Camera shutter click + victory chime on Save
  playSave() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Shutter noise burst
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();

    // High bell chime
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, this.ctx.currentTime); // E6
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    }, 70);
  }

  // Downward slide on delete / remove
  playDelete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Authentic 8-bit camera mechanical shutter click & motor advance
  playShutter() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // 1. Shutter click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
    gain1.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start();
    osc1.stop(this.ctx.currentTime + 0.05);

    // 2. Mechanical motor advance sound
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.08);
      osc2.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.16);
      gain2.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(this.ctx.currentTime + 0.16);
    }, 60);
  }

  // Camera 3-2-1 countdown beep
  playCountdownBeep(pitch = 880) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
}

const Sound = new SoundEngine();

/* ============================================================================
   2. WARDROBE CATALOG (36+ Vector Pixel Art Items)
   Includes SVG pixel-block art with transparent backgrounds
   ============================================================================ */
const WARDROBE_ITEMS = [
  // --------------------------------------------------------------------------
  // TOPS
  // --------------------------------------------------------------------------
  {
    id: 'top_baby_tee',
    name: 'Angel Baby Tee',
    category: 'tops',
    tags: ['y2k', 'harajuku'],
    defaultX: 122,
    defaultY: 154,
    defaultW: 76,
    defaultH: 64,
    zIndex: 20,
    svg: `<svg viewBox="0 0 76 64" shape-rendering="crispEdges">
      <!-- Pink Baby Tee Body -->
      <rect x="18" y="8" width="40" height="48" fill="#ff66aa"/>
      <rect x="22" y="56" width="32" height="4" fill="#ff4090"/>
      <!-- Sleeves -->
      <rect x="6" y="8" width="14" height="24" fill="#ff66aa"/>
      <rect x="56" y="8" width="14" height="24" fill="#ff66aa"/>
      <rect x="6" y="30" width="14" height="4" fill="#ff4090"/>
      <rect x="56" y="30" width="14" height="4" fill="#ff4090"/>
      <!-- Collar -->
      <rect x="28" y="6" width="20" height="6" fill="#ffffff"/>
      <!-- Glitter "ANGEL" / Butterfly graphic -->
      <rect x="30" y="24" width="16" height="4" fill="#ffffff"/>
      <rect x="34" y="20" width="8" height="4" fill="#ffff00"/>
      <rect x="36" y="28" width="4" height="6" fill="#ffff00"/>
      <!-- Outline/Shadow -->
      <rect x="16" y="10" width="2" height="48" fill="#cc2277"/>
      <rect x="58" y="10" width="2" height="48" fill="#cc2277"/>
    </svg>`
  },
  {
    id: 'top_grunge_flannel',
    name: 'Grunge Plaid Flannel',
    category: 'tops',
    tags: ['grunge', 'streetwear'],
    defaultX: 114,
    defaultY: 148,
    defaultW: 92,
    defaultH: 82,
    zIndex: 22,
    svg: `<svg viewBox="0 0 92 82" shape-rendering="crispEdges">
      <!-- Red/Black Plaid Body -->
      <rect x="22" y="8" width="48" height="68" fill="#cc1122"/>
      <!-- Plaid grid stripes -->
      <rect x="22" y="24" width="48" height="4" fill="#111"/>
      <rect x="22" y="44" width="48" height="4" fill="#111"/>
      <rect x="22" y="62" width="48" height="4" fill="#111"/>
      <rect x="34" y="8" width="4" height="68" fill="#111"/>
      <rect x="54" y="8" width="4" height="68" fill="#111"/>
      <!-- Oversized Sleeves -->
      <rect x="6" y="8" width="18" height="52" fill="#cc1122"/>
      <rect x="6" y="26" width="18" height="4" fill="#111"/>
      <rect x="6" y="46" width="18" height="4" fill="#111"/>
      <rect x="68" y="8" width="18" height="52" fill="#cc1122"/>
      <rect x="68" y="26" width="18" height="4" fill="#111"/>
      <rect x="68" y="46" width="18" height="4" fill="#111"/>
      <!-- Collar & Buttons -->
      <rect x="34" y="4" width="24" height="8" fill="#222"/>
      <rect x="44" y="14" width="4" height="60" fill="#111"/>
      <circle cx="46" cy="22" r="1.5" fill="#fff"/>
      <circle cx="46" cy="36" r="1.5" fill="#fff"/>
      <circle cx="46" cy="50" r="1.5" fill="#fff"/>
    </svg>`
  },
  {
    id: 'top_cyber_hoodie',
    name: 'Cyber Reflective Hoodie',
    category: 'tops',
    tags: ['y2k', 'streetwear'],
    defaultX: 114,
    defaultY: 142,
    defaultW: 92,
    defaultH: 80,
    zIndex: 22,
    svg: `<svg viewBox="0 0 92 80" shape-rendering="crispEdges">
      <!-- Metallic Silver Body -->
      <rect x="20" y="10" width="52" height="66" fill="#a0a8b0"/>
      <!-- Neon Cyan Reflective Bands -->
      <rect x="20" y="32" width="52" height="6" fill="#00ffff"/>
      <rect x="20" y="58" width="52" height="6" fill="#00ffff"/>
      <!-- Hood -->
      <rect x="30" y="2" width="32" height="12" fill="#788088"/>
      <!-- Sleeves -->
      <rect x="4" y="12" width="18" height="54" fill="#a0a8b0"/>
      <rect x="70" y="12" width="18" height="54" fill="#a0a8b0"/>
      <rect x="4" y="32" width="18" height="6" fill="#00ffff"/>
      <rect x="70" y="32" width="18" height="6" fill="#00ffff"/>
      <!-- Front Kangaroo Pocket -->
      <rect x="28" y="48" width="36" height="20" fill="#788088"/>
      <!-- Drawstrings -->
      <rect x="38" y="14" width="2" height="18" fill="#00ffff"/>
      <rect x="52" y="14" width="2" height="18" fill="#00ffff"/>
    </svg>`
  },
  {
    id: 'top_striped_longsleeve',
    name: 'Goth Striped Longsleeve',
    category: 'tops',
    tags: ['grunge', 'streetwear'],
    defaultX: 116,
    defaultY: 150,
    defaultW: 88,
    defaultH: 74,
    zIndex: 20,
    svg: `<svg viewBox="0 0 88 74" shape-rendering="crispEdges">
      <!-- Striped Body -->
      <rect x="20" y="8" width="48" height="62" fill="#ffffff"/>
      <rect x="20" y="14" width="48" height="6" fill="#111111"/>
      <rect x="20" y="26" width="48" height="6" fill="#111111"/>
      <rect x="20" y="38" width="48" height="6" fill="#111111"/>
      <rect x="20" y="50" width="48" height="6" fill="#111111"/>
      <rect x="20" y="62" width="48" height="6" fill="#111111"/>
      <!-- Sleeves -->
      <rect x="6" y="8" width="16" height="60" fill="#ffffff"/>
      <rect x="66" y="8" width="16" height="60" fill="#ffffff"/>
      <rect x="6" y="14" width="16" height="6" fill="#111111"/>
      <rect x="66" y="14" width="16" height="6" fill="#111111"/>
      <rect x="6" y="26" width="16" height="6" fill="#111111"/>
      <rect x="66" y="26" width="16" height="6" fill="#111111"/>
      <rect x="6" y="38" width="16" height="6" fill="#111111"/>
      <rect x="66" y="38" width="16" height="6" fill="#111111"/>
      <rect x="6" y="50" width="16" height="6" fill="#111111"/>
      <rect x="66" y="50" width="16" height="6" fill="#111111"/>
    </svg>`
  },
  {
    id: 'top_halter_metallic',
    name: 'Glitter Halter Top',
    category: 'tops',
    tags: ['y2k'],
    defaultX: 126,
    defaultY: 154,
    defaultW: 68,
    defaultH: 58,
    zIndex: 20,
    svg: `<svg viewBox="0 0 68 58" shape-rendering="crispEdges">
      <!-- Neck strap -->
      <rect x="28" y="2" width="12" height="6" fill="#ff007f"/>
      <rect x="30" y="8" width="8" height="8" fill="#ff007f"/>
      <!-- Metallic cropped triangle shape -->
      <polygon points="12,24 56,24 44,52 24,52" fill="#ff007f"/>
      <polygon points="16,26 52,26 42,48 26,48" fill="#ff66b2"/>
      <!-- Sparkles -->
      <rect x="26" y="30" width="3" height="3" fill="#ffffff"/>
      <rect x="38" y="36" width="4" height="4" fill="#ffffff"/>
      <rect x="42" y="28" width="2" height="2" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'top_cottage_blouse',
    name: 'Cottagecore Puff Blouse',
    category: 'tops',
    tags: ['cottagecore'],
    defaultX: 118,
    defaultY: 152,
    defaultW: 84,
    defaultH: 66,
    zIndex: 20,
    svg: `<svg viewBox="0 0 84 66" shape-rendering="crispEdges">
      <!-- Cream Body -->
      <rect x="22" y="10" width="40" height="52" fill="#fff8e7"/>
      <!-- Puff Sleeves -->
      <circle cx="16" cy="22" r="14" fill="#fff8e7"/>
      <circle cx="68" cy="22" r="14" fill="#fff8e7"/>
      <!-- Lace Collar & Ribbon -->
      <rect x="26" y="6" width="32" height="8" fill="#ffffff"/>
      <polygon points="42,14 36,24 48,24" fill="#66bb6a"/>
      <!-- Floral micro dots -->
      <circle cx="30" cy="30" r="1.5" fill="#e91e63"/>
      <circle cx="50" cy="34" r="1.5" fill="#e91e63"/>
      <circle cx="36" cy="46" r="1.5" fill="#e91e63"/>
      <circle cx="46" cy="52" r="1.5" fill="#e91e63"/>
    </svg>`
  },
  {
    id: 'top_sport_track',
    name: 'Retro Sport Track Jacket',
    category: 'tops',
    tags: ['sporty', 'streetwear'],
    defaultX: 116,
    defaultY: 148,
    defaultW: 88,
    defaultH: 74,
    zIndex: 22,
    svg: `<svg viewBox="0 0 88 74" shape-rendering="crispEdges">
      <!-- Navy Body -->
      <rect x="20" y="8" width="48" height="62" fill="#001f54"/>
      <!-- White & Red Chevron stripe -->
      <polygon points="20,24 44,40 68,24 68,30 44,46 20,30" fill="#ffffff"/>
      <polygon points="20,30 44,46 68,30 68,34 44,50 20,34" fill="#ff3333"/>
      <!-- Sleeves -->
      <rect x="6" y="8" width="16" height="58" fill="#001f54"/>
      <rect x="66" y="8" width="16" height="58" fill="#001f54"/>
      <rect x="10" y="8" width="4" height="58" fill="#ffffff"/>
      <rect x="70" y="8" width="4" height="58" fill="#ffffff"/>
      <!-- Collar with zipper -->
      <rect x="34" y="4" width="20" height="8" fill="#001f54"/>
      <rect x="43" y="10" width="2" height="60" fill="#ffffff"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // BOTTOMS
  // --------------------------------------------------------------------------
  {
    id: 'bottom_cargo_pants',
    name: 'Y2K Wide Cargo Pants',
    category: 'bottoms',
    tags: ['streetwear', 'y2k'],
    defaultX: 118,
    defaultY: 236,
    defaultW: 84,
    defaultH: 154,
    zIndex: 15,
    svg: `<svg viewBox="0 0 84 154" shape-rendering="crispEdges">
      <!-- Khaki Green Cargo -->
      <rect x="12" y="6" width="60" height="34" fill="#606c38"/>
      <!-- Left Leg -->
      <rect x="10" y="36" width="30" height="114" fill="#606c38"/>
      <!-- Right Leg -->
      <rect x="44" y="36" width="30" height="114" fill="#606c38"/>
      <!-- Cargo side pockets with flap -->
      <rect x="4" y="64" width="12" height="26" fill="#4a5323"/>
      <rect x="4" y="60" width="14" height="6" fill="#383e18"/>
      <rect x="68" y="64" width="12" height="26" fill="#4a5323"/>
      <rect x="66" y="60" width="14" height="6" fill="#383e18"/>
      <!-- Hanging D-Ring Utility Straps -->
      <path d="M12 70 Q 2 100 12 120" stroke="#ff8800" stroke-width="2" fill="none"/>
      <!-- Seam & Belt -->
      <rect x="12" y="6" width="60" height="6" fill="#283618"/>
      <rect x="38" y="6" width="8" height="6" fill="#dda15e"/>
    </svg>`
  },
  {
    id: 'bottom_plaid_skirt',
    name: 'Punk Plaid Pleated Skirt',
    category: 'bottoms',
    tags: ['grunge', 'harajuku'],
    defaultX: 118,
    defaultY: 236,
    defaultW: 84,
    defaultH: 64,
    zIndex: 16,
    svg: `<svg viewBox="0 0 84 64" shape-rendering="crispEdges">
      <!-- Red Tartan Base -->
      <polygon points="22,6 62,6 74,60 10,60" fill="#cc1122"/>
      <!-- Pleats & Black Grid -->
      <rect x="20" y="18" width="44" height="4" fill="#111"/>
      <rect x="16" y="36" width="52" height="4" fill="#111"/>
      <line x1="26" y1="6" x2="20" y2="60" stroke="#111" stroke-width="3"/>
      <line x1="38" y1="6" x2="36" y2="60" stroke="#111" stroke-width="3"/>
      <line x1="48" y1="6" x2="50" y2="60" stroke="#111" stroke-width="3"/>
      <line x1="58" y1="6" x2="64" y2="60" stroke="#111" stroke-width="3"/>
      <!-- Punk Safety Pin & Chain -->
      <line x1="54" y1="20" x2="66" y2="34" stroke="#ffffff" stroke-width="2"/>
      <circle cx="54" cy="20" r="2" fill="#fff"/>
      <path d="M52 24 Q 60 40 68 32" stroke="#silver" stroke-width="1.5" fill="none"/>
    </svg>`
  },
  {
    id: 'bottom_flare_jeans',
    name: 'Low-Rise Flare Jeans',
    category: 'bottoms',
    tags: ['y2k'],
    defaultX: 118,
    defaultY: 242,
    defaultW: 84,
    defaultH: 154,
    zIndex: 15,
    svg: `<svg viewBox="0 0 84 154" shape-rendering="crispEdges">
      <!-- Bleach Wash Blue Denim -->
      <rect x="16" y="6" width="52" height="30" fill="#4a7c9b"/>
      <!-- Legs Flare Wide at Bottom -->
      <polygon points="16,34 38,34 32,154 4,154" fill="#4a7c9b"/>
      <polygon points="46,34 68,34 80,154 52,154" fill="#4a7c9b"/>
      <!-- Faded thigh wash -->
      <ellipse cx="24" cy="74" rx="6" ry="24" fill="#7faecc"/>
      <ellipse cx="60" cy="74" rx="6" ry="24" fill="#7faecc"/>
      <!-- Rhinestone Sparkle Belt -->
      <rect x="16" y="6" width="52" height="6" fill="#e0e0e0"/>
      <rect x="36" y="4" width="12" height="10" fill="#ffff99"/>
      <!-- Whisker lines -->
      <line x1="18" y1="20" x2="34" y2="28" stroke="#335973" stroke-width="2"/>
      <line x1="66" y1="20" x2="50" y2="28" stroke="#335973" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'bottom_cyber_parachute',
    name: 'Cyber Parachute Pants',
    category: 'bottoms',
    tags: ['y2k', 'streetwear'],
    defaultX: 116,
    defaultY: 236,
    defaultW: 88,
    defaultH: 154,
    zIndex: 15,
    svg: `<svg viewBox="0 0 88 154" shape-rendering="crispEdges">
      <!-- Baggy Black Nylon -->
      <rect x="14" y="6" width="60" height="34" fill="#151515"/>
      <polygon points="14,34 40,34 42,148 6,148" fill="#151515"/>
      <polygon points="48,34 74,34 82,148 46,148" fill="#151515"/>
      <!-- Neon Lime Piping Stripes -->
      <line x1="10" y1="36" x2="8" y2="148" stroke="#39ff14" stroke-width="3"/>
      <line x1="78" y1="36" x2="80" y2="148" stroke="#39ff14" stroke-width="3"/>
      <!-- Toggle Cinch Bungees at Ankles -->
      <rect x="4" y="146" width="10" height="4" fill="#39ff14"/>
      <rect x="74" y="146" width="10" height="4" fill="#39ff14"/>
    </svg>`
  },
  {
    id: 'bottom_track_pants',
    name: 'Sport Tearaway Pants',
    category: 'bottoms',
    tags: ['sporty', 'streetwear'],
    defaultX: 118,
    defaultY: 236,
    defaultW: 84,
    defaultH: 154,
    zIndex: 15,
    svg: `<svg viewBox="0 0 84 154" shape-rendering="crispEdges">
      <!-- Red Sports Fabric -->
      <rect x="14" y="6" width="56" height="32" fill="#d90429"/>
      <rect x="12" y="34" width="28" height="118" fill="#d90429"/>
      <rect x="44" y="34" width="28" height="118" fill="#d90429"/>
      <!-- White Side Strip with Snap Buttons -->
      <rect x="12" y="6" width="6" height="146" fill="#ffffff"/>
      <rect x="66" y="6" width="6" height="146" fill="#ffffff"/>
      <circle cx="15" cy="40" r="1.5" fill="#000"/>
      <circle cx="15" cy="65" r="1.5" fill="#000"/>
      <circle cx="15" cy="90" r="1.5" fill="#000"/>
      <circle cx="15" cy="115" r="1.5" fill="#000"/>
      <circle cx="15" cy="140" r="1.5" fill="#000"/>
      <circle cx="69" cy="40" r="1.5" fill="#000"/>
      <circle cx="69" cy="65" r="1.5" fill="#000"/>
      <circle cx="69" cy="90" r="1.5" fill="#000"/>
      <circle cx="69" cy="115" r="1.5" fill="#000"/>
      <circle cx="69" cy="140" r="1.5" fill="#000"/>
    </svg>`
  },
  {
    id: 'bottom_cottage_skirt',
    name: 'Tiered Cottage Skirt',
    category: 'bottoms',
    tags: ['cottagecore'],
    defaultX: 114,
    defaultY: 236,
    defaultW: 92,
    defaultH: 120,
    zIndex: 16,
    svg: `<svg viewBox="0 0 92 120" shape-rendering="crispEdges">
      <!-- Tier 1 -->
      <polygon points="26,6 66,6 74,42 18,42" fill="#f4f1de"/>
      <!-- Tier 2 -->
      <polygon points="18,40 74,40 82,80 10,80" fill="#e07a5f"/>
      <!-- Tier 3 with lace -->
      <polygon points="10,78 82,78 90,116 2,116" fill="#f4f1de"/>
      <!-- Scalloped Lace Edge -->
      <circle cx="8" cy="116" r="4" fill="#ffffff"/>
      <circle cx="16" cy="116" r="4" fill="#ffffff"/>
      <circle cx="24" cy="116" r="4" fill="#ffffff"/>
      <circle cx="32" cy="116" r="4" fill="#ffffff"/>
      <circle cx="40" cy="116" r="4" fill="#ffffff"/>
      <circle cx="48" cy="116" r="4" fill="#ffffff"/>
      <circle cx="56" cy="116" r="4" fill="#ffffff"/>
      <circle cx="64" cy="116" r="4" fill="#ffffff"/>
      <circle cx="72" cy="116" r="4" fill="#ffffff"/>
      <circle cx="80" cy="116" r="4" fill="#ffffff"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // SHOES
  // --------------------------------------------------------------------------
  {
    id: 'shoes_chunky_sneakers',
    name: '90s Chunky Platform Kicks',
    category: 'shoes',
    tags: ['streetwear', 'sporty', 'y2k'],
    defaultX: 114,
    defaultY: 388,
    defaultW: 92,
    defaultH: 48,
    zIndex: 18,
    svg: `<svg viewBox="0 0 92 48" shape-rendering="crispEdges">
      <!-- Left Sneaker -->
      <rect x="6" y="10" width="36" height="24" fill="#ffffff"/>
      <rect x="2" y="32" width="42" height="14" fill="#333333"/>
      <rect x="2" y="42" width="42" height="4" fill="#00ffff"/>
      <rect x="8" y="18" width="16" height="4" fill="#ff007f"/>
      <!-- Right Sneaker -->
      <rect x="50" y="10" width="36" height="24" fill="#ffffff"/>
      <rect x="48" y="32" width="42" height="14" fill="#333333"/>
      <rect x="48" y="42" width="42" height="4" fill="#00ffff"/>
      <rect x="68" y="18" width="16" height="4" fill="#ff007f"/>
    </svg>`
  },
  {
    id: 'shoes_combat_boots',
    name: 'Platform Combat Boots',
    category: 'shoes',
    tags: ['grunge', 'y2k'],
    defaultX: 114,
    defaultY: 374,
    defaultW: 92,
    defaultH: 62,
    zIndex: 18,
    svg: `<svg viewBox="0 0 92 62" shape-rendering="crispEdges">
      <!-- Left Boot Shaft & Sole -->
      <rect x="10" y="4" width="26" height="38" fill="#151515"/>
      <rect x="6" y="38" width="36" height="22" fill="#050505"/>
      <!-- Tread Teeth -->
      <rect x="6" y="58" width="6" height="3" fill="#333"/>
      <rect x="16" y="58" width="6" height="3" fill="#333"/>
      <rect x="26" y="58" width="6" height="3" fill="#333"/>
      <rect x="36" y="58" width="6" height="3" fill="#333"/>
      <!-- Buckles & Eyelets -->
      <rect x="14" y="12" width="18" height="3" fill="#silver"/>
      <rect x="12" y="24" width="22" height="3" fill="#silver"/>

      <!-- Right Boot Shaft & Sole -->
      <rect x="56" y="4" width="26" height="38" fill="#151515"/>
      <rect x="50" y="38" width="36" height="22" fill="#050505"/>
      <rect x="50" y="58" width="6" height="3" fill="#333"/>
      <rect x="60" y="58" width="6" height="3" fill="#333"/>
      <rect x="70" y="58" width="6" height="3" fill="#333"/>
      <rect x="80" y="58" width="6" height="3" fill="#333"/>
      <rect x="60" y="12" width="18" height="3" fill="#silver"/>
      <rect x="58" y="24" width="22" height="3" fill="#silver"/>
    </svg>`
  },
  {
    id: 'shoes_cyber_glow',
    name: 'Cyber Rave Platform Boots',
    category: 'shoes',
    tags: ['y2k'],
    defaultX: 114,
    defaultY: 374,
    defaultW: 92,
    defaultH: 62,
    zIndex: 18,
    svg: `<svg viewBox="0 0 92 62" shape-rendering="crispEdges">
      <!-- White Leather Body -->
      <rect x="10" y="4" width="26" height="38" fill="#f0f0f0"/>
      <rect x="6" y="38" width="36" height="14" fill="#e0e0e0"/>
      <!-- Glowing LED Platform Sole -->
      <rect x="4" y="50" width="40" height="10" fill="#39ff14"/>
      <!-- Right Boot -->
      <rect x="56" y="4" width="26" height="38" fill="#f0f0f0"/>
      <rect x="50" y="38" width="36" height="14" fill="#e0e0e0"/>
      <rect x="48" y="50" width="40" height="10" fill="#39ff14"/>
      <!-- Cyber Neon Straps -->
      <rect x="8" y="18" width="28" height="4" fill="#00ffff"/>
      <rect x="54" y="18" width="28" height="4" fill="#00ffff"/>
    </svg>`
  },
  {
    id: 'shoes_mary_janes',
    name: 'Platform Mary Janes & Socks',
    category: 'shoes',
    tags: ['harajuku', 'cottagecore'],
    defaultX: 114,
    defaultY: 382,
    defaultW: 92,
    defaultH: 54,
    zIndex: 18,
    svg: `<svg viewBox="0 0 92 54" shape-rendering="crispEdges">
      <!-- White Ruffle Socks -->
      <rect x="12" y="2" width="22" height="24" fill="#ffffff"/>
      <rect x="58" y="2" width="22" height="24" fill="#ffffff"/>
      <rect x="10" y="2" width="26" height="4" fill="#ffc0cb"/>
      <rect x="56" y="2" width="26" height="4" fill="#ffc0cb"/>
      <!-- Glossy Black Shoes -->
      <rect x="6" y="24" width="34" height="18" fill="#111111"/>
      <rect x="4" y="40" width="38" height="12" fill="#222222"/>
      <rect x="52" y="24" width="34" height="18" fill="#111111"/>
      <rect x="50" y="40" width="38" height="12" fill="#222222"/>
      <!-- Strap & Heart Buckle -->
      <rect x="12" y="28" width="22" height="3" fill="#fff"/>
      <rect x="58" y="28" width="22" height="3" fill="#fff"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // OUTERWEAR
  // --------------------------------------------------------------------------
  {
    id: 'outer_silver_puffer',
    name: 'Metallic Cropped Puffer',
    category: 'outerwear',
    tags: ['y2k', 'streetwear'],
    defaultX: 108,
    defaultY: 138,
    defaultW: 104,
    defaultH: 76,
    zIndex: 25,
    svg: `<svg viewBox="0 0 104 76" shape-rendering="crispEdges">
      <!-- Silver Metallic Puffy Body -->
      <rect x="22" y="8" width="60" height="52" fill="#cfd8dc"/>
      <rect x="22" y="24" width="60" height="3" fill="#90a4ae"/>
      <rect x="22" y="40" width="60" height="3" fill="#90a4ae"/>
      <!-- High Stand Collar -->
      <rect x="34" y="2" width="36" height="10" fill="#90a4ae"/>
      <!-- Ultra Puffy Sleeves -->
      <circle cx="16" cy="30" r="16" fill="#cfd8dc"/>
      <circle cx="88" cy="30" r="16" fill="#cfd8dc"/>
      <rect x="4" y="30" width="24" height="32" fill="#b0bec5"/>
      <rect x="76" y="30" width="24" height="32" fill="#b0bec5"/>
      <!-- Chunky Black Zipper -->
      <rect x="50" y="8" width="4" height="52" fill="#263238"/>
    </svg>`
  },
  {
    id: 'outer_fuzzy_cardigan',
    name: 'Pastel Fuzzy Cardigan',
    category: 'outerwear',
    tags: ['harajuku', 'cottagecore'],
    defaultX: 110,
    defaultY: 144,
    defaultW: 100,
    defaultH: 84,
    zIndex: 25,
    svg: `<svg viewBox="0 0 100 84" shape-rendering="crispEdges">
      <!-- Lavender Fuzzy Knit -->
      <rect x="20" y="8" width="60" height="68" fill="#d1c4e9"/>
      <!-- Open front showing underlayer -->
      <polygon points="50,8 36,76 64,76" fill="rgba(255,255,255,0.01)"/>
      <!-- Sleeves -->
      <rect x="4" y="8" width="18" height="66" fill="#d1c4e9"/>
      <rect x="78" y="8" width="18" height="66" fill="#d1c4e9"/>
      <!-- Daisy Buttons -->
      <circle cx="38" cy="34" r="3" fill="#fff"/>
      <circle cx="38" cy="34" r="1" fill="#ffeb3b"/>
      <circle cx="38" cy="54" r="3" fill="#fff"/>
      <circle cx="38" cy="54" r="1" fill="#ffeb3b"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // ACCESSORIES
  // --------------------------------------------------------------------------
  {
    id: 'acc_sunglasses_pink',
    name: 'Tinted Rimless Sunglasses',
    category: 'accessories',
    tags: ['y2k'],
    defaultX: 136,
    defaultY: 96,
    defaultW: 48,
    defaultH: 16,
    zIndex: 35,
    svg: `<svg viewBox="0 0 48 16" shape-rendering="crispEdges">
      <!-- Tinted Rose Lenses -->
      <rect x="4" y="2" width="18" height="10" fill="rgba(255, 20, 147, 0.75)" stroke="#silver" stroke-width="1"/>
      <rect x="26" y="2" width="18" height="10" fill="rgba(255, 20, 147, 0.75)" stroke="#silver" stroke-width="1"/>
      <!-- Gold/Silver bridge & temples -->
      <rect x="22" y="4" width="4" height="2" fill="#ffd700"/>
      <rect x="0" y="4" width="4" height="2" fill="#ffd700"/>
      <rect x="44" y="4" width="4" height="2" fill="#ffd700"/>
      <!-- Glint -->
      <rect x="6" y="4" width="3" height="3" fill="#ffffff"/>
      <rect x="28" y="4" width="3" height="3" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'acc_choker_heart',
    name: 'Beaded Tattoo Choker',
    category: 'accessories',
    tags: ['y2k', 'grunge'],
    defaultX: 142,
    defaultY: 132,
    defaultW: 36,
    defaultH: 14,
    zIndex: 35,
    svg: `<svg viewBox="0 0 36 14" shape-rendering="crispEdges">
      <!-- Elastic Weave Pattern -->
      <rect x="4" y="2" width="28" height="4" fill="#111111"/>
      <polygon points="6,2 10,6 14,2 18,6 22,2 26,6 30,2" stroke="#444" stroke-width="1" fill="none"/>
      <!-- Dangling Silver Heart -->
      <polygon points="18,6 14,10 18,14 22,10" fill="#e0e0e0"/>
    </svg>`
  },
  {
    id: 'acc_sling_bag',
    name: 'Techwear Sling Bag',
    category: 'accessories',
    tags: ['streetwear', 'y2k'],
    defaultX: 114,
    defaultY: 182,
    defaultW: 78,
    defaultH: 70,
    zIndex: 32,
    svg: `<svg viewBox="0 0 78 70" shape-rendering="crispEdges">
      <!-- Crossbody Diagonal Strap -->
      <line x1="68" y1="2" x2="16" y2="58" stroke="#111" stroke-width="6"/>
      <!-- Orange / Black Utility Pouch -->
      <rect x="18" y="26" width="38" height="34" fill="#ff5500"/>
      <rect x="18" y="26" width="38" height="10" fill="#111111"/>
      <rect x="22" y="42" width="30" height="14" fill="#333333"/>
      <!-- Carabiner & Quick Release Buckle -->
      <rect x="48" y="16" width="6" height="8" fill="#ffff00"/>
    </svg>`
  },
  {
    id: 'acc_cd_walkman',
    name: 'Retro CD Walkman & Phones',
    category: 'accessories',
    tags: ['y2k', 'grunge'],
    defaultX: 134,
    defaultY: 82,
    defaultW: 52,
    defaultH: 50,
    zIndex: 36,
    svg: `<svg viewBox="0 0 52 50" shape-rendering="crispEdges">
      <!-- Metal Headband -->
      <path d="M8 30 Q 26 4 44 30" stroke="#cccccc" stroke-width="2" fill="none"/>
      <!-- Orange Foam Ear Cushions -->
      <rect x="4" y="26" width="8" height="14" fill="#ff6600"/>
      <rect x="40" y="26" width="8" height="14" fill="#ff6600"/>
      <!-- Wire leading down -->
      <path d="M8 38 Q 4 48 16 48" stroke="#333" stroke-width="1.5" fill="none"/>
    </svg>`
  },
  {
    id: 'acc_tamagotchi',
    name: 'Tamagotchi Keychain',
    category: 'accessories',
    tags: ['y2k', 'harajuku'],
    defaultX: 172,
    defaultY: 250,
    defaultW: 24,
    defaultH: 32,
    zIndex: 36,
    svg: `<svg viewBox="0 0 24 32" shape-rendering="crispEdges">
      <!-- Chain -->
      <line x1="12" y1="2" x2="12" y2="8" stroke="#silver" stroke-width="2"/>
      <!-- Egg Shape Body -->
      <ellipse cx="12" cy="18" rx="10" ry="12" fill="#00ffff"/>
      <!-- LCD Screen -->
      <rect x="6" y="12" width="12" height="10" fill="#a8d5ba"/>
      <!-- Pixel Pet inside -->
      <rect x="10" y="15" width="4" height="4" fill="#000"/>
      <!-- 3 Buttons -->
      <circle cx="7" cy="25" r="1.5" fill="#ffff00"/>
      <circle cx="12" cy="26" r="1.5" fill="#ffff00"/>
      <circle cx="17" cy="25" r="1.5" fill="#ffff00"/>
    </svg>`
  },
  {
    id: 'acc_fuzzy_bucket_hat',
    name: 'Fuzzy Leopard Bucket Hat',
    category: 'accessories',
    tags: ['y2k', 'streetwear'],
    defaultX: 126,
    defaultY: 48,
    defaultW: 68,
    defaultH: 36,
    zIndex: 38,
    svg: `<svg viewBox="0 0 68 36" shape-rendering="crispEdges">
      <!-- Crown -->
      <polygon points="16,16 52,16 48,4 20,4" fill="#f4a261"/>
      <!-- Brim -->
      <polygon points="4,32 64,32 52,16 16,16" fill="#e76f51"/>
      <!-- Leopard Spots -->
      <rect x="24" y="8" width="4" height="3" fill="#264653"/>
      <rect x="36" y="6" width="5" height="4" fill="#264653"/>
      <rect x="42" y="11" width="3" height="3" fill="#264653"/>
      <rect x="20" y="22" width="5" height="4" fill="#264653"/>
      <rect x="38" y="24" width="6" height="4" fill="#264653"/>
      <rect x="50" y="22" width="4" height="3" fill="#264653"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // HAIR
  // --------------------------------------------------------------------------
  {
    id: 'hair_frosted_tips',
    name: 'Spiky Frosted Tips',
    category: 'hair',
    tags: ['y2k', 'grunge'],
    defaultX: 130,
    defaultY: 52,
    defaultW: 60,
    defaultH: 48,
    zIndex: 28,
    svg: `<svg viewBox="0 0 60 48" shape-rendering="crispEdges">
      <!-- Base Brunette -->
      <polygon points="12,38 48,38 52,16 8,16" fill="#3e2723"/>
      <!-- Spikes with Blonde Frosted Tips -->
      <polygon points="10,20 14,2 18,20" fill="#3e2723"/>
      <polygon points="12,8 14,2 16,8" fill="#fff59d"/>

      <polygon points="18,18 24,0 30,18" fill="#3e2723"/>
      <polygon points="22,6 24,0 26,6" fill="#fff59d"/>

      <polygon points="30,18 36,1 42,18" fill="#3e2723"/>
      <polygon points="34,7 36,1 38,7" fill="#fff59d"/>

      <polygon points="42,20 48,4 52,20" fill="#3e2723"/>
      <polygon points="46,10 48,4 50,10" fill="#fff59d"/>
    </svg>`
  },
  {
    id: 'hair_space_buns',
    name: 'Neon Pink Space Buns',
    category: 'hair',
    tags: ['y2k', 'harajuku'],
    defaultX: 122,
    defaultY: 48,
    defaultW: 76,
    defaultH: 64,
    zIndex: 28,
    svg: `<svg viewBox="0 0 76 64" shape-rendering="crispEdges">
      <!-- Twin High Puffs/Buns -->
      <circle cx="16" cy="18" r="14" fill="#ff007f"/>
      <circle cx="60" cy="18" r="14" fill="#ff007f"/>
      <circle cx="14" cy="16" r="6" fill="#ff66b2"/>
      <circle cx="58" cy="16" r="6" fill="#ff66b2"/>
      <!-- Crown / Bangs -->
      <rect x="22" y="22" width="32" height="14" fill="#ff007f"/>
      <polygon points="22,34 26,44 32,34 38,44 44,34 50,44 54,34" fill="#ff007f"/>
      <!-- Face Framing Long Strands/Tendrils -->
      <rect x="18" y="28" width="4" height="34" fill="#ff007f"/>
      <rect x="54" y="28" width="4" height="34" fill="#ff007f"/>
    </svg>`
  },
  {
    id: 'hair_y2k_bob',
    name: 'Face-Framing Bob & Clips',
    category: 'hair',
    tags: ['y2k', 'grunge'],
    defaultX: 126,
    defaultY: 58,
    defaultW: 68,
    defaultH: 62,
    zIndex: 28,
    svg: `<svg viewBox="0 0 68 62" shape-rendering="crispEdges">
      <!-- Jet Black Sleek Bob with flipped ends -->
      <polygon points="16,14 52,14 62,48 54,48 48,22 20,22 14,48 6,48" fill="#111111"/>
      <rect x="20" y="10" width="28" height="16" fill="#111111"/>
      <!-- Highlights / Sheen -->
      <rect x="24" y="14" width="20" height="3" fill="#444444"/>
      <!-- Colored Butterfly Snap Clips -->
      <rect x="14" y="18" width="6" height="5" fill="#00ffff"/>
      <rect x="48" y="18" width="6" height="5" fill="#ffeb3b"/>
    </svg>`
  },
  {
    id: 'hair_grunge_shag',
    name: 'Crimson Red Grunge Shag',
    category: 'hair',
    tags: ['grunge'],
    defaultX: 122,
    defaultY: 56,
    defaultW: 76,
    defaultH: 74,
    zIndex: 28,
    svg: `<svg viewBox="0 0 76 74" shape-rendering="crispEdges">
      <!-- Layered Mullet / Shag -->
      <polygon points="20,12 56,12 66,68 54,68 48,26 28,26 22,68 10,68" fill="#990011"/>
      <rect x="22" y="8" width="32" height="20" fill="#990011"/>
      <polygon points="14,14 26,4 38,14 50,4 62,14" fill="#b3001e"/>
      <rect x="26" y="24" width="24" height="8" fill="#b3001e"/>
    </svg>`
  },
  {
    id: 'hair_cottage_braids',
    name: 'Pastel Braids & Flowers',
    category: 'hair',
    tags: ['cottagecore'],
    defaultX: 122,
    defaultY: 56,
    defaultW: 76,
    defaultH: 84,
    zIndex: 28,
    svg: `<svg viewBox="0 0 76 84" shape-rendering="crispEdges">
      <!-- Honey Blonde Soft Bangs -->
      <rect x="20" y="8" width="36" height="22" fill="#d4a373"/>
      <!-- Long Side Braids -->
      <!-- Left Braid -->
      <rect x="12" y="26" width="10" height="56" fill="#d4a373"/>
      <circle cx="17" cy="34" r="5" fill="#c38e5c"/>
      <circle cx="17" cy="46" r="5" fill="#c38e5c"/>
      <circle cx="17" cy="58" r="5" fill="#c38e5c"/>
      <circle cx="17" cy="70" r="5" fill="#c38e5c"/>
      <circle cx="17" cy="80" r="3" fill="#ffb703"/>
      <!-- Right Braid -->
      <rect x="54" y="26" width="10" height="56" fill="#d4a373"/>
      <circle cx="59" cy="34" r="5" fill="#c38e5c"/>
      <circle cx="59" cy="46" r="5" fill="#c38e5c"/>
      <circle cx="59" cy="58" r="5" fill="#c38e5c"/>
      <circle cx="59" cy="70" r="5" fill="#c38e5c"/>
      <circle cx="59" cy="80" r="3" fill="#ffb703"/>
      <!-- Flower Clips -->
      <circle cx="24" cy="18" r="3" fill="#ffffff"/>
      <circle cx="24" cy="18" r="1" fill="#e91e63"/>
      <circle cx="52" cy="18" r="3" fill="#ffffff"/>
      <circle cx="52" cy="18" r="1" fill="#e91e63"/>
    </svg>`
  },

  // --------------------------------------------------------------------------
  // PETS & Y2K POP ART COMPANIONS
  // --------------------------------------------------------------------------
  {
    id: 'pet_cyber_cat',
    name: 'Cyber Hologram Kitty',
    category: 'pets',
    tags: ['y2k', 'harajuku'],
    defaultX: 218,
    defaultY: 340,
    defaultW: 52,
    defaultH: 56,
    zIndex: 40,
    svg: `<svg viewBox="0 0 52 56" shape-rendering="crispEdges">
      <!-- Neon Purple Pixel Cat -->
      <!-- Ears -->
      <polygon points="6,4 16,4 11,18" fill="#9b30ff"/>
      <polygon points="36,4 46,4 41,18" fill="#9b30ff"/>
      <!-- Head -->
      <rect x="10" y="14" width="32" height="22" fill="#bf55ec"/>
      <!-- Glow Eyes -->
      <rect x="16" y="20" width="4" height="4" fill="#00ffff"/>
      <rect x="32" y="20" width="4" height="4" fill="#00ffff"/>
      <!-- Whiskers -->
      <line x1="4" y1="24" x2="10" y2="24" stroke="#00ffff" stroke-width="1.5"/>
      <line x1="42" y1="24" x2="48" y2="24" stroke="#00ffff" stroke-width="1.5"/>
      <!-- Body & Tail -->
      <rect x="14" y="34" width="24" height="18" fill="#9b30ff"/>
      <rect x="16" y="50" width="6" height="4" fill="#ffffff"/>
      <rect x="30" y="50" width="6" height="4" fill="#ffffff"/>
      <path d="M38 42 Q 48 30 46 22" stroke="#00ffff" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    id: 'pet_retro_robodog',
    name: 'Robo-Pup 2000',
    category: 'pets',
    tags: ['y2k', 'streetwear'],
    defaultX: 52,
    defaultY: 340,
    defaultW: 58,
    defaultH: 52,
    zIndex: 40,
    svg: `<svg viewBox="0 0 58 52" shape-rendering="crispEdges">
      <!-- Chrome Metallic Dog -->
      <rect x="12" y="10" width="22" height="18" fill="#b0bec5"/>
      <!-- Visor Eye Display -->
      <rect x="14" y="14" width="18" height="6" fill="#ff0055"/>
      <!-- Ears -->
      <rect x="6" y="12" width="6" height="14" fill="#78909c"/>
      <!-- Body -->
      <rect x="26" y="18" width="24" height="20" fill="#90a4ae"/>
      <!-- Robotic Joint Legs -->
      <rect x="28" y="38" width="5" height="12" fill="#546e7a"/>
      <rect x="42" y="38" width="5" height="12" fill="#546e7a"/>
      <!-- Spring Tail with Red Ball -->
      <line x1="50" y1="20" x2="56" y2="12" stroke="#37474f" stroke-width="2"/>
      <circle cx="56" cy="12" r="3" fill="#ff0000"/>
    </svg>`
  },
  {
    id: 'pet_chibi_alien',
    name: 'Floating Alien Pal',
    category: 'pets',
    tags: ['y2k'],
    defaultX: 62,
    defaultY: 100,
    defaultW: 46,
    defaultH: 52,
    zIndex: 40,
    svg: `<svg viewBox="0 0 46 52" shape-rendering="crispEdges">
      <!-- Glow Aura -->
      <circle cx="23" cy="26" r="22" fill="rgba(57, 255, 20, 0.2)"/>
      <!-- Alien Head -->
      <polygon points="23,6 40,24 23,42 6,24" fill="#39ff14"/>
      <!-- Big Black Glossy Eyes -->
      <polygon points="12,18 20,16 18,26 10,24" fill="#000000"/>
      <polygon points="34,18 26,16 28,26 36,24" fill="#000000"/>
      <circle cx="16" cy="19" r="1.5" fill="#fff"/>
      <circle cx="30" cy="19" r="1.5" fill="#fff"/>
      <!-- Little Antenna -->
      <line x1="23" y1="6" x2="23" y2="1" stroke="#39ff14" stroke-width="2"/>
      <circle cx="23" cy="1" r="2.5" fill="#ffff00"/>
    </svg>`
  }
];

// Load persisted custom user items from localStorage
try {
  const savedCustomItems = JSON.parse(localStorage.getItem('pixelFit_customItems') || '[]');
  savedCustomItems.forEach(ci => {
    if (!WARDROBE_ITEMS.some(item => item.id === ci.id)) {
      WARDROBE_ITEMS.push(ci);
    }
  });
} catch (e) {
  console.warn('Could not load custom wardrobe items:', e);
}

/* ============================================================================
   3. CANVAS ENGINE & DIRECT INTERACTION
   Manages clothing layers, selection handles, resizing, rotating, and nudging
   ============================================================================ */
class CanvasEngine {
  constructor() {
    this.container = document.getElementById('placedItemsContainer');
    this.frame = document.getElementById('canvasFrame');
    this.items = []; // Placed items state
    this.selectedItemId = null;
    this.nextInstanceId = 1;
    this.activePointerAction = null; // 'drag', 'resize', 'rotate'
    this.pointerStart = { x: 0, y: 0 };
    this.itemStartProps = null;

    this.undoStack = [];
    this.redoStack = [];

    // Custom Photo Model & Face Selfie State
    this.customModelImage = null;
    this.customModelMode = 'photo'; // 'photo', 'mannequin', 'both'
    this.mannequinFaceImage = null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Canvas container pointer events
    this.container.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', () => this.handlePointerUp());

    // Click outside canvas deselects active item
    this.frame.addEventListener('pointerdown', (e) => {
      if (e.target === this.frame || e.target.id === 'canvasBgLayer' || e.target.id === 'paintCanvasOverlay') {
        if (AppUI.currentTool === 'select' || AppUI.currentTool === 'free-select') {
          this.deselectAll();
        }
      }
    });

    // Keyboard arrow nudging & Delete key
    window.addEventListener('keydown', (e) => {
      if (!this.selectedItemId) return;
      // Prevent scrolling when using arrow keys on canvas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }

      const item = this.getItem(this.selectedItemId);
      if (!item) return;

      const step = e.shiftKey ? 10 : 1;

      if (e.key === 'ArrowLeft') {
        item.x -= step;
        this.updateItemDOM(item);
      } else if (e.key === 'ArrowRight') {
        item.x += step;
        this.updateItemDOM(item);
      } else if (e.key === 'ArrowUp') {
        item.y -= step;
        this.updateItemDOM(item);
      } else if (e.key === 'ArrowDown') {
        item.y += step;
        this.updateItemDOM(item);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        this.removeItem(this.selectedItemId);
      }
    });

    // HTML5 Drag and drop onto canvas
    this.frame.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    this.frame.addEventListener('drop', (e) => {
      e.preventDefault();
      // Direct image file drop from computer onto canvas
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/') && window.Media) {
          window.Media.loadLocalFile(file);
          return;
        }
      }
      const itemId = e.dataTransfer.getData('text/plain');
      if (itemId) {
        const rect = this.frame.getBoundingClientRect();
        const dropX = e.clientX - rect.left - 40;
        const dropY = e.clientY - rect.top - 40;
        this.addItemById(itemId, dropX, dropY);
      }
    });
  }

  // Save current state for undo
  pushHistory() {
    const snapshot = JSON.stringify(this.items);
    this.undoStack.push(snapshot);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = []; // Reset redo
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const current = JSON.stringify(this.items);
    this.redoStack.push(current);
    const prev = JSON.parse(this.undoStack.pop());
    this.items = prev;
    this.renderAll();
    Sound.playClick();
    AppUI.updateMiniPreview();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const current = JSON.stringify(this.items);
    this.undoStack.push(current);
    const next = JSON.parse(this.redoStack.pop());
    this.items = next;
    this.renderAll();
    Sound.playClick();
    AppUI.updateMiniPreview();
  }

  addItemById(catalogId, customX = null, customY = null) {
    const catalogItem = WARDROBE_ITEMS.find(i => i.id === catalogId);
    if (!catalogItem) return;

    this.pushHistory();

    const instanceId = 'item_' + this.nextInstanceId++;
    const itemData = {
      instanceId,
      catalogId,
      name: catalogItem.name,
      category: catalogItem.category,
      x: customX !== null ? Math.max(0, Math.min(customX, 350)) : (catalogItem.defaultX !== undefined ? catalogItem.defaultX : 130),
      y: customY !== null ? Math.max(0, Math.min(customY, 440)) : (catalogItem.defaultY !== undefined ? catalogItem.defaultY : 170),
      width: catalogItem.defaultW || 120,
      height: catalogItem.defaultH || 120,
      scale: 1,
      rotation: 0,
      flipped: false,
      zIndex: catalogItem.zIndex || 20
    };

    // Replace existing item in same category if appropriate (e.g. only 1 top, 1 bottom, 1 shoes, 1 hair at a time unless accessories or custom)
    if (['tops', 'bottoms', 'shoes', 'hair', 'outerwear'].includes(catalogItem.category)) {
      this.items = this.items.filter(i => i.category !== catalogItem.category);
    }

    this.items.push(itemData);
    this.renderAll();
    this.selectItem(instanceId);

    Sound.playDrop();
    AppUI.incrementWearCounter();
    AppUI.updateMiniPreview();
  }

  selectItem(instanceId) {
    this.selectedItemId = instanceId;
    this.items.forEach(it => {
      const el = document.getElementById(it.instanceId);
      if (el) {
        if (it.instanceId === instanceId) {
          el.classList.add('selected');
        } else {
          el.classList.remove('selected');
        }
      }
    });

    const item = this.getItem(instanceId);
    if (item) {
      AppUI.setStatusCoords(Math.round(item.x), Math.round(item.y));
    }
  }

  deselectAll() {
    this.selectedItemId = null;
    const all = this.container.querySelectorAll('.placed-item');
    all.forEach(el => el.classList.remove('selected'));
  }

  getItem(instanceId) {
    return this.items.find(i => i.instanceId === instanceId);
  }

  removeItem(instanceId) {
    this.pushHistory();
    this.items = this.items.filter(i => i.instanceId !== instanceId);
    if (this.selectedItemId === instanceId) {
      this.selectedItemId = null;
    }
    this.renderAll();
    Sound.playDelete();
    AppUI.updateMiniPreview();
  }

  flipSelectedItem() {
    if (!this.selectedItemId) return;
    this.pushHistory();
    const item = this.getItem(this.selectedItemId);
    if (item) {
      item.flipped = !item.flipped;
      this.updateItemDOM(item);
      Sound.playClick();
      AppUI.updateMiniPreview();
    }
  }

  bringSelectedItemForward() {
    if (!this.selectedItemId) return;
    this.pushHistory();
    const item = this.getItem(this.selectedItemId);
    if (item) {
      item.zIndex += 2;
      this.updateItemDOM(item);
      Sound.playClick();
    }
  }

  sendSelectedItemBackward() {
    if (!this.selectedItemId) return;
    this.pushHistory();
    const item = this.getItem(this.selectedItemId);
    if (item) {
      item.zIndex = Math.max(10, item.zIndex - 2);
      this.updateItemDOM(item);
      Sound.playClick();
    }
  }

  clearAll() {
    this.pushHistory();
    this.items = [];
    this.selectedItemId = null;
    this.renderAll();
    Sound.playDelete();
    AppUI.updateMiniPreview();
  }

  setCustomModel(imageDataUrl) {
    this.pushHistory();
    this.customModelImage = imageDataUrl;
    const modelLayer = document.getElementById('customModelLayer');
    const modelImg = document.getElementById('customModelImg');
    const modeBar = document.getElementById('modelModeBar');

    modelImg.src = imageDataUrl;
    modelLayer.style.display = 'flex';
    modeBar.style.display = 'flex';

    this.setCustomModelMode('photo');
    AppUI.updateMiniPreview();
  }

  setCustomModelMode(mode) {
    this.customModelMode = mode;
    const modelLayer = document.getElementById('customModelLayer');
    const mannequinLayer = document.getElementById('mannequinLayer');
    const modeBtns = document.querySelectorAll('.model-mode-btn');
    modeBtns.forEach(btn => {
      if (btn.getAttribute('data-model') === mode) btn.classList.add('active');
      else if (btn.getAttribute('data-model')) btn.classList.remove('active');
    });

    if (mode === 'photo') {
      modelLayer.style.display = 'flex';
      mannequinLayer.style.opacity = '0';
      mannequinLayer.style.pointerEvents = 'none';
    } else if (mode === 'mannequin') {
      modelLayer.style.display = 'none';
      mannequinLayer.style.opacity = '1';
      mannequinLayer.style.pointerEvents = 'auto';
    } else if (mode === 'both') {
      modelLayer.style.display = 'flex';
      mannequinLayer.style.opacity = '0.45';
      mannequinLayer.style.pointerEvents = 'auto';
    }
    AppUI.updateMiniPreview();
  }

  removeCustomModel() {
    this.pushHistory();
    this.customModelImage = null;
    document.getElementById('customModelLayer').style.display = 'none';
    document.getElementById('modelModeBar').style.display = 'none';
    const mannequinLayer = document.getElementById('mannequinLayer');
    mannequinLayer.style.opacity = '1';
    mannequinLayer.style.pointerEvents = 'auto';
    Sound.playDelete();
    AppUI.updateMiniPreview();
  }

  setMannequinFace(imageDataUrl) {
    this.pushHistory();
    this.mannequinFaceImage = imageDataUrl;
    const overlay = document.getElementById('mannequinFaceOverlay');
    const img = document.getElementById('mannequinFaceImg');
    img.src = imageDataUrl;
    overlay.style.display = 'block';
    AppUI.updateMiniPreview();
  }

  removeMannequinFace() {
    this.pushHistory();
    this.mannequinFaceImage = null;
    document.getElementById('mannequinFaceOverlay').style.display = 'none';
    Sound.playDelete();
    AppUI.updateMiniPreview();
  }

  addCustomWardrobeItem(imageDataUrl, name = 'Custom Item') {
    this.pushHistory();
    const customId = 'custom_' + Date.now();
    const customItem = {
      id: customId,
      name: name,
      category: 'custom',
      tags: ['custom', 'y2k'],
      defaultX: 130,
      defaultY: 170,
      defaultW: 120,
      defaultH: 120,
      zIndex: 25,
      imageUrl: imageDataUrl
    };

    WARDROBE_ITEMS.push(customItem);

    // Save to localStorage
    try {
      const savedCustom = JSON.parse(localStorage.getItem('pixelFit_customItems') || '[]');
      savedCustom.push(customItem);
      localStorage.setItem('pixelFit_customItems', JSON.stringify(savedCustom));
    } catch (e) {
      console.warn('Could not save custom item to localStorage:', e);
    }

    // Refresh Wardrobe Tray to custom tab
    const customTab = document.querySelector('.category-tab[data-category="custom"]');
    if (customTab) customTab.click();
    else AppUI.filterWardrobeCategory('all');

    // Equip immediately on canvas
    this.addItemById(customId);
  }

  setCanvasBackgroundImage(imageDataUrl) {
    this.pushHistory();
    const bgLayer = document.getElementById('canvasBgLayer');
    bgLayer.style.backgroundImage = `url("${imageDataUrl}")`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
    AppUI.updateMiniPreview();
  }

  renderAll() {
    this.container.innerHTML = '';
    this.items.forEach(item => {
      const catalogItem = WARDROBE_ITEMS.find(i => i.id === item.catalogId);
      if (!catalogItem) return;

      const el = document.createElement('div');
      el.className = 'placed-item' + (item.instanceId === this.selectedItemId ? ' selected' : '');
      el.id = item.instanceId;
      el.style.width = item.width + 'px';
      el.style.height = item.height + 'px';
      el.style.zIndex = item.zIndex;

      const visualContent = catalogItem.imageUrl
        ? `<img class="placed-img-element" src="${catalogItem.imageUrl}" alt="${catalogItem.name}" draggable="false">`
        : catalogItem.svg;

      // Transform handles HTML
      el.innerHTML = `
        ${visualContent}
        <!-- Resize Corner Handle -->
        <div class="transform-handle handle-resize-se" data-handle="resize"></div>
        <!-- Rotate Stem & Handle -->
        <div class="rotate-stem"></div>
        <div class="handle-rotate" data-handle="rotate" title="Drag to Rotate"></div>
        <!-- Quick Action Overlay -->
        <div class="item-quick-actions">
          <button class="win98-btn item-act-btn btn-flip" title="Flip Horizontal">⇄</button>
          <button class="win98-btn item-act-btn btn-up" title="Bring Forward">▲</button>
          <button class="win98-btn item-act-btn btn-down" title="Send Backward">▼</button>
          <button class="win98-btn item-act-btn btn-del" title="Delete Item">✕</button>
        </div>
      `;

      // Quick actions listeners
      const btnFlip = el.querySelector('.btn-flip');
      const btnUp = el.querySelector('.btn-up');
      const btnDown = el.querySelector('.btn-down');
      const btnDel = el.querySelector('.btn-del');

      if (btnFlip) btnFlip.onpointerdown = (e) => { e.stopPropagation(); this.flipSelectedItem(); };
      if (btnUp) btnUp.onpointerdown = (e) => { e.stopPropagation(); this.bringSelectedItemForward(); };
      if (btnDown) btnDown.onpointerdown = (e) => { e.stopPropagation(); this.sendSelectedItemBackward(); };
      if (btnDel) btnDel.onpointerdown = (e) => { e.stopPropagation(); this.removeItem(item.instanceId); };

      this.container.appendChild(el);
      this.updateItemDOM(item);
    });
  }

  updateItemDOM(item) {
    const el = document.getElementById(item.instanceId);
    if (!el) return;

    el.style.left = item.x + 'px';
    el.style.top = item.y + 'px';
    el.style.width = item.width * item.scale + 'px';
    el.style.height = item.height * item.scale + 'px';
    el.style.zIndex = item.zIndex;

    const flipScale = item.flipped ? -1 : 1;
    el.style.transform = `rotate(${item.rotation}deg) scaleX(${flipScale})`;
  }

  handlePointerDown(e) {
    // If Eraser tool active, clicking item deletes it!
    if (AppUI.currentTool === 'eraser') {
      const itemEl = e.target.closest('.placed-item');
      if (itemEl) {
        e.stopPropagation();
        this.removeItem(itemEl.id);
        return;
      }
    }

    // Check if clicked a handle
    const handle = e.target.getAttribute('data-handle');
    const itemEl = e.target.closest('.placed-item');

    if (handle && itemEl) {
      e.stopPropagation();
      this.pushHistory();
      this.selectedItemId = itemEl.id;
      const item = this.getItem(itemEl.id);
      if (!item) return;

      this.activePointerAction = handle;
      this.pointerStart = { x: e.clientX, y: e.clientY };
      this.itemStartProps = { ...item };
      return;
    }

    // Clicked item body -> drag action
    if (itemEl) {
      e.stopPropagation();
      this.pushHistory();
      this.selectItem(itemEl.id);
      const item = this.getItem(itemEl.id);
      if (!item) return;

      this.activePointerAction = 'drag';
      this.pointerStart = { x: e.clientX, y: e.clientY };
      this.itemStartProps = { ...item };
      Sound.playPickup();
    }
  }

  handlePointerMove(e) {
    if (!this.activePointerAction || !this.selectedItemId) return;

    const item = this.getItem(this.selectedItemId);
    if (!item || !this.itemStartProps) return;

    const dx = e.clientX - this.pointerStart.x;
    const dy = e.clientY - this.pointerStart.y;

    if (this.activePointerAction === 'drag') {
      item.x = Math.max(-20, Math.min(360, this.itemStartProps.x + dx));
      item.y = Math.max(-20, Math.min(460, this.itemStartProps.y + dy));
      this.updateItemDOM(item);
      AppUI.setStatusCoords(Math.round(item.x), Math.round(item.y));
    } else if (this.activePointerAction === 'resize') {
      // Scale based on diagonal drag distance
      const originalDiag = Math.sqrt(this.itemStartProps.width ** 2 + this.itemStartProps.height ** 2);
      const newWidth = Math.max(30, this.itemStartProps.width * this.itemStartProps.scale + dx);
      const scaleFactor = Math.max(0.4, Math.min(2.5, newWidth / this.itemStartProps.width));
      item.scale = scaleFactor;
      this.updateItemDOM(item);
    } else if (this.activePointerAction === 'rotate') {
      // Calculate angle from center of item to pointer
      const el = document.getElementById(item.instanceId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let deg = Math.round(rad * (180 / Math.PI)) + 90; // Offset for top handle
        if (deg < 0) deg += 360;
        // Snap to 15-degree increments if shift is held
        if (e.shiftKey) deg = Math.round(deg / 15) * 15;
        item.rotation = deg;
        this.updateItemDOM(item);
      }
    }
  }

  handlePointerUp() {
    if (this.activePointerAction) {
      this.activePointerAction = null;
      this.itemStartProps = null;
      AppUI.updateMiniPreview();
    }
  }
}

/* ============================================================================
   4. FREEHAND DOODLE CANVAS LAYER (MS Paint Pencil / Brush / Airbrush / Eraser)
   ============================================================================ */
class PaintDrawingLayer {
  constructor() {
    this.canvas = document.getElementById('paintCanvasOverlay');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('pointerdown', (e) => this.startDraw(e));
    window.addEventListener('pointermove', (e) => this.draw(e));
    window.addEventListener('pointerup', () => this.stopDraw());
  }

  startDraw(e) {
    if (!['pencil', 'brush', 'airbrush', 'eraser'].includes(AppUI.currentTool)) return;
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;

    if (AppUI.currentTool === 'airbrush') {
      this.spray(this.lastX, this.lastY);
    } else {
      this.draw(e);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.ctx.beginPath();
    if (AppUI.currentTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = AppUI.strokeSize * 3;
      this.ctx.lineCap = 'square';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = AppUI.primaryColor;
      this.ctx.lineWidth = AppUI.currentTool === 'brush' ? AppUI.strokeSize * 2 : AppUI.strokeSize;
      this.ctx.lineCap = AppUI.currentTool === 'pencil' ? 'square' : 'round';
    }

    if (AppUI.currentTool === 'airbrush') {
      this.spray(currentX, currentY);
    } else {
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
    }

    this.lastX = currentX;
    this.lastY = currentY;
    AppUI.setStatusCoords(Math.round(currentX), Math.round(currentY));
  }

  spray(x, y) {
    const density = AppUI.strokeSize * 6;
    const radius = AppUI.strokeSize * 3;
    this.ctx.fillStyle = AppUI.primaryColor;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  }

  stopDraw() {
    if (this.isDrawing) {
      this.isDrawing = false;
      AppUI.updateMiniPreview();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    AppUI.updateMiniPreview();
  }
}

/* ============================================================================
   5. OUTFIT RANDOMIZER (Smart Coordinated Slot Generator)
   ============================================================================ */
class OutfitRandomizer {
  static generate(styleTag = 'all') {
    let items = WARDROBE_ITEMS;
    if (styleTag !== 'all') {
      items = WARDROBE_ITEMS.filter(i => i.tags.includes(styleTag));
      // Fallback if specific tag has few items in certain category
      if (items.length < 5) items = WARDROBE_ITEMS;
    }

    const tops = items.filter(i => i.category === 'tops');
    const bottoms = items.filter(i => i.category === 'bottoms');
    const shoes = items.filter(i => i.category === 'shoes');
    const hair = items.filter(i => i.category === 'hair');
    const accessories = items.filter(i => i.category === 'accessories');
    const pets = items.filter(i => i.category === 'pets');

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    Canvas.pushHistory();
    Canvas.items = []; // Clear current fit for fresh random look

    // 1. Pick Hair
    if (hair.length > 0) Canvas.addItemById(pick(hair).id);
    // 2. Pick Top
    if (tops.length > 0) Canvas.addItemById(pick(tops).id);
    // 3. Pick Bottom
    if (bottoms.length > 0) Canvas.addItemById(pick(bottoms).id);
    // 4. Pick Shoes
    if (shoes.length > 0) Canvas.addItemById(pick(shoes).id);
    // 5. Pick 1-2 Accessories
    if (accessories.length > 0) {
      const acc1 = pick(accessories);
      Canvas.addItemById(acc1.id);
      if (Math.random() > 0.4 && accessories.length > 1) {
        const acc2 = pick(accessories.filter(a => a.id !== acc1.id));
        if (acc2) Canvas.addItemById(acc2.id);
      }
    }
    // 6. 50% chance of a pet companion
    if (Math.random() > 0.45 && pets.length > 0) {
      Canvas.addItemById(pick(pets).id);
    }

    Sound.playRandomize();
    AppUI.incrementWearCounter();
    AppUI.updateMiniPreview();
  }
}

/* ============================================================================
   6. EXPORT & LOCAL STORAGE ENGINE
   Captures composite canvas into crisp PNG and manages "My Fits" wardrobe
   ============================================================================ */
class ExportEngine {
  // Composite everything into an off-screen HTML5 Canvas
  static async renderCompositeCanvas() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 420;
    exportCanvas.height = 520;
    const ctx = exportCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 1. Draw Canvas Background Color or Background Image
    const bgLayer = document.getElementById('canvasBgLayer');
    if (bgLayer && bgLayer.style.backgroundImage) {
      const bgMatch = bgLayer.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
      if (bgMatch && bgMatch[1]) {
        await this.drawImageToCanvas(ctx, bgMatch[1], 0, 0, 420, 520);
      }
    } else {
      const bgColor = bgLayer.style.backgroundColor || '#ffffff';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 420, 520);
    }

    // 2. Draw Custom Model Photo (if active and mode is photo or both)
    if (Canvas && Canvas.customModelImage && (Canvas.customModelMode === 'photo' || Canvas.customModelMode === 'both')) {
      await this.drawImageToCanvas(ctx, Canvas.customModelImage, 0, 0, 420, 520);
    }

    // 3. Draw Mannequin SVG (if active and mode is mannequin or both)
    if (!Canvas || !Canvas.customModelImage || Canvas.customModelMode === 'mannequin' || Canvas.customModelMode === 'both') {
      const mannequinSvg = document.getElementById('mannequinSvg');
      await this.drawSvgElementToCanvas(ctx, mannequinSvg, 50, 20, 320, 480);
      // Pinned Mannequin Face Selfie
      if (Canvas && Canvas.mannequinFaceImage) {
        await this.drawImageToCanvas(ctx, Canvas.mannequinFaceImage, 188, 90, 44, 64);
      }
    }

    // 4. Sort placed items by zIndex and draw them with transforms
    const sortedItems = [...Canvas.items].sort((a, b) => a.zIndex - b.zIndex);
    for (const item of sortedItems) {
      const catalogItem = WARDROBE_ITEMS.find(i => i.id === item.catalogId);
      if (!catalogItem) continue;

      ctx.save();
      // Translate to item center for rotation and scale
      const itemWidth = item.width * item.scale;
      const itemHeight = item.height * item.scale;
      const centerX = item.x + itemWidth / 2;
      const centerY = item.y + itemHeight / 2;

      ctx.translate(centerX, centerY);
      ctx.rotate((item.rotation * Math.PI) / 180);
      if (item.flipped) {
        ctx.scale(-1, 1);
      }

      if (catalogItem.imageUrl) {
        await this.drawImageToCanvas(
          ctx,
          catalogItem.imageUrl,
          -itemWidth / 2,
          -itemHeight / 2,
          itemWidth,
          itemHeight
        );
      } else if (catalogItem.svg) {
        await this.drawSvgStringToCanvas(
          ctx,
          catalogItem.svg,
          -itemWidth / 2,
          -itemHeight / 2,
          itemWidth,
          itemHeight
        );
      }
      ctx.restore();
    }

    // 5. Draw Freehand Doodle Canvas
    const doodleCanvas = document.getElementById('paintCanvasOverlay');
    ctx.drawImage(doodleCanvas, 0, 0);

    // 6. Add retro watermark badge
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillText("PIXEL FIT '00", 12, 510);

    return exportCanvas;
  }

  static drawImageToCanvas(ctx, src, x, y, width, height) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  }

  static drawSvgElementToCanvas(ctx, svgElement, x, y, width, height) {
    return new Promise((resolve) => {
      let xml = new XMLSerializer().serializeToString(svgElement);
      if (!xml.includes('xmlns=')) {
        xml = xml.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
      }
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const image64 = 'data:image/svg+xml;base64,' + svg64;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = image64;
    });
  }

  static drawSvgStringToCanvas(ctx, svgString, x, y, width, height) {
    return new Promise((resolve) => {
      let fullSvg = svgString;
      if (!fullSvg.includes('xmlns=')) {
        fullSvg = fullSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
      }
      const svg64 = btoa(unescape(encodeURIComponent(fullSvg)));
      const image64 = 'data:image/svg+xml;base64,' + svg64;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = image64;
    });
  }

  static async saveFit() {
    Sound.playSave();
    const canvas = await this.renderCompositeCanvas();
    const dataUrl = canvas.toDataURL('image/png');

    // Trigger instant browser download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.download = `pixel-fit-${timestamp}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Store fit in localStorage "My Fits" Wardrobe
    const savedFits = JSON.parse(localStorage.getItem('pixelFit_savedFits') || '[]');
    const fitRecord = {
      id: 'fit_' + Date.now(),
      title: `Fit #${savedFits.length + 1}`,
      date: new Date().toLocaleDateString(),
      items: JSON.parse(JSON.stringify(Canvas.items)),
      thumbnail: dataUrl
    };
    savedFits.unshift(fitRecord);
    if (savedFits.length > 24) savedFits.pop();
    localStorage.setItem('pixelFit_savedFits', JSON.stringify(savedFits));

    AppUI.incrementWearCounter();
    AppUI.renderSavedFitsGrid();
  }
}

/* ============================================================================
   7. MEDIA ENGINE (Camera Capture & Local File Upload)
   Webcam video stream, 3s countdown, CRT filters, drag-drop, and paste
   ============================================================================ */
class MediaEngine {
  constructor() {
    this.stream = null;
    this.currentImage = null; // Filtered or processed dataUrl
    this.rawImageDataUrl = null; // Unfiltered base image
    this.currentFilter = 'normal';
    this.facingMode = 'user'; // 'user' or 'environment'

    this.videoEl = document.getElementById('webcamVideo');
    this.canvasEl = document.getElementById('cameraCanvas');
    this.previewSection = document.getElementById('importPreviewSection');
    this.previewImg = document.getElementById('importPreviewImg');
    this.previewMeta = document.getElementById('previewMeta');
    this.cameraFlash = document.getElementById('cameraFlash');
    this.countdownEl = document.getElementById('cameraCountdown');
    this.fallbackMsg = document.getElementById('cameraFallbackMsg');

    this.init();
  }

  init() {
    this.setupDropzone();
    this.setupFilterButtons();
    this.setupActionButtons();
    this.setupGlobalPaste();
  }

  async startCamera() {
    this.stopCamera();
    if (this.fallbackMsg) this.fallbackMsg.style.display = 'none';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (this.fallbackMsg) this.fallbackMsg.style.display = 'flex';
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        await this.videoEl.play();
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      if (this.fallbackMsg) this.fallbackMsg.style.display = 'flex';
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  }

  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.startCamera();
    Sound.playClick();
  }

  startCountdown(seconds = 3, onComplete) {
    let count = seconds;
    if (this.countdownEl) {
      this.countdownEl.style.display = 'flex';
      this.countdownEl.textContent = count;
    }
    Sound.playCountdownBeep(600);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        if (this.countdownEl) this.countdownEl.textContent = count;
        Sound.playCountdownBeep(700 + (3 - count) * 120);
      } else {
        clearInterval(timer);
        if (this.countdownEl) this.countdownEl.style.display = 'none';
        Sound.playCountdownBeep(1200);
        if (onComplete) onComplete();
      }
    }, 900);
  }

  captureSnapshot() {
    // If video is not active or has zero dimensions, use sample photo
    if (!this.videoEl || !this.videoEl.videoWidth) {
      this.loadSamplePhoto();
      return;
    }

    // Trigger flash animation & shutter sound
    if (this.cameraFlash) {
      this.cameraFlash.classList.remove('active');
      void this.cameraFlash.offsetWidth;
      this.cameraFlash.classList.add('active');
    }
    Sound.playShutter();

    const w = this.videoEl.videoWidth || 480;
    const h = this.videoEl.videoHeight || 480;
    this.canvasEl.width = w;
    this.canvasEl.height = h;
    const ctx = this.canvasEl.getContext('2d');

    // Flip horizontal if selfie mode
    if (this.facingMode === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.videoEl, 0, 0, w, h);

    const dataUrl = this.canvasEl.toDataURL('image/png');
    this.setImage(dataUrl, `Camera Snap (${w}x${h})`);
  }

  setImage(dataUrl, metaText = '') {
    this.rawImageDataUrl = dataUrl;
    this.applyCurrentFilter();
    if (this.previewMeta) this.previewMeta.textContent = metaText || 'Ready to apply';
    if (this.previewSection) this.previewSection.style.display = 'block';

    const modalBody = document.querySelector('.import-modal-body');
    if (modalBody) {
      setTimeout(() => {
        modalBody.scrollTo({ top: modalBody.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }

  applyCurrentFilter() {
    if (!this.rawImageDataUrl) return;

    if (this.currentFilter === 'normal') {
      this.currentImage = this.rawImageDataUrl;
      if (this.previewImg) this.previewImg.src = this.currentImage;
      return;
    }

    const img = new Image();
    img.onload = () => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      offCanvas.width = img.width;
      offCanvas.height = img.height;

      if (this.currentFilter === 'pixelate') {
        const pixelSize = Math.max(6, Math.floor(img.width / 50));
        const smallW = Math.max(1, Math.floor(img.width / pixelSize));
        const smallH = Math.max(1, Math.floor(img.height / pixelSize));

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = smallW;
        tempCanvas.height = smallH;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, smallW, smallH);

        offCtx.imageSmoothingEnabled = false;
        offCtx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, img.width, img.height);
      } else if (this.currentFilter === 'cyber') {
        offCtx.drawImage(img, 0, 0);
        const imgData = offCtx.getImageData(0, 0, img.width, img.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = Math.min(255, d[i] * 0.9);
          d[i+1] = Math.min(255, d[i+1] * 1.3 + 20);
          d[i+2] = Math.min(255, d[i+2] * 1.3 + 40);
        }
        offCtx.putImageData(imgData, 0, 0);
      } else if (this.currentFilter === 'vintage') {
        offCtx.drawImage(img, 0, 0);
        const imgData = offCtx.getImageData(0, 0, img.width, img.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i+1], b = d[i+2];
          d[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          d[i+1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          d[i+2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        offCtx.putImageData(imgData, 0, 0);
      } else if (this.currentFilter === 'grayscale') {
        offCtx.drawImage(img, 0, 0);
        const imgData = offCtx.getImageData(0, 0, img.width, img.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const avg = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
          const quant = Math.round(avg / 85) * 85;
          d[i] = quant;
          d[i+1] = Math.min(255, quant + 15);
          d[i+2] = Math.max(0, quant - 10);
        }
        offCtx.putImageData(imgData, 0, 0);
      }

      this.currentImage = offCanvas.toDataURL('image/png');
      if (this.previewImg) this.previewImg.src = this.currentImage;
    };
    img.src = this.rawImageDataUrl;
  }

  setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.applyCurrentFilter();
      });
    });
  }

  setupDropzone() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('localFileInput');
    const btnBrowse = document.getElementById('btnBrowseFiles');

    if (btnBrowse && fileInput) {
      btnBrowse.onclick = () => fileInput.click();
    }
    if (dropzone && fileInput) {
      dropzone.onclick = (e) => {
        if (e.target !== btnBrowse) fileInput.click();
      };

      fileInput.onchange = () => {
        if (fileInput.files && fileInput.files[0]) {
          this.loadLocalFile(fileInput.files[0]);
        }
      };

      ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadLocalFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  loadLocalFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      Sound.playPickup();
      if (AppUI) AppUI.openModal('cameraUploadModal');
      const uploadTabBtn = document.getElementById('tabBtnUpload');
      if (uploadTabBtn) uploadTabBtn.click();
      this.setImage(e.target.result, `${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsDataURL(file);
  }

  setupGlobalPaste() {
    window.addEventListener('paste', (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          this.loadLocalFile(blob);
          break;
        }
      }
    });
  }

  loadSamplePhoto() {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 420;
    const ctx = c.getContext('2d');
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 320, 420);
    grad.addColorStop(0, '#c8b6ff');
    grad.addColorStop(1, '#ffd1dc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 420);

    // Cute Model Silhouette
    ctx.fillStyle = '#ffd1b3';
    ctx.beginPath();
    ctx.arc(160, 110, 45, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#ff66aa';
    ctx.fillRect(125, 160, 70, 110);
    // Legs
    ctx.fillStyle = '#333333';
    ctx.fillRect(130, 270, 25, 120);
    ctx.fillRect(165, 270, 25, 120);
    // Hair
    ctx.fillStyle = '#4a2511';
    ctx.beginPath();
    ctx.arc(160, 95, 50, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(110, 95, 20, 60);
    ctx.fillRect(190, 95, 20, 60);

    // Retro sticker text
    ctx.font = "bold 12px 'Press Start 2P', monospace";
    ctx.fillStyle = '#000080';
    ctx.fillText("TRY-ON MODEL", 42, 48);

    const dataUrl = c.toDataURL('image/png');
    this.setImage(dataUrl, 'Sample Y2K Model (320x420)');
    Sound.playPickup();
  }

  setupActionButtons() {
    const btnModel = document.getElementById('btnApplyModel');
    const btnFace = document.getElementById('btnApplyFace');
    const btnWardrobe = document.getElementById('btnApplyWardrobe');
    const btnBg = document.getElementById('btnApplyBackground');

    if (btnModel) {
      btnModel.onclick = () => {
        if (!this.currentImage) return;
        Canvas.setCustomModel(this.currentImage);
        Sound.playRandomize();
        AppUI.closeModal('cameraUploadModal');
      };
    }

    if (btnFace) {
      btnFace.onclick = () => {
        if (!this.currentImage) return;
        Canvas.setMannequinFace(this.currentImage);
        Sound.playRandomize();
        AppUI.closeModal('cameraUploadModal');
      };
    }

    if (btnWardrobe) {
      btnWardrobe.onclick = () => {
        if (!this.currentImage) return;
        const itemName = prompt('Name your custom wardrobe item / sticker:', 'Custom Graphic') || 'Custom Item';
        Canvas.addCustomWardrobeItem(this.currentImage, itemName);
        Sound.playRandomize();
        AppUI.closeModal('cameraUploadModal');
      };
    }

    if (btnBg) {
      btnBg.onclick = () => {
        if (!this.currentImage) return;
        Canvas.setCanvasBackgroundImage(this.currentImage);
        Sound.playClick();
        AppUI.closeModal('cameraUploadModal');
      };
    }
  }
}

/* ============================================================================
   8. APPLICATION UI CONTROLLER
   Coordinates menus, toolbar, category tabs, swatches, modals, loading screen
   ============================================================================ */
class AppUIController {
  constructor() {
    this.currentTool = 'select';
    this.primaryColor = '#000000';
    this.secondaryColor = '#ffffff';
    this.strokeSize = 2;

    this.init();
  }

  init() {
    this.setupMenus();
    this.setupToolbar();
    this.setupCategoryTabs();
    this.setupWardrobeTray();
    this.setupPalette();
    this.setupSkinPicker();
    this.setupModals();
    this.setupMediaFeatures();
    this.setupSoundToggle();
    this.setupLoadingScreen();
    this.initWearCounter();

    // Start with a coordinated initial outfit!
    setTimeout(() => {
      OutfitRandomizer.generate('y2k');
    }, 400);
  }

  // Windows 98 Dropdown Menus
  setupMenus() {
    const triggers = document.querySelectorAll('.menu-trigger');
    triggers.forEach(trig => {
      trig.addEventListener('click', (e) => {
        e.stopPropagation();
        Sound.playClick();
        const menuId = trig.getAttribute('data-menu');
        const dropdown = document.getElementById(menuId);
        const isOpen = dropdown.classList.contains('show');

        // Close any other open dropdowns
        document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.remove('show'));
        document.querySelectorAll('.menu-trigger').forEach(t => t.classList.remove('active'));

        if (!isOpen) {
          dropdown.classList.add('show');
          trig.classList.add('active');
        }
      });
    });

    window.addEventListener('click', () => {
      document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.remove('show'));
      document.querySelectorAll('.menu-trigger').forEach(t => t.classList.remove('active'));
    });

    // Menu Actions
    document.getElementById('menuNew').onclick = () => Canvas.clearAll();
    document.getElementById('menuOpenFits').onclick = () => this.openModal('myFitsModal');
    document.getElementById('menuSaveFit').onclick = () => ExportEngine.saveFit();
    document.getElementById('menuExportPng').onclick = () => ExportEngine.saveFit();
    document.getElementById('menuExit').onclick = () => alert('Thanks for playing Pixel Fit! Refresh or close tab to exit.');

    // Camera & Upload in File Menu
    const menuCam = document.getElementById('menuCamera');
    if (menuCam) {
      menuCam.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnCamera');
        if (tabBtn) tabBtn.click();
      };
    }
    const menuUp = document.getElementById('menuUpload');
    if (menuUp) {
      menuUp.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnUpload');
        if (tabBtn) tabBtn.click();
      };
    }

    // Image Menu Actions
    const menuImgCam = document.getElementById('menuImageCamera');
    if (menuImgCam) {
      menuImgCam.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnCamera');
        if (tabBtn) tabBtn.click();
      };
    }
    const menuImgUp = document.getElementById('menuImageUpload');
    if (menuImgUp) {
      menuImgUp.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnUpload');
        if (tabBtn) tabBtn.click();
      };
    }
    const menuClrMod = document.getElementById('menuClearModel');
    if (menuClrMod) {
      menuClrMod.onclick = () => {
        Canvas.removeCustomModel();
      };
    }

    document.getElementById('menuUndo').onclick = () => Canvas.undo();
    document.getElementById('menuRedo').onclick = () => Canvas.redo();
    document.getElementById('menuDeleteSelected').onclick = () => {
      if (Canvas.selectedItemId) Canvas.removeItem(Canvas.selectedItemId);
    };
    document.getElementById('menuClearAll').onclick = () => Canvas.clearAll();

    document.getElementById('menuToggleSound').onclick = () => Sound.toggleMute();
    document.getElementById('menuFlipH').onclick = () => Canvas.flipSelectedItem();
    document.getElementById('menuLayerUp').onclick = () => Canvas.bringSelectedItemForward();
    document.getElementById('menuLayerDown').onclick = () => Canvas.sendSelectedItemBackward();
    document.getElementById('menuInvert').onclick = () => {
      const bg = document.getElementById('canvasBgLayer');
      bg.style.backgroundColor = bg.style.backgroundColor === 'rgb(0, 0, 0)' ? '#ffffff' : '#000000';
    };

    document.getElementById('menuHelpTopics').onclick = () => this.openModal('helpModal');
    document.getElementById('menuAbout').onclick = () => this.openModal('helpModal');

    // Title bar window controls
    document.getElementById('btnClose').onclick = () => Canvas.clearAll();
    document.getElementById('btnMinimize').onclick = () => alert('Pixel Fit Window Minimized (Click anywhere to restore)');
    document.getElementById('btnMaximize').onclick = () => {
      const win = document.getElementById('paintWindow');
      win.style.maxWidth = win.style.maxWidth === '100%' ? '1120px' : '100%';
    };

    // Ribbon quick action buttons
    document.getElementById('btnSaveFit').onclick = () => ExportEngine.saveFit();
    document.getElementById('btnRandomize').onclick = () => {
      const style = document.getElementById('styleSelect').value;
      OutfitRandomizer.generate(style);
    };
    document.getElementById('btnReset').onclick = () => Canvas.clearAll();
    document.getElementById('btnUndo').onclick = () => Canvas.undo();
    document.getElementById('btnRedo').onclick = () => Canvas.redo();
    document.getElementById('btnFlipSelected').onclick = () => Canvas.flipSelectedItem();
    document.getElementById('btnDeleteSelected').onclick = () => {
      if (Canvas.selectedItemId) Canvas.removeItem(Canvas.selectedItemId);
    };
    document.getElementById('btnOpenWardrobe').onclick = () => this.openModal('myFitsModal');

    // Ribbon Camera & Upload buttons
    const btnCam = document.getElementById('btnCamera');
    if (btnCam) {
      btnCam.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnCamera');
        if (tabBtn) tabBtn.click();
      };
    }
    const btnUp = document.getElementById('btnUpload');
    if (btnUp) {
      btnUp.onclick = () => {
        this.openModal('cameraUploadModal');
        const tabBtn = document.getElementById('tabBtnUpload');
        if (tabBtn) tabBtn.click();
      };
    }
  }

  // Left Toolbar (16 Classic Tools)
  setupToolbar() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const overlay = document.getElementById('paintCanvasOverlay');

    toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.getAttribute('data-tool');

        // Toggle drawing cursor / active drawing layer
        if (['pencil', 'brush', 'airbrush', 'eraser'].includes(this.currentTool)) {
          overlay.classList.add('active-drawing');
          if (this.currentTool === 'pencil') document.body.className = 'cursor-pencil';
          else if (this.currentTool === 'eraser') document.body.className = 'cursor-eraser';
          else if (this.currentTool === 'bucket') document.body.className = 'cursor-bucket';
          else document.body.className = '';
        } else {
          overlay.classList.remove('active-drawing');
          document.body.className = 'cursor-default';
        }

        // Functional shortcuts for bucket & text
        if (this.currentTool === 'bucket') {
          document.getElementById('canvasBgLayer').style.backgroundColor = this.primaryColor;
          Sound.playClick();
        } else if (this.currentTool === 'text') {
          // Stamp a fun Y2K sticker text onto drawing layer
          const stickerWords = ['ANGEL', 'COOL', 'Y2K', 'BABY', 'SWAG', '2000s', '★', 'CHIC'];
          const word = prompt('Enter text for your Y2K sticker:', stickerWords[Math.floor(Math.random() * stickerWords.length)]);
          if (word) {
            DrawingLayer.ctx.font = "bold 18px 'Press Start 2P', monospace";
            DrawingLayer.ctx.fillStyle = this.primaryColor;
            DrawingLayer.ctx.strokeStyle = '#000';
            DrawingLayer.ctx.lineWidth = 2;
            DrawingLayer.ctx.strokeText(word, 40, 60);
            DrawingLayer.ctx.fillText(word, 40, 60);
            Sound.playSave();
            this.updateMiniPreview();
          }
        }
      });
    });

    // Stroke size selector
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        Sound.playClick();
        sizeOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.strokeSize = parseInt(opt.getAttribute('data-size'), 10) || 2;
      });
    });
  }

  // Category Tabs
  setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        Sound.playClick();
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const cat = tab.getAttribute('data-category');
        this.filterWardrobeCategory(cat);
      });
    });
  }

  // Populate Clothing Tray Grid
  setupWardrobeTray() {
    this.filterWardrobeCategory('all');
  }

  filterWardrobeCategory(category) {
    const grid = document.getElementById('clothingGrid');
    grid.innerHTML = '';

    const filtered = category === 'all' 
      ? WARDROBE_ITEMS 
      : WARDROBE_ITEMS.filter(i => i.category === category);

    document.getElementById('trayItemCount').textContent = `${filtered.length} items`;

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'clothing-card';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-tooltip', `Click or drag: ${item.name}`);

      const visualHtml = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.name}" draggable="false">`
        : item.svg;

      card.innerHTML = `
        ${visualHtml}
        <span class="clothing-card-tag">${item.name}</span>
      `;

      // If custom uploaded/snapped item, add delete badge
      if (item.category === 'custom') {
        const delBtn = document.createElement('button');
        delBtn.className = 'win98-btn';
        delBtn.style.cssText = 'position:absolute;top:2px;right:2px;font-size:7px;padding:0 3px;background:#ff3333;color:#fff;z-index:2;line-height:1.2;';
        delBtn.textContent = '✕';
        delBtn.title = 'Delete custom item';
        delBtn.onpointerdown = (e) => {
          e.stopPropagation();
          Sound.playDelete();
          const idx = WARDROBE_ITEMS.findIndex(x => x.id === item.id);
          if (idx !== -1) WARDROBE_ITEMS.splice(idx, 1);
          try {
            const saved = JSON.parse(localStorage.getItem('pixelFit_customItems') || '[]').filter(x => x.id !== item.id);
            localStorage.setItem('pixelFit_customItems', JSON.stringify(saved));
          } catch (err) {}
          this.filterWardrobeCategory(category);
        };
        card.style.position = 'relative';
        card.appendChild(delBtn);
      }

      // Drag start
      card.addEventListener('dragstart', (e) => {
        Sound.playPickup();
        e.dataTransfer.setData('text/plain', item.id);
      });

      // Single click auto-equips item onto mannequin
      card.addEventListener('click', () => {
        Canvas.addItemById(item.id);
      });

      grid.appendChild(card);
    });
  }

  // MS Paint Color Palette (28 swatches + FG/BG active box)
  setupPalette() {
    const swatches = document.querySelectorAll('.palette-swatch');
    const primaryBox = document.getElementById('colorPrimary');
    const secondaryBox = document.getElementById('colorSecondary');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        Sound.playClick();
        const color = swatch.getAttribute('data-color');
        if (e.button === 2 || e.shiftKey) {
          // Secondary color
          this.secondaryColor = color;
          secondaryBox.style.backgroundColor = color;
        } else {
          // Primary color
          this.primaryColor = color;
          primaryBox.style.backgroundColor = color;
        }
      });

      // Right-click support for secondary color
      swatch.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        Sound.playClick();
        const color = swatch.getAttribute('data-color');
        this.secondaryColor = color;
        secondaryBox.style.backgroundColor = color;
      });
    });

    // Set canvas BG actions
    document.getElementById('btnFillBg').onclick = () => {
      document.getElementById('canvasBgLayer').style.backgroundColor = this.primaryColor;
      Sound.playClick();
      this.updateMiniPreview();
    };

    document.getElementById('btnClearBg').onclick = () => {
      document.getElementById('canvasBgLayer').style.backgroundColor = '#ffffff';
      document.getElementById('canvasBgLayer').style.backgroundImage = 'none';
      Sound.playClick();
      this.updateMiniPreview();
    };
  }

  // Mannequin Skin Tone Picker
  setupSkinPicker() {
    const skinButtons = document.querySelectorAll('.skin-tone-btn');
    skinButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        skinButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const skinColor = btn.getAttribute('data-skin');

        // Update all skin-fill elements in mannequin SVG
        const skinElements = document.querySelectorAll('.skin-fill');
        skinElements.forEach(el => el.setAttribute('fill', skinColor));
        this.updateMiniPreview();
      });
    });
  }

  // Modals ("My Fits", "About", and "Camera & Upload")
  setupModals() {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(modal => {
      modal.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeModal(modal.id);
        });
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    this.renderSavedFitsGrid();
  }

  openModal(modalId) {
    Sound.playClick();
    const modal = document.getElementById(modalId);
    if (modal) {
      if (modalId === 'myFitsModal') this.renderSavedFitsGrid();
      modal.classList.add('open');
      if (modalId === 'cameraUploadModal' && window.Media) {
        const camTab = document.getElementById('tabCamera');
        if (camTab && camTab.classList.contains('active')) {
          window.Media.startCamera();
        }
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      Sound.playClick();
      if (modalId === 'cameraUploadModal' && window.Media) {
        window.Media.stopCamera();
      }
    }
  }

  // Media Controls (Tabs, Camera Shutter/Timer/Flip, Model Bar)
  setupMediaFeatures() {
    // Tab switching
    const tabBtnCamera = document.getElementById('tabBtnCamera');
    const tabBtnUpload = document.getElementById('tabBtnUpload');

    if (tabBtnCamera) {
      tabBtnCamera.onclick = () => {
        document.querySelectorAll('.import-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.import-tab-content').forEach(c => c.classList.remove('active'));
        tabBtnCamera.classList.add('active');
        const tabContent = document.getElementById('tabCamera');
        if (tabContent) tabContent.classList.add('active');
        Sound.playClick();
        if (window.Media) window.Media.startCamera();
      };
    }

    if (tabBtnUpload) {
      tabBtnUpload.onclick = () => {
        document.querySelectorAll('.import-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.import-tab-content').forEach(c => c.classList.remove('active'));
        tabBtnUpload.classList.add('active');
        const tabContent = document.getElementById('tabUpload');
        if (tabContent) tabContent.classList.add('active');
        Sound.playClick();
        if (window.Media) window.Media.stopCamera();
      };
    }

    // Camera action buttons
    const btnShutter = document.getElementById('btnCamShutter');
    if (btnShutter) {
      btnShutter.onclick = () => {
        if (window.Media) window.Media.captureSnapshot();
      };
    }

    const btnTimer = document.getElementById('btnCamTimer');
    if (btnTimer) {
      btnTimer.onclick = () => {
        if (window.Media) {
          window.Media.startCountdown(3, () => {
            window.Media.captureSnapshot();
          });
        }
      };
    }

    const btnSwitch = document.getElementById('btnCamSwitch');
    if (btnSwitch) {
      btnSwitch.onclick = () => {
        if (window.Media) window.Media.switchCamera();
      };
    }

    const btnSample = document.getElementById('btnUseSamplePhoto');
    if (btnSample) {
      btnSample.onclick = () => {
        if (window.Media) window.Media.loadSamplePhoto();
      };
    }

    // Model mode bar buttons
    document.querySelectorAll('.model-mode-btn').forEach(btn => {
      btn.onclick = () => {
        const mode = btn.getAttribute('data-model');
        if (mode && Canvas) {
          Canvas.setCustomModelMode(mode);
          Sound.playClick();
        }
      };
    });

    const btnRemoveModel = document.getElementById('btnRemoveModel');
    if (btnRemoveModel) {
      btnRemoveModel.onclick = () => {
        if (Canvas) Canvas.removeCustomModel();
      };
    }

    const btnRemoveFace = document.getElementById('btnRemoveFace');
    if (btnRemoveFace) {
      btnRemoveFace.onclick = () => {
        if (Canvas) Canvas.removeMannequinFace();
      };
    }
  }

  // Render saved fits into "My Fits" wardrobe gallery
  renderSavedFitsGrid() {
    const grid = document.getElementById('myFitsGrid');
    const placeholder = document.getElementById('noFitsPlaceholder');
    const savedFits = JSON.parse(localStorage.getItem('pixelFit_savedFits') || '[]');

    grid.innerHTML = '';
    if (savedFits.length === 0) {
      placeholder.style.display = 'block';
      return;
    }
    placeholder.style.display = 'none';

    savedFits.forEach((fit, idx) => {
      const card = document.createElement('div');
      card.className = 'saved-fit-card';
      card.innerHTML = `
        <img class="saved-fit-thumbnail" src="${fit.thumbnail}" alt="${fit.title}">
        <div class="saved-fit-title">${fit.title} (${fit.date})</div>
        <div class="saved-fit-actions">
          <button class="win98-btn btn-equip-fit">Equip</button>
          <button class="win98-btn btn-dl-fit">PNG</button>
          <button class="win98-btn btn-del-fit">✕</button>
        </div>
      `;

      // Equip saved fit back onto canvas
      card.querySelector('.btn-equip-fit').onclick = () => {
        Sound.playRandomize();
        Canvas.pushHistory();
        Canvas.items = JSON.parse(JSON.stringify(fit.items));
        Canvas.renderAll();
        document.getElementById('myFitsModal').classList.remove('open');
        this.updateMiniPreview();
      };

      // Download saved PNG
      card.querySelector('.btn-dl-fit').onclick = () => {
        Sound.playClick();
        const a = document.createElement('a');
        a.download = `my-fit-${idx + 1}.png`;
        a.href = fit.thumbnail;
        a.click();
      };

      // Delete from gallery
      card.querySelector('.btn-del-fit').onclick = () => {
        Sound.playDelete();
        savedFits.splice(idx, 1);
        localStorage.setItem('pixelFit_savedFits', JSON.stringify(savedFits));
        this.renderSavedFitsGrid();
      };

      grid.appendChild(card);
    });
  }

  // Audio Sound Toggle in Status Bar
  setupSoundToggle() {
    const btn = document.getElementById('btnSoundToggle');
    const icon = document.getElementById('soundIcon');
    icon.textContent = Sound.muted ? '🔇' : '🔊';

    btn.addEventListener('click', () => {
      const muted = Sound.toggleMute();
      icon.textContent = muted ? '🔇' : '🔊';
      if (!muted) Sound.playClick();
    });
  }

  // Odometer Digital Wear Counter
  initWearCounter() {
    let count = parseInt(localStorage.getItem('pixelFit_wearCount') || '12', 10);
    this.updateOdometerDOM(count);
  }

  incrementWearCounter() {
    let count = parseInt(localStorage.getItem('pixelFit_wearCount') || '12', 10) + 1;
    localStorage.setItem('pixelFit_wearCount', count);
    this.updateOdometerDOM(count);
  }

  updateOdometerDOM(val) {
    const formatted = String(val).padStart(3, '0');
    document.getElementById('odometerCounter').textContent = formatted;
  }

  // Live Canvas Mini Preview Box
  updateMiniPreview() {
    const miniCanvas = document.getElementById('canvasPreviewMini');
    if (!miniCanvas) return;
    const ctx = miniCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Fast snapshot: draw bg, mannequin/model, and layers
    const bg = document.getElementById('canvasBgLayer').style.backgroundColor || '#ffffff';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 56, 72);

    // Draw scaled mannequin or photo model indicator
    if (Canvas && Canvas.customModelImage && Canvas.customModelMode === 'photo') {
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(18, 8, 20, 56);
    } else {
      ctx.fillStyle = '#ffd1b3';
      ctx.fillRect(20, 10, 16, 52);
    }

    // Draw rough colored bounds for placed items
    if (Canvas) {
      Canvas.items.forEach(it => {
        ctx.fillStyle = it.category === 'tops' ? '#ff66aa' : 
                        it.category === 'bottoms' ? '#4a7c9b' :
                        it.category === 'hair' ? '#ff007f' :
                        it.category === 'custom' ? '#00ffff' : '#ffeb3b';
        const mx = (it.x / 420) * 56;
        const my = (it.y / 520) * 72;
        const mw = (it.width / 420) * 56;
        const mh = (it.height / 520) * 72;
        ctx.fillRect(mx, my, mw, mh);
      });
    }
  }

  setStatusCoords(x, y) {
    document.getElementById('statusCoords').textContent = `${x}, ${y}px`;
  }

  // Retro Bootup Loading Screen
  setupLoadingScreen() {
    const screen = document.getElementById('bootLoadingScreen');
    const bar = document.getElementById('loadingProgressBar');
    const text = document.getElementById('loadingStatusText');

    const steps = [
      { pct: '25%', msg: 'Initializing Windows 98 subsystems...' },
      { pct: '50%', msg: 'Loading Y2K vector pixel wardrobe...' },
      { pct: '80%', msg: 'Synthesizing 8-bit audio oscillators...' },
      { pct: '100%', msg: 'Starting Pixel Fit v1.0!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        bar.style.width = steps[stepIdx].pct;
        text.textContent = steps[stepIdx].msg;
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          screen.classList.add('loaded');
          Sound.playClick();
        }, 200);
      }
    }, 180);
  }
}

// Global Instances
let Canvas = null;
let DrawingLayer = null;
let AppUI = null;
let Media = null;

window.addEventListener('DOMContentLoaded', () => {
  Canvas = new CanvasEngine();
  DrawingLayer = new PaintDrawingLayer();
  AppUI = new AppUIController();
  Media = new MediaEngine();
  window.Media = Media;
});
