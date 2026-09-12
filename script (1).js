// ============================================================
// Mau Mau — AI Virtual Try-In (client-side demo compositor)
// No backend: "try-on" is a draggable/resizable garment overlay
// composited onto the user's photo with canvas.
// ============================================================

const state = {
  personImg: null,
  clothingImg: null,
  garment: { x: 350, y: 310, scale: 0.8, rotation: 0 },
  dragging: false,
  dragStart: { x: 0, y: 0 },
};

// ---------- Screen switching ----------
const bootScreen = document.getElementById('boot-screen');
const studioScreen = document.getElementById('studio-screen');

document.getElementById('startBtn').addEventListener('click', () => {
  bootScreen.classList.remove('active');
  studioScreen.classList.add('active');
});

// ---------- How-to modal ----------
const howModal = document.getElementById('howModal');
document.getElementById('howBtn').addEventListener('click', () => howModal.classList.remove('hidden'));
document.getElementById('closeHow').addEventListener('click', () => howModal.classList.add('hidden'));

// ---------- Elements ----------
const personInput = document.getElementById('personInput');
const clothingInput = document.getElementById('clothingInput');
const slotPerson = document.getElementById('slotPerson');
const slotClothing = document.getElementById('slotClothing');
const neededBadge = document.getElementById('neededBadge');
const stateBadge = document.getElementById('stateBadge');
const canvas = document.getElementById('tryonCanvas');
const ctx = canvas.getContext('2d');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const garmentControls = document.getElementById('garmentControls');
const scaleRange = document.getElementById('scaleRange');
const rotateRange = document.getElementById('rotateRange');
const generateBtn = document.getElementById('generateBtn');
const boothBtn = document.getElementById('boothBtn');
const assistantMsg = document.getElementById('assistantMsg');

function loadImageFromFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updateNeeded() {
  const missing = (state.personImg ? 0 : 1) + (state.clothingImg ? 0 : 1);
  neededBadge.textContent = missing === 0 ? 'READY' : `${missing} NEEDED`;
  generateBtn.disabled = missing !== 0;
  stateBadge.textContent = state.personImg ? 'PHOTO LOADED' : 'EMPTY / PHOTO';
}

function markSlotFilled(slotEl, img) {
  slotEl.classList.add('filled');
  const thumb = slotEl.querySelector('.upload-thumb') || document.createElement('img');
  thumb.className = 'upload-thumb';
  thumb.src = img.src;
  slotEl.insertBefore(thumb, slotEl.firstChild);
  const icon = slotEl.querySelector('.upload-icon');
  if (icon) icon.style.display = 'none';
}

// ---------- Person upload ----------
personInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadImageFromFile(file, (img) => {
    state.personImg = img;
    markSlotFilled(slotPerson, img);
    canvasPlaceholder.classList.add('hidden');
    drawCanvas();
    updateNeeded();
    assistantMsg.textContent = 'Nice photo! Now add a clothing item.';
  });
});

// ---------- Clothing upload ----------
clothingInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadImageFromFile(file, (img) => {
    state.clothingImg = img;
    markSlotFilled(slotClothing, img);
    // reset garment position to center-ish
    state.garment.x = canvas.width / 2;
    state.garment.y = canvas.height / 2;
    state.garment.scale = 0.8;
    state.garment.rotation = 0;
    scaleRange.value = 80;
    rotateRange.value = 0;
    garmentControls.classList.remove('hidden');
    drawCanvas();
    updateNeeded();
    assistantMsg.textContent = 'Drag the garment onto your photo, then generate!';
  });
});

// ---------- Camera ----------
const cameraModal = document.getElementById('cameraModal');
const cameraVideo = document.getElementById('cameraVideo');
const hiddenCanvas = document.getElementById('hiddenCanvas');
let mediaStream = null;

document.getElementById('cameraBtn').addEventListener('click', async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraVideo.srcObject = mediaStream;
    cameraModal.classList.remove('hidden');
  } catch (err) {
    alert('Could not access camera: ' + err.message);
  }
});

document.getElementById('cancelCameraBtn').addEventListener('click', closeCamera);

function closeCamera() {
  cameraModal.classList.add('hidden');
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
}

