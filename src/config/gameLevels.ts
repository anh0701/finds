import type { Point } from "@/types/game";

export interface LevelConfig {
  level: number;
  walls: Point[];
}

const GRID_SIZE = 20;

// Các mẫu bản đồ cơ bản.
const LEVEL_PATTERNS: Point[][] = [
  // Level 1
  [],

  // Level 2
  [
    { x: 4, y: 5 },
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 13, y: 14 },
    { x: 14, y: 14 },
    { x: 15, y: 14 },
  ],

  // Level 3
  [
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

  // Level 4
  [
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

  // Level 5
  [
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
];

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function rotatePoint(point: Point, turns: number): Point {
  let { x, y } = point;

  for (let index = 0; index < turns; index += 1) {
    const nextX = GRID_SIZE - 1 - y;
    const nextY = x;

    x = nextX;
    y = nextY;
  }

  return { x, y };
}

function transformPattern(
  pattern: Point[],
  rotation: number,
  mirror: boolean,
): Point[] {
  return pattern.map((point) => {
    const transformed = mirror
      ? { x: GRID_SIZE - 1 - point.x, y: point.y }
      : { ...point };

    return rotatePoint(transformed, rotation);
  });
}

// Bộ tạo số giả ngẫu nhiên ổn định theo level.
function createRandom(seed: number): () => number {
  let value = seed || 1;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function addExtraWalls(level: number, walls: Point[]): Point[] {
  const result = [...walls];

  // Số cụm tường tăng từ từ và có giới hạn.
  const extraGroups = Math.min(2 + Math.floor((level - 6) / 3), 12);

  const random = createRandom(level * 7919);

  const directions: Point[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  let attempts = 0;
  let addedGroups = 0;

  while (addedGroups < extraGroups && attempts < 200) {
    attempts += 1;

    const x = 2 + Math.floor(random() * 16);
    const y = 2 + Math.floor(random() * 16);

    const direction = directions[Math.floor(random() * directions.length)]!;

    const group = [
      { x, y },
      { x: x + direction.x, y: y + direction.y },
    ];

    const isValid = group.every(
      (point) =>
        point.x >= 2 &&
        point.x <= 17 &&
        point.y >= 2 &&
        point.y <= 17 &&
        !result.some((wall) => isSamePoint(wall, point)),
    );

    if (!isValid) continue;

    result.push(...group);
    addedGroups += 1;
  }

  return result;
}

export function getLevelConfig(level: number): LevelConfig {
  const safeLevel = Math.max(1, Math.floor(level));

  const patternIndex = (safeLevel - 1) % LEVEL_PATTERNS.length;
  const cycle = Math.floor((safeLevel - 1) / LEVEL_PATTERNS.length);

  const pattern = LEVEL_PATTERNS[patternIndex] ?? [];

  // Level 1–5 giữ nguyên bản đồ gốc.
  if (safeLevel <= 5) {
    return {
      level: safeLevel,
      walls: pattern.map((wall) => ({ ...wall })),
    };
  }

  // Các level tiếp theo thay đổi hướng và hình dạng bản đồ.
  const rotation = cycle % 4;
  const mirror = cycle % 2 === 1;

  const transformedWalls = transformPattern(pattern, rotation, mirror);

  const walls = addExtraWalls(safeLevel, transformedWalls);

  return {
    level: safeLevel,
    walls,
  };
}
