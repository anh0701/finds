import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { useWallSystem } from "@/composables/useWallSystem";
import type { Point } from "@/types/game";

// Giữ export này để các file cũ đang import Point không bị lỗi.
export type { Point } from "@/types/game";

export interface SnakeGameOptions {
  onLevelTargetReached?: (level: number, score: number) => void;
  isInputBlocked?: () => boolean;
}

const GRID_SIZE = 20;

const GAME_SPEED = 250;

export const SCORE_PER_FOOD = 10;
export const TARGET_SCORE = 50;

const BASE_TARGET_SCORE = 50;
const TARGET_SCORE_STEP = 10;
const MAX_TARGET_SCORE = 100;

const SCORE_STORAGE_KEY = "snake-best";

const INITIAL_SNAKE: Point[] = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];

const INITIAL_DIRECTION: Point = { x: 1, y: 0 };

const KEY_DIRECTIONS: Record<string, Point> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },

  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },

  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },

  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};

// ------------------------------------
// Helpers
// ------------------------------------

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function createSnake(): Point[] {
  return INITIAL_SNAKE.map((segment) => ({ ...segment }));
}

function isWall(point: Point, walls: Point[]): boolean {
  return walls.some((wall) => isSamePoint(wall, point));
}

/**
 * Tìm các ô có thể tiếp cận từ đầu rắn.
 * Bàn chơi sử dụng cơ chế đi xuyên biên (wrap around).
 */