document.getElementById('snapBtn').addEventListener('click', () => {
  hiddenCanvas.width = cameraVideo.videoWidth;
  hiddenCanvas.height = cameraVideo.videoHeight;
  const hctx = hiddenCanvas.getContext('2d');
  hctx.drawImage(cameraVideo, 0, 0);
  const img = new Image();
  img.onload = () => {
    state.personImg = img;
    markSlotFilled(slotPerson, img);
    canvasPlaceholder.classList.add('hidden');
    drawCanvas();
    updateNeeded();
    assistantMsg.textContent = 'Captured! Now add a clothing item.';
  };
  img.src = hiddenCanvas.toDataURL('image/png');
  closeCamera();
});

// ---------- Canvas drawing ----------
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.personImg) {
    fitImageToCanvas(state.personImg);
  }
  if (state.clothingImg) {
    drawGarment();
  }
}

function fitImageToCanvas(img) {
  const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

function drawGarment() {
  const { x, y, scale, rotation } = state.garment;
  const w = state.clothingImg.width * scale * 0.5;
  const h = state.clothingImg.height * scale * 0.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.globalAlpha = 0.92;
  ctx.drawImage(state.clothingImg, -w / 2, -h / 2, w, h);
  ctx.restore();
}

// ---------- Garment controls ----------
scaleRange.addEventListener('input', () => {
  state.garment.scale = scaleRange.value / 100;
  drawCanvas();
});
rotateRange.addEventListener('input', () => {
  state.garment.rotation = Number(rotateRange.value);
  drawCanvas();
});

// ---------- Drag garment on canvas ----------
function getCanvasPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
  const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

canvas.addEventListener('mousedown', (e) => {
  if (!state.clothingImg) return;
  state.dragging = true;
  const pos = getCanvasPos(e);
  state.dragStart = { x: pos.x - state.garment.x, y: pos.y - state.garment.y };
});
window.addEventListener('mousemove', (e) => {
  if (!state.dragging) return;
  const pos = getCanvasPos(e);
  state.garment.x = pos.x - state.dragStart.x;
  state.garment.y = pos.y - state.dragStart.y;
  drawCanvas();
});
window.addEventListener('mouseup', () => (state.dragging = false));

// touch support
canvas.addEventListener('touchstart', (e) => {
  if (!state.clothingImg) return;
  state.dragging = true;
  const pos = getCanvasPos(e);
  state.dragStart = { x: pos.x - state.garment.x, y: pos.y - state.garment.y };
});
canvas.addEventListener('touchmove', (e) => {
  if (!state.dragging) return;
  e.preventDefault();
  const pos = getCanvasPos(e);
  state.garment.x = pos.x - state.dragStart.x;
  state.garment.y = pos.y - state.dragStart.y;
  drawCanvas();
}, { passive: false });
canvas.addEventListener('touchend', () => (state.dragging = false));

// ---------- Generate try-on ----------
generateBtn.addEventListener('click', () => {
  generateBtn.disabled = true;
  generateBtn.textContent = '✦ GENERATING...';
  assistantMsg.textContent = 'Stitching pixels together...';

  setTimeout(() => {
    drawCanvas(); // final composite is just the current canvas state
    generateBtn.textContent = '✦ GENERATE TRY-ON';
    generateBtn.disabled = false;
    boothBtn.disabled = false;
    stateBadge.textContent = 'LOOK READY';
    assistantMsg.textContent = 'Ta-da! Open the photo booth to save it. ♥';
  }, 900);
});

// ---------- Photo booth ----------
const boothModal = document.getElementById('boothModal');
const boothCanvas = document.getElementById('boothCanvas');
const bctx = boothCanvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

boothBtn.addEventListener('click', () => {
  bctx.clearRect(0, 0, boothCanvas.width, boothCanvas.height);
  bctx.fillStyle = '#f2ecdf';
  bctx.fillRect(0, 0, boothCanvas.width, boothCanvas.height);
  bctx.drawImage(canvas, 0, 0, boothCanvas.width, boothCanvas.height);
  bctx.strokeStyle = '#2b1f2c';
  bctx.lineWidth = 8;
  bctx.strokeRect(4, 4, boothCanvas.width - 8, boothCanvas.height - 8);
  downloadBtn.href = boothCanvas.toDataURL('image/png');
  boothModal.classList.remove('hidden');
});

document.getElementById('closeBoothBtn').addEventListener('click', () => {
  boothModal.classList.add('hidden');
});

// ---------- Reset ----------
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Start over with a new look?')) return;
  location.reload();
});

updateNeeded();
