<template>
  <div class="w-full" style="max-width: 900px; margin: auto">
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" />
  </div>
</template>

<script setup lang="ts">
import {
  devicePixelScale,
  drawBoardOnCtx,
  loadImages,
} from "@/composables/chess/drawBoard";
import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * CONFIG
 * - board: 8x8 array using piece codes like "wP", "bK", ""(empty)
 * - pieceImages: either map of code -> URL (individual files), or one sprite sheet config
 */

const board = ref<string[][]>([
  ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
]);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const logicalSize = 800; // desired logical px for square dimensions (will scale)
const canvasWidth = logicalSize;
const canvasHeight = logicalSize;

let rafId: number | null = null;

const pieceUrls: Record<string, string> = {
  wK: "/pieces/wK.png",
  wQ: "/pieces/wQ.png",
  wR: "/pieces/wR.png",
  wB: "/pieces/wB.png",
  wN: "/pieces/wN.png",
  wP: "/pieces/wP.png",
  bK: "/pieces/bK.png",
  bQ: "/pieces/bQ.png",
  bR: "/pieces/bR.png",
  bB: "/pieces/bB.png",
  bN: "/pieces/bN.png",
  bP: "/pieces/bP.png",
};

export type LoadedImages = Record<string, HTMLImageElement>;

// --- main mount: load images, draw once and on resize ---
let loadedImages: LoadedImages | null = null;

async function initAndDraw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  try {
    loadedImages = await loadImages(pieceUrls);
  } catch (err) {
    console.error("Image load error:", err);
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // scale for device pixel ratio
  devicePixelScale(canvas, canvasWidth, canvasHeight);

  // draw immediately
  drawBoardOnCtx(ctx, canvasWidth, board.value, loadedImages);

  // optionally animate / redraw loop (useful if board changes)
  if (rafId != null) cancelAnimationFrame(rafId);
  function loop() {
    // if board changes often you might diff; here we redraw every frame for simplicity
    drawBoardOnCtx(
      ctx!,
      canvasWidth,
      board.value,
      loadedImages as LoadedImages,
    );
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

// handle resize: recompute CSS size if parent width changes
// function handleResize() {
//   const canvas = canvasRef.value;
//   if (!canvas) return;
//   // Example: fit to parent width while keeping square
//   const parent = canvas.parentElement;
//   if (!parent) return;
//   const computed = parent.clientWidth;
//   const target = Math.min(computed, logicalSize);
//   devicePixelScale(canvas, target, target);
// }

onMounted(() => {
  initAndDraw();
  // window.addEventListener("resize", handleResize);
});

// onBeforeUnmount(() => {
//   if (rafId != null) cancelAnimationFrame(rafId);
//   window.removeEventListener("resize", handleResize);
// });
</script>

<style scoped>
canvas {
  display: block;
  max-width: 100%;
  background: transparent;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}
</style>
