<template>
  <div
    class="min-h-screen bg-slate-900 flex flex-col items-center p-4 md:pt-6 text-white"
  >
    <!-- HUD -->
    <div
      class="w-full max-w-[900px] px-2 flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4"
    >
      <!-- TITLE -->
      <h1 class="text-2xl md:text-3xl font-black">English Quiz Platformer</h1>

      <!-- HUD INFO -->
      <div class="flex gap-3 flex-wrap">
        <!-- LEVEL -->
        <div
          class="bg-slate-800 px-4 py-2 rounded-xl font-bold text-sm md:text-base"
        >
          Level {{ currentLevel.id }}
        </div>

        <!-- SCORE -->
        <div
          class="bg-slate-800 px-4 py-2 rounded-xl font-bold text-sm md:text-base"
        >
          Score:
          {{ score }}/{{ currentLevel.requiredScore }}
        </div>
      </div>
    </div>

    <!-- GAME WRAPPER -->
    <div
      ref="gameWrapper"
      class="w-full overflow-x-auto flex justify-start md:justify-center"
    >
      <!-- GAME -->
      <div
        class="relative overflow-hidden border-4 border-white rounded-2xl bg-sky-300 shadow-2xl shrink-0"
        :style="{
          width: currentLevel.worldWidth + 'px',

          height: currentLevel.worldHeight + 'px',
        }"
        style="touch-action: none"
      >
        <!-- GROUNDS -->
        <div
          v-for="ground in grounds"
          :key="ground.id"
          class="absolute bg-green-800"
          :style="{
            left: ground.x + 'px',
            top: ground.y + 'px',
            width: ground.width + 'px',
            height: ground.height + 'px',
          }"
        />

        <!-- QUESTION BLOCKS -->
        <div
          v-for="block in questionBlocks"
          :key="block.id"
          class="absolute w-[50px] h-[50px] rounded-lg border-4 border-yellow-600 bg-yellow-400 flex items-center justify-center text-2xl font-black text-black transition"
          :style="{
            left: block.x + 'px',
            top: block.y + 'px',
            opacity: block.answered ? 0.3 : 1,
          }"
        >
          ?
        </div>

        <!-- PLAYER -->
        <div
          class="absolute w-[40px] h-[40px] rounded-lg bg-red-500 border-2 border-red-700 transition-[left,top] duration-75"
          :style="{
            left: player.x + 'px',
            top: player.y + 'px',
          }"
        />
      </div>
    </div>

    <!-- LEVEL COMPLETE -->
    <div
      v-if="isWin"
      class="mt-6 text-3xl md:text-5xl font-black text-yellow-300 animate-bounce text-center"
    >
      LEVEL COMPLETE
    </div>

    <!-- GAME FINISHED -->
    <div
      v-if="isGameFinished"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4"
    >
      <div
        class="w-[90vw] max-w-[500px] bg-slate-900 border-4 border-yellow-400 rounded-3xl p-6 md:p-10 flex flex-col items-center gap-6 shadow-2xl"
      >
        <!-- TITLE -->
        <h1
          class="text-4xl md:text-6xl font-black text-yellow-300 tracking-[4px] md:tracking-[6px] animate-pulse text-center"
        >
          YOU WIN
        </h1>

        <!-- TEXT -->
        <p
          class="text-slate-300 text-base md:text-xl font-semibold text-center"
        >
          All levels completed
        </p>

        <!-- BUTTON -->
        <button
          @click="restartGame"
          class="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-yellow-400 text-black font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>

    <!-- MOBILE CONTROLS -->
    <div
      class="fixed bottom-4 left-0 right-0 flex justify-between px-6 md:hidden z-40 pointer-events-none"
    >
      <!-- LEFT / RIGHT -->
      <div class="flex gap-4 pointer-events-auto">

        <button
          @touchstart.prevent="mobileControls.left = true"
          @touchend="mobileControls.left = false"
          class="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur border border-white/20 text-2xl font-black active:scale-95"
        >
          L
        </button>

        <button
          @touchstart.prevent="mobileControls.right = true"
          @touchend="mobileControls.right = false"
          class="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur border border-white/20 text-2xl font-black active:scale-95"
        >
          R
        </button>
      </div>

      <!-- JUMP -->
      <div class="pointer-events-auto">
        <button
          @touchstart.prevent="mobileControls.jump = true"
          class="w-20 h-20 rounded-full bg-yellow-400/90 text-black font-black text-xl border-4 border-yellow-200 shadow-xl active:scale-95"
        >
          JUMP
        </button>
      </div>
    </div>

    <!-- QUESTION -->
    <QuestionModal
      v-if="currentQuestion"
      :question="currentQuestion"
      @answer="handleAnswer"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, nextTick } from "vue";

import QuestionModal from "./QuestionModal.vue";

import questionsData from "../data/questions.json";

import { levels } from "../data/levels";

import type {
  Level,
  Ground,
  Question,
  QuestionBlock,
  Player,
  Rect,
} from "../types/game";
import { useKeyboard } from "@/composable/useKeyboard";

const gravity = 0.6;

const jumpForce = -12;

const { keys } = useKeyboard();

