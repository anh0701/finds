<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import rabbitSprite from "@/assets/rabbit_sprites.png";
import { movePlayer } from "@/composables/movePlayer";
import type { Player } from "@/composables/models/player";
import { draw } from "@/composables/drawPlayer";
import { useObstacles } from "@/composables/useObstacles";
import type { Obstacle } from "@/composables/models/obstacle";

const canvas = ref<HTMLCanvasElement | null>(null);
const isAnimating = ref(true);

let facing = ref<"left" | "right">("right");

const player = ref<Player>({
  x: 50,
  y: 0,
  jump: false,
  velocity: 0,
});

const { obstacles, placeOnGround, drawObstacles } = useObstacles();

const keys: Record<string, boolean> = {};
let intervalId: number | undefined;

let handleKeyDown: (e: KeyboardEvent) => void;
let handleKeyUp: (e: KeyboardEvent) => void;

onMounted(async () => {
  await nextTick();

  const canvasEl = canvas.value!;
  const ctx = canvasEl.getContext("2d");

  if (!ctx) return;

  // DPI scale
  const rect = canvasEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvasEl.width = rect.width * dpr;
  canvasEl.height = rect.height * dpr;

  canvasEl.style.width = rect.width + "px";
  canvasEl.style.height = rect.height + "px";

  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = false;

  const W = rect.width;
  const H = rect.height;

  const sprite = new Image();
  sprite.src = rabbitSprite;

  sprite.onload = () => {
    const totalFrames = 4;

    const frameWidth = sprite.width / totalFrames;
    const frameHeight = sprite.height;

    const scale = 0.3;

    const drawWidth = frameWidth * scale;
    const drawHeight = frameHeight * scale;

    const groundHeight = 10;
    const groundY = H - groundHeight;

    player.value.y = groundY - drawHeight;

    placeOnGround(groundY);

    let frame = ref(0);

    function loop() {
      // ===== gravity luôn chạy =====
      player.value.y += player.value.velocity;
      player.value.velocity += 0.5;

      // ===== ground collision =====
      if (player.value.y >= groundY - drawHeight) {
        player.value.y = groundY - drawHeight;
        player.value.velocity = 0;
        player.value.jump = false;
      }

      movePlayer(
        keys,
        player.value,
        W,
        drawWidth,
        drawHeight,
        groundY,
        facing
      );

      draw(
        ctx,
        groundY,
        W,
        H,
        groundHeight,
        player,
        drawHeight,
        drawWidth,
        scale,
        facing,
        sprite,
        frame,
        frameWidth,
        frameHeight,
        isAnimating,
        totalFrames
      );

      drawObstacles(ctx!);

      // ===== obstacle collision =====
      let onObstacle = false;

      obstacles.value.forEach((obs: Obstacle) => {
        const playerBottom = player.value.y + drawHeight;
        const playerTop = player.value.y;

        const playerRight = player.value.x + drawWidth;
        const playerLeft = player.value.x;

        const obsBottom = obs.y + obs.height;
        const obsTop = obs.y;

        const obsRight = obs.x + obs.width;
        const obsLeft = obs.x;

        const isOverlap =
          playerRight > obsLeft &&
          playerLeft < obsRight &&
          playerBottom > obsTop &&
          playerTop < obsBottom;

        if (!isOverlap) return;

        // ===== đứng trên obstacle =====
        const landing =
          playerBottom >= obsTop &&
          playerBottom <= obsTop + 10 &&
          player.value.velocity >= 0;

        if (landing) {
          onObstacle = true;

          player.value.y = obsTop - drawHeight;
          player.value.velocity = 0;
          player.value.jump = false;

          return;
        }

        // ===== đâm ngang =====
        const overlapY =
          playerBottom > obsTop &&
          playerTop < obsBottom;

        if (overlapY) {
          if (keys["ArrowRight"] || keys["KeyD"]) {
            player.value.x = obsLeft - drawWidth;
          }

          if (keys["ArrowLeft"] || keys["KeyA"]) {
            player.value.x = obsRight;
          }
        }
      });

      // ===== rơi khỏi obstacle =====
      if (
        !onObstacle &&
        player.value.y < groundY - drawHeight
      ) {
        player.value.jump = true;
      }
    }

    intervalId = window.setInterval(loop, 120);
  };

  handleKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true;

    if (
      e.code === "Space" &&
      !player.value.jump
    ) {
      player.value.jump = true;
      player.value.velocity = -10;
    }

    if (e.code === "KeyS") {
      isAnimating.value = !isAnimating.value;
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    delete keys[e.code];
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  window.removeEventListener(
    "keydown",
    handleKeyDown
  );

  window.removeEventListener(
    "keyup",
    handleKeyUp
  );
});
</script>

<template>
  <div
    class="flex items-center justify-center w-full h-full bg-[#f3efe3] relative"
  >
    <canvas
      ref="canvas"
      class="h-[90vh] w-[90vw] block overflow-hidden border border-gray-300 rounded shadow bg-[#faf7ef]"
    ></canvas>

    <div
      class="absolute top-2 left-2 text-sm text-gray-700 font-mono"
    >
      ← → hoặc A D: di chuyển • Space: nhảy • S:
      bật/tắt animation
    </div>
  </div>
</template>

<style scoped>
canvas {
  image-rendering: pixelated;
}
</style>