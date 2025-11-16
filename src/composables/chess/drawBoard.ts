import type { LoadedImages } from "@/views/Chess.vue";

export function loadImages(map: Record<string, string>): Promise<LoadedImages> {
  const keys = Object.keys(map);
  const promises = keys.map((k) => {
    return new Promise<{ k: string; img: HTMLImageElement }>(
      (resolve, reject) => {
        if (!map[k]) return;

        const img = new Image();
        img.src = map[k];
        img.onload = () => resolve({ k, img });
        img.onerror = (e) =>
          reject(new Error(`Failed to load image ${map[k]}`));
        img.crossOrigin = "anonymous";
      },
    );
  });
  return Promise.all(promises).then((pairs) => {
    const out: LoadedImages = {};
    for (const p of pairs) out[p.k] = p.img;
    return out;
  });
}

export function devicePixelScale(
  canvas: HTMLCanvasElement,
  logicalW: number,
  logicalH: number,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = logicalW + "px";
  canvas.style.height = logicalH + "px";
  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(logicalH * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing operations
  return dpr;
}

/**
 * drawBoardOnCtx
 * - ctx: CanvasRenderingContext2D (already transformed for DPR)
 * - logicalSize: width/height in CSS px for squares calculation
 * - board: 8x8 string codes
 * - images: loaded images map
 */

export function drawBoardOnCtx(
  ctx: CanvasRenderingContext2D,
  logicalSize: number,
  boardArr: string[][],
  images: LoadedImages,
) {
  const N = 8;
  const sq = logicalSize / N;
  // clear
  ctx.clearRect(0, 0, logicalSize, logicalSize);

  // Draw squares
  const light = "#f0d9b5";
  const dark = "#b58863";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const isLight = (r + c) % 2 === 0;
      ctx.fillStyle = isLight ? light : dark;
      ctx.fillRect(c * sq, r * sq, sq, sq);
    }
  }

  // Optional: coordinates (ranks/files)
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.font = `${Math.max(10, sq * 0.12)}px sans-serif`;
  ctx.textBaseline = "top";
  for (let r = 0; r < N; r++) {
    // rank numbers on left
    ctx.fillText(String(8 - r), 4, r * sq + 4);
  }
  ctx.textBaseline = "alphabetic";
  // files on bottom
  for (let c = 0; c < N; c++) {
    const file = String.fromCharCode("a".charCodeAt(0) + c);
    ctx.fillText(
      file,
      c * sq + sq - Math.max(10, sq * 0.12) - 2,
      logicalSize - 4,
    );
  }

  // Draw pieces
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const code = boardArr[r]![c];
      if (!code) continue;
      const img = images[code];
      if (!img) continue;
      // Fit image centered inside square, with padding
      const padding = sq * 0.08;
      const targetW = sq - padding * 2;
      const targetH = sq - padding * 2;
      // maintain aspect ratio of original
      const aspect = img.width / img.height;
      let dw = targetW;
      let dh = targetH;
      if (aspect > 1) {
        // wide
        dh = targetW / aspect;
      } else {
        dw = targetH * aspect;
      }
      const dx = c * sq + (sq - dw) / 2;
      const dy = r * sq + (sq - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }
}
