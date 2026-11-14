<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Point } from "@/composables/useSnakeGame";

const props = defineProps<{
  snake: Point[];
  food: Point;
  walls: Point[];
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

function drawWalls(context: CanvasRenderingContext2D): void {
  props.walls.forEach((wall) => {
    const x = wall.x * CELL_SIZE;
    const y = wall.y * CELL_SIZE;

    context.save();

    context.shadowColor = "#64748b";
    context.shadowBlur = 7;

    context.fillStyle = "#475569";
    context.strokeStyle = "#94a3b8";
    context.lineWidth = 1;

    context.beginPath();
    context.roundRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 5);

    context.fill();
    context.stroke();

    context.restore();
  });
}

function drawFood(context: CanvasRenderingContext2D): void {
  if (props.food.x < 0 || props.food.y < 0) return;

  context.save();

  context.shadowColor = "#ff4ecd";
  context.shadowBlur = 18;
  context.fillStyle = "#ff4ecd";

  context.beginPath();
  context.arc(
    props.food.x * CELL_SIZE + CELL_SIZE / 2,
    props.food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE * 0.34,
    0,
    Math.PI * 2,
  );

  context.fill();
  context.restore();
}

function drawSnake(context: CanvasRenderingContext2D): void {
  props.snake.forEach((segment, index) => {
    const inset = 2;

    context.save();

    context.shadowColor = "#39ff88";
    context.shadowBlur = index === 0 ? 18 : 8;
    context.fillStyle = index === 0 ? "#b7ffd2" : "#39ff88";

    context.beginPath();

    context.roundRect(
      segment.x * CELL_SIZE + inset,
      segment.y * CELL_SIZE + inset,
      CELL_SIZE - inset * 2,
      CELL_SIZE - inset * 2,
      6,
    );

    context.fill();
    context.restore();
  });
}

function drawBoard(): void {
  const element = canvas.value;
  const context = element?.getContext("2d");

  if (!element || !context) return;

  context.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  // Background
  context.fillStyle = "#0d1324";
  context.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  // Grid
  context.strokeStyle = "#1a2540";
  context.lineWidth = 1;

  for (let index = 0; index <= GRID_SIZE; index += 1) {
    const position = index * CELL_SIZE;

    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, BOARD_SIZE);
    context.stroke();

    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(BOARD_SIZE, position);
    context.stroke();
  }

  drawWalls(context);
  drawFood(context);
  drawSnake(context);
}

onMounted(drawBoard);

watch(() => [props.snake, props.food, props.walls] as const, drawBoard, {
  deep: true,
});
</script>

<template>
  <canvas
    ref="canvas"
    :width="BOARD_SIZE"
    :height="BOARD_SIZE"
    class="block aspect-square w-full rounded-2xl bg-[#0d1324]"
  />
</template>
