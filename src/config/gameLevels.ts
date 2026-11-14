import type { Point } from "@/composables/useSnakeGame";

export interface LevelConfig {
  level: number;
  walls: Point[];
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    walls: [],
  },
  {
    level: 2,
    walls: [
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 13, y: 14 },
      { x: 14, y: 14 },
      { x: 15, y: 14 },
    ],
  },
  {
    level: 3,
    walls: [
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 12, y: 15 },
      { x: 13, y: 15 },
      { x: 14, y: 15 },
      { x: 15, y: 15 },
      { x: 9, y: 7 },
      { x: 10, y: 7 },
    ],
  },
  {
    level: 4,
    walls: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 13, y: 15 },
      { x: 14, y: 15 },
      { x: 15, y: 15 },
      { x: 16, y: 15 },
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
      { x: 9, y: 6 },
      { x: 10, y: 13 },
      { x: 10, y: 14 },
      { x: 10, y: 15 },
      { x: 10, y: 16 },
    ],
  },
  {
    level: 5,
    walls: [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 13, y: 3 },
      { x: 14, y: 3 },
      { x: 15, y: 3 },
      { x: 16, y: 3 },

      { x: 3, y: 16 },
      { x: 4, y: 16 },
      { x: 5, y: 16 },
      { x: 6, y: 16 },
      { x: 13, y: 16 },
      { x: 14, y: 16 },
      { x: 15, y: 16 },
      { x: 16, y: 16 },

      { x: 8, y: 5 },
      { x: 8, y: 6 },
      { x: 8, y: 7 },
      { x: 11, y: 12 },
      { x: 11, y: 13 },
      { x: 11, y: 14 },
    ],
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find((item) => item.level === level);

  // Levels above 5 retain the most difficult available layout.
  return config ?? LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1]!;
}