const gameWrapper = ref<HTMLDivElement | null>(null);

if (levels.length === 0) {
  throw new Error("Levels data is empty");
}

const currentLevel = ref<Level>(levels[0]!);

const currentLevelIndex = ref(0);

const grounds = ref<Ground[]>(currentLevel.value.grounds);

const questionBlocks = ref<QuestionBlock[]>(
  JSON.parse(JSON.stringify(currentLevel.value.questionBlocks)),
);

const mobileControls = reactive({
  left: false,
  right: false,
  jump: false,
});

const player = reactive<Player>({
  x: currentLevel.value.playerStart.x,

  y: currentLevel.value.playerStart.y,

  width: 40,

  height: 40,

  velocityY: 0,

  speed: 5,

  isJumping: false,
});

const currentQuestion = ref<Question | null>(null);

const activeBlockId = ref<number | null>(null);

const score = ref(0);

const isWin = ref(false);

const isGameFinished = ref(false);

function isColliding(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function focusPlayer() {
  nextTick(() => {
    if (!gameWrapper.value) return;

    // desktop không follow
    if (window.innerWidth >= 768) return;

    const wrapper = gameWrapper.value;

    const screenWidth = wrapper.clientWidth;

    let target = player.x - screenWidth / 2 + player.width / 2;

    // LEFT LIMIT
    if (target < 0) {
      target = 0;
    }

    // RIGHT LIMIT
    const maxScroll = currentLevel.value.worldWidth - screenWidth;

    if (target > maxScroll) {
      target = maxScroll;
    }

    // SMOOTH FOLLOW
    wrapper.scrollLeft += (target - wrapper.scrollLeft) * 0.1;
  });
}

function loadLevel(index: number) {
  const level = levels[index];

  if (!level) return;

  currentLevel.value = level;

  grounds.value = level.grounds;

  questionBlocks.value = JSON.parse(JSON.stringify(level.questionBlocks));

  score.value = 0;

  player.x = level.playerStart.x;

  player.y = level.playerStart.y;

  player.velocityY = 0;

  isWin.value = false;

  focusPlayer();
}

function nextLevel() {
  const nextIndex = currentLevelIndex.value + 1;

  // FINISHED GAME
  if (nextIndex >= levels.length) {
    isGameFinished.value = true;

    return;
  }

  currentLevelIndex.value = nextIndex;

  loadLevel(nextIndex);
}

function restartGame() {
  currentLevelIndex.value = 0;

  isGameFinished.value = false;

  loadLevel(0);
}

function update() {
  // STOP GAME
  if (isGameFinished.value) return;

  // STOP WHEN QUESTION OPEN
  if (currentQuestion.value) return;

  // MOVE LEFT
  if (keys.value["ArrowLeft"] || mobileControls.left) {
    player.x -= player.speed;
  }

  // MOVE RIGHT
  if (keys.value["ArrowRight"] || mobileControls.right) {
    player.x += player.speed;
  }

  // LEFT WALL
  if (player.x < 0) {
    player.x = 0;
  }

  // RIGHT WALL
  if (player.x + player.width > currentLevel.value.worldWidth) {
    player.x = currentLevel.value.worldWidth - player.width;
  }

  // MOBILE CAMERA FOLLOW
  focusPlayer();

  // JUMP
  if ((keys.value["Space"] || mobileControls.jump) && !player.isJumping) {
    player.velocityY = jumpForce;

    player.isJumping = true;
  }

  // GRAVITY
  player.velocityY += gravity;

  player.y += player.velocityY;

  // FALL OUTSIDE MAP
  if (player.y > currentLevel.value.worldHeight + 200) {
    player.x = currentLevel.value.playerStart.x;

    player.y = currentLevel.value.playerStart.y;

    player.velocityY = 0;
  }

  // RESET
  player.isJumping = true;

  // reset mobile jump
  mobileControls.jump = false;

  // GROUND COLLISION
  for (const ground of grounds.value) {
    if (isColliding(player, ground)) {
      if (player.velocityY >= 0) {
        player.y = ground.y - player.height;

        player.velocityY = 0;

        player.isJumping = false;
      }
    }
  }

  // QUESTION COLLISION
  for (const block of questionBlocks.value) {
    if (
      !block.answered &&
      isColliding(player, block) &&
      !currentQuestion.value
    ) {
      activeBlockId.value = block.id;

      const question = questionsData.find((q) => q.id === block.questionId);

      if (question) {
        currentQuestion.value = question;
      }
    }
  }

  // COMPLETE LEVEL
  if (score.value >= currentLevel.value.requiredScore && !isWin.value) {
    isWin.value = true;

    setTimeout(() => {
      nextLevel();
    }, 1500);
  }
}

function handleAnswer(choice: string) {
  if (!currentQuestion.value) return;

  if (choice === currentQuestion.value.answer) {
    score.value++;

    const block = questionBlocks.value.find(
      (b) => b.id === activeBlockId.value,
    );

    if (block) {
      block.answered = true;
    }
  }

  currentQuestion.value = null;
}

let animationId = 0;

function gameLoop() {
  update();

  animationId = requestAnimationFrame(gameLoop);
}

onMounted(() => {
  focusPlayer();

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>
