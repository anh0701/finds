<script setup lang="ts">
import type { Point } from "@/types/game";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  snake: Point[];
  food: Point;
  walls: Point[];
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

function drawWalls(context: CanvasRenderingContext2D) {
  props.walls.forEach((wall) => {
    const inset = 2;
    const x = wall.x * CELL_SIZE + inset;
    const y = wall.y * CELL_SIZE + inset;
    const size = CELL_SIZE - inset * 2;

    context.save();

    // Hình dạng khối gỗ
    const path = new Path2D();
    path.roundRect(x, y, size, size, 5);

    // Màu gỗ chuyển sắc
    const gradient = context.createLinearGradient(x, y, x + size, y + size);

    gradient.addColorStop(0, "#d69a55");
    gradient.addColorStop(0.45, "#a96832");
    gradient.addColorStop(1, "#70401f");

    context.fillStyle = gradient;
    context.fill(path);

    // Viền gỗ
    context.strokeStyle = "#e8b878";
    context.lineWidth = 1.5;
    context.stroke(path);

    // Giới hạn vân gỗ bên trong khối
    context.clip(path);

    // Các đường vân gỗ
    context.strokeStyle = "rgba(65, 34, 15, 0.45)";
    context.lineWidth = 1;

    for (let index = 0; index < 3; index++) {
      const grainY = y + 6 + index * 6;

      context.beginPath();
      context.moveTo(x + 3, grainY);

      context.bezierCurveTo(
        x + 7,
        grainY - 2,
        x + 12,
        grainY + 2,
        x + size - 3,
        grainY,
      );

      context.stroke();
    }

    // Vân xoáy nhỏ trên gỗ
    context.strokeStyle = "rgba(70, 35, 15, 0.55)";
    context.lineWidth = 1;

    context.beginPath();
    context.ellipse(x + size * 0.55, y + size * 0.5, 3, 2, 0, 0, Math.PI * 2);
    context.stroke();

    // Ánh sáng trên cạnh khối gỗ
    context.strokeStyle = "rgba(255, 224, 170, 0.45)";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(x + 5, y + 3);
    context.lineTo(x + size - 5, y + 3);
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
