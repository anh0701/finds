<template>
  <div
    class="h-screen overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 relative select-none"
  >
    <!-- HUD -->
    <div
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 px-5 py-2 rounded-xl text-white flex gap-4 font-bold"
    >
      <div>Score: {{ score }}</div>
      <div>Correct: {{ correct }}</div>
    </div>

    <!-- GAME OVER -->
    <div
      v-if="gameOver"
      class="fixed inset-0 bg-black/70 flex items-center justify-center text-white text-3xl font-bold z-50"
    >
      GAME OVER
    </div>

    <!-- WORLD -->
    <div class="absolute inset-0">
      <!-- PLATFORMS -->
      <div
        v-for="p in platforms"
        :key="p.id"
        class="absolute"
        :style="{
          left: p.x + 'px',
          top: p.y - cameraY + 'px',
          width: p.width + 'px',
          height: p.height + 'px',
        }"
      >
        <div
          class="w-full h-full rounded-full border-4"
          :class="platformStyle(p)"
        />

        <div
          v-if="p.type === 'question'"
          class="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center font-black"
        >
          ?
        </div>

        <div
          v-if="p.type === 'energy'"
          class="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center font-black"
        >
          ⚡
        </div>
      </div>

      <!-- PLAYER -->
      <div
        class="absolute bg-red-500 border-4 border-red-700 rounded-md"
        :style="{
          left: player.x + 'px',
          top: player.y - cameraY + 'px',
          width: player.width + 'px',
          height: player.height + 'px',
        }"
      />
    </div>

    <!-- QUESTION -->
    <QuestionModal v-if="question" :question="question" @answer="answer" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import questions from "@/data/questions.json";
import QuestionModal from "./QuestionModal.vue";

const score = ref(0);
const correct = ref(0);
const gameOver = ref(false);
const question = ref<any>(null);

const cameraY = ref(0);

const input = reactive({
  left: false,
  right: false,
});

const player = reactive({
  x: window.innerWidth / 2,
  y: 300,
  vx: 0,
  vy: 0,
  width: 40,
  height: 40,
  grounded: false,
});

const platforms = ref<any[]>([]);
const PLATFORM_GAP = 110;

let rafId: number | null = null;

function platformStyle(p: any) {
  if (p.type === "energy") return "bg-blue-400 border-blue-600";
  if (p.type === "question") return "bg-yellow-400 border-yellow-600";
  return "bg-green-500 border-green-700";
}

function getW() {
  return window.innerWidth;
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code === "ArrowLeft") input.left = true;
  if (e.code === "ArrowRight") input.right = true;
  if (e.code === "Space") jump();
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code === "ArrowLeft") input.left = false;
  if (e.code === "ArrowRight") input.right = false;
}

function movePlayer() {
  const speed = 3.2;

  if (input.left) player.vx = -speed;
  else if (input.right) player.vx = speed;
  else player.vx *= 0.85;

  player.x += player.vx;
}

function jump() {
  if (!player.grounded) return;
  player.vy = -9; // nhẹ hơn
}

function physics() {
  const gravity = 0.35;

  player.vy += gravity;

  const nextY = player.y + player.vy;
  const prevBottom = player.y + player.height;
  const nextBottom = nextY + player.height;

  player.grounded = false;

  for (const p of platforms.value) {
    const isOverlappingX =
      player.x + player.width > p.x && player.x < p.x + p.width;

    const isLanding =
      player.vy >= 0 &&
      isOverlappingX &&
      prevBottom <= p.y &&
      nextBottom >= p.y;

    if (!isLanding) continue;

    player.y = p.y - player.height;
    player.vy = 0;
    player.grounded = true;

    if (p.type === "question" && !p.used) {
      p.used = true;
      question.value = questions[p.qId];
    }

    if (p.type === "energy" && !p.used) {
      player.vy = -11;
      p.used = true;
    }

    return;
  }

  player.y = nextY;

  if (player.y - cameraY.value > window.innerHeight + 200) {
    triggerGameOver();
  }
}

function updateCamera() {
  const target = player.y - 180;
  cameraY.value += (target - cameraY.value) * 0.09;
}

function createPlatform(y: number, prevX: number) {
  const r = Math.random();

  let type = "normal";
  if (r > 0.85) type = "energy";
  else if (r > 0.7) type = "question";

  let x = prevX + (Math.random() * 140 - 70);
  x = Math.max(20, Math.min(x, getW() - 140));

  return {
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    x,
    y,
    width: 140,
    height: 18,
    type,
    qId:
      type === "question" ? Math.floor(Math.random() * questions.length) : null,
    used: false,
  };
}

function initWorld() {
  const list: any[] = [];
  let prevX = getW() / 2;

  for (let i = 0; i < 18; i++) {
    const y = 600 - i * PLATFORM_GAP;
    const p = createPlatform(y, prevX);
    prevX = p.x;
    list.push(p);
  }

  platforms.value = list;
}

function spawn() {
  const highest = Math.min(...platforms.value.map((p) => p.y));

  if (highest > cameraY.value - 500) {
    platforms.value.push(
      createPlatform(highest - PLATFORM_GAP, Math.random() * getW()),
    );
  }
}

function checkRules() {}

function answer(c: string) {
  if (!question.value || gameOver.value) return;

  const ok = c === question.value.answer;

  if (ok) {
    score.value += 100;
    correct.value += 1;
    player.vy = -10;
  } else {
    player.vy = -5;
  }

  question.value = null;
}

function triggerGameOver() {
  gameOver.value = true;
  if (rafId) cancelAnimationFrame(rafId);
}

function loop() {
  if (gameOver.value) return;

  movePlayer();
  physics();
  updateCamera();
  spawn();
  checkRules();

  rafId = requestAnimationFrame(loop);
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  initWorld();
  loop();
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);

  if (rafId) cancelAnimationFrame(rafId);
});
</script>
