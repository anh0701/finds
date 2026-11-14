import { ref } from "vue";

import { getLevelConfig } from "@/config/gameLevels";
import type { Point } from "@/types/game";

const GRID_SIZE = 20;
const SAFE_DISTANCE = 3;

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function isInsideBoard(point: Point): boolean {
  return (
    point.x >= 0 && point.x < GRID_SIZE && point.y >= 0 && point.y < GRID_SIZE
  );
}

function getSafePath(head: Point, direction: Point): Point[] {
  const safeCells: Point[] = [];

  for (let distance = 1; distance <= SAFE_DISTANCE; distance += 1) {
    safeCells.push({
      x: (head.x + direction.x * distance + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y * distance + GRID_SIZE) % GRID_SIZE,
    });
  }

  return safeCells;
}

export function useWallSystem() {
  const walls = ref<Point[]>([]);

  function setLevel(level: number, snake: Point[], direction: Point): void {
    const config = getLevelConfig(level);

    const head = snake[0];

    if (!head) {
      walls.value = [];
      return;
    }

    const safePath = getSafePath(head, direction);

    walls.value = config.walls
      .filter(isInsideBoard)
      .filter((wall) => !snake.some((segment) => isSamePoint(segment, wall)))
      .filter((wall) => !safePath.some((point) => isSamePoint(point, wall)))
      .map((wall) => ({ ...wall }));
  }

  function isWall(point: Point): boolean {
    return walls.value.some((wall) => isSamePoint(wall, point));
  }

  return {
    walls,
    setLevel,
    isWall,
  };
}
