import { ref } from "vue";

import { getLevelConfig } from "@/config/gameLevels";
import type { Point } from "@/composables/useSnakeGame";

const GRID_SIZE = 20;

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function useWallSystem() {
  const walls = ref<Point[]>([]);

  function setLevel(level: number, snake: Point[]): void {
    const config = getLevelConfig(level);

    walls.value = config.walls
      .filter(
        (wall) =>
          wall.x >= 0 &&
          wall.x < GRID_SIZE &&
          wall.y >= 0 &&
          wall.y < GRID_SIZE &&
          !snake.some((segment) => isSamePoint(segment, wall)),
      )
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