function getReachableCells(head: Point, walls: Point[]): Point[] {
  const visited = new Set<string>();
  const queue: Point[] = [{ ...head }];
  const reachable: Point[] = [];

  const directions: Point[] = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  visited.add(`${head.x},${head.y}`);

  let index = 0;

  while (index < queue.length) {
    const current = queue[index];

    index += 1;

    if (!current) continue;

    reachable.push(current);

    for (const direction of directions) {
      const next: Point = {
        x: (current.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (current.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      const key = `${next.x},${next.y}`;

      if (visited.has(key)) continue;
      if (isWall(next, walls)) continue;

      visited.add(key);
      queue.push(next);
    }
  }

  return reachable;
}

/**
 * Tạo thức ăn:
 * - Không trùng thân rắn.
 * - Không trùng tường.
 * - Chỉ xuất hiện ở vùng có thể tiếp cận.
 */
function createFood(snake: Point[], walls: Point[]): Point {
  const head = snake[0];

  if (!head) {
    return { x: -1, y: -1 };
  }

  const reachableCells = getReachableCells(head, walls);

  const availableCells = reachableCells.filter(
    (point) =>
      !snake.some((segment) => isSamePoint(segment, point)) &&
      !isWall(point, walls),
  );

  if (availableCells.length === 0) {
    return { x: -1, y: -1 };
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);

  return availableCells[randomIndex] ?? { x: -1, y: -1 };
}

function readBestScore(): number {
  try {
    return Number(window.localStorage.getItem(SCORE_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

// ------------------------------------
// Main composable
// ------------------------------------

export function useSnakeGame(options: SnakeGameOptions = {}) {
  // ------------------------------------
  // Game state
  // ------------------------------------

  const snake = ref<Point[]>(createSnake());

  const score = ref(0);
  const levelScore = ref(0);
  const bestScore = ref(0);

  const level = ref(1);

  // ------------------------------------
  // Wall system
  // ------------------------------------

  const wallSystem = useWallSystem();

  let direction: Point = { ...INITIAL_DIRECTION };
  let nextDirection: Point = { ...INITIAL_DIRECTION };

  wallSystem.setLevel(level.value, snake.value, direction);

  const walls = wallSystem.walls;

  const food = ref<Point>(createFood(snake.value, walls.value));

  // ------------------------------------
  // Game flags
  // ------------------------------------

  const isPlaying = ref(false);
  const isStarted = ref(false);
  const isGameOver = ref(false);
  const isWon = ref(false);

  const isLevelTestRequired = ref(false);

  let timer: ReturnType<typeof setTimeout> | undefined;

  // ------------------------------------
  // Computed state
  // ------------------------------------

  const targetScore = computed(() =>
    Math.min(
      BASE_TARGET_SCORE + (level.value - 1) * TARGET_SCORE_STEP,
      MAX_TARGET_SCORE,
    ),
  );

  const levelProgress = computed(() =>
    Math.min((levelScore.value / targetScore.value) * 100, 100),
  );

  const isTargetReached = computed(() => levelScore.value >= targetScore.value);

  // Tốc độ luôn cố định, không phụ thuộc level.
  const speed = computed(() => GAME_SPEED);

  const speedMultiplier = computed(() => "1.0");

  // ------------------------------------
  // Timer
  // ------------------------------------

  function stopTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  }

  function scheduleNextMove(): void {
    stopTimer();

    if (!isPlaying.value) return;

    timer = setTimeout(move, GAME_SPEED);
  }

  // ------------------------------------
  // Score
  // ------------------------------------

  function saveBestScore(): void {
    if (score.value <= bestScore.value) return;

    bestScore.value = score.value;

    try {
      window.localStorage.setItem(SCORE_STORAGE_KEY, String(bestScore.value));
    } catch {
      // Game vẫn hoạt động nếu localStorage không khả dụng.
    }
  }

  function addScore(points: number = SCORE_PER_FOOD): void {
    if (
      points <= 0 ||
      isGameOver.value ||
      isWon.value ||
      isLevelTestRequired.value
    ) {
      return;
    }

    score.value += points;
    levelScore.value += points;

    saveBestScore();

    if (levelScore.value >= targetScore.value) {
      reachLevelTarget();
    }
  }

  // ------------------------------------
  // Level progression
  // ------------------------------------

  function reachLevelTarget(): void {
    if (isLevelTestRequired.value) return;

    stopTimer();

    isPlaying.value = false;
    isLevelTestRequired.value = true;

    options.onLevelTargetReached?.(level.value, levelScore.value);
  }

  /**
   * Được gọi sau khi hoàn thành bài kiểm tra.
   *
   * PASS:
   * - Tăng level.
   * - Reset điểm level.
   * - Tạo bản đồ mới.
   * - Tạo thức ăn ở vị trí có thể tiếp cận.
   * - Tiếp tục game với tốc độ cũ.
   *
   * FAIL:
   * - Giữ nguyên level và điểm.
   * - Giữ game ở trạng thái tạm dừng.
   */
  function completeLevelTest(passed: boolean): void {
    if (!isLevelTestRequired.value) return;

    stopTimer();

    if (!passed) {
      isPlaying.value = false;
      return;
    }

    level.value += 1;
    levelScore.value = 0;

    // Xóa trạng thái chờ bài kiểm tra.
    isLevelTestRequired.value = false;

    // Tạo bản đồ mới, bảo vệ hướng di chuyển hiện tại.
    wallSystem.setLevel(level.value, snake.value, direction);

    // Đảm bảo thức ăn nằm ngoài tường và thân rắn.
    food.value = createFood(snake.value, walls.value);

    startGame();
  }

  // ------------------------------------
  // Game lifecycle
  // ------------------------------------

  function resetGame(): void {
    stopTimer();

    snake.value = createSnake();

    score.value = 0;
    levelScore.value = 0;
    level.value = 1;

    direction = { ...INITIAL_DIRECTION };
    nextDirection = { ...INITIAL_DIRECTION };

    wallSystem.setLevel(level.value, snake.value, direction);

    food.value = createFood(snake.value, walls.value);

    isPlaying.value = false;
    isStarted.value = false;
    isGameOver.value = false;
    isWon.value = false;

    isLevelTestRequired.value = false;
  }

  function endGame(won = false): void {
    stopTimer();

    isPlaying.value = false;
    isGameOver.value = !won;
    isWon.value = won;

    saveBestScore();
  }

  function pauseGame(): void {
    if (!isPlaying.value) return;

    isPlaying.value = false;
    stopTimer();
  }

  function startGame(): void {
    if (isPlaying.value || isLevelTestRequired.value) {
      return;
    }

    if (isGameOver.value || isWon.value) {
      resetGame();
    }

    isStarted.value = true;
    isPlaying.value = true;

    scheduleNextMove();
  }

  function toggleGame(): void {
    if (isPlaying.value) {
      pauseGame();
      return;
    }

    startGame();
  }

  // ------------------------------------
  // Snake movement
  // ------------------------------------

  function changeDirection(next: Point): void {
    if (!isPlaying.value) return;

    // Không cho phép quay ngược trực tiếp vào thân.
    if (next.x === -direction.x && next.y === -direction.y) {
      return;
    }

    nextDirection = next;
  }

  function move(): void {
    if (!isPlaying.value) return;

    direction = { ...nextDirection };

    const head = snake.value[0];

    if (!head) return;

    // Di chuyển xuyên biên.
    const nextHead: Point = {
      x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    const willEat = isSamePoint(nextHead, food.value);

    // ------------------------------------
    // Wall collision
    // ------------------------------------

    if (wallSystem.isWall(nextHead)) {
      endGame();
      return;
    }

    // ------------------------------------
    // Self collision
    // ------------------------------------

    // Đuôi sẽ rời vị trí hiện tại nếu không ăn thức ăn.
    const bodyToCheck = willEat ? snake.value : snake.value.slice(0, -1);

    const hitSelf = bodyToCheck.some((segment) =>
      isSamePoint(segment, nextHead),
    );

    if (hitSelf) {
      endGame();
      return;
    }

    // ------------------------------------
    // Update snake
    // ------------------------------------

    const nextSnake = [nextHead, ...snake.value];

    if (!willEat) {
      nextSnake.pop();
    }

    snake.value = nextSnake;

    // ------------------------------------
    // Eat food
    // ------------------------------------

    if (willEat) {
      addScore(SCORE_PER_FOOD);

      const availableCellCount = GRID_SIZE * GRID_SIZE - walls.value.length;

      if (nextSnake.length >= availableCellCount) {
        endGame(true);
        return;
      }

      food.value = createFood(nextSnake, walls.value);

      // Không tiếp tục di chuyển trong lúc làm bài kiểm tra.
      if (isLevelTestRequired.value) {
        return;
      }

      // Không còn thức ăn có thể tiếp cận.
      if (food.value.x < 0 || food.value.y < 0) {
        endGame(true);
        return;
      }
    }

    scheduleNextMove();
  }

  // ------------------------------------
  // Keyboard controls
  // ------------------------------------

  function handleKeydown(event: KeyboardEvent): void {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    if (options.isInputBlocked?.()) {
      const key = event.key.toLowerCase();

      if (key in KEY_DIRECTIONS || key === " ") {
        event.preventDefault();
      }

      return;
    }

    const key = event.key.toLowerCase();
    const next = KEY_DIRECTIONS[key];

    if (next) {
      event.preventDefault();
      changeDirection(next);
      return;
    }

    if (key === " " && !event.repeat) {
      event.preventDefault();
      toggleGame();
    }
  }

  // ------------------------------------
  // Direction controls
  // ------------------------------------

  function moveUp(): void {
    changeDirection({ x: 0, y: -1 });
  }

  function moveDown(): void {
    changeDirection({ x: 0, y: 1 });
  }

  function moveLeft(): void {
    changeDirection({ x: -1, y: 0 });
  }

  function moveRight(): void {
    changeDirection({ x: 1, y: 0 });
  }

  // ------------------------------------
  // Lifecycle
  // ------------------------------------

  onMounted(() => {
    bestScore.value = readBestScore();

    window.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    stopTimer();

    window.removeEventListener("keydown", handleKeydown);
  });

  // ------------------------------------
  // Return
  // ------------------------------------

  return {
    snake,
    food,
    walls,

    score,
    levelScore,
    bestScore,

    level,
    targetScore,
    levelProgress,
    isTargetReached,
    isLevelTestRequired,

    speed,
    speedMultiplier,

    isPlaying,
    isStarted,
    isGameOver,
    isWon,

    addScore,
    startGame,
    pauseGame,
    toggleGame,
    resetGame,

    completeLevelTest,

    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  };
}
