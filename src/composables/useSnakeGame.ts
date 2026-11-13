import { computed, onBeforeUnmount, onMounted, ref } from "vue";

export interface Point {
  x: number;
  y: number;
}

export interface SnakeGameOptions {
  onLevelTargetReached?: (level: number, score: number) => void;
  isInputBlocked?: () => boolean;
}

const GRID_SIZE = 20;

const INITIAL_SPEED = 250;
const MIN_SPEED = 65;
const SPEED_STEP = 12;

export const SCORE_PER_FOOD = 10;
export const TARGET_SCORE = 50;

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

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function createSnake(): Point[] {
  return INITIAL_SNAKE.map((segment) => ({ ...segment }));
}

function createFood(snake: Point[]): Point {
  const availableCells: Point[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const occupied = snake.some(
        (segment) => segment.x === x && segment.y === y,
      );

      if (!occupied) {
        availableCells.push({ x, y });
      }
    }
  }

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

export function useSnakeGame(options: SnakeGameOptions = {}) {
  // ------------------------------------
  // Game state
  // ------------------------------------

  const snake = ref<Point[]>(createSnake());
  const food = ref<Point>(createFood(snake.value));

  const score = ref(0);
  const levelScore = ref(0);
  const bestScore = ref(0);

  const level = ref(1);

  const isPlaying = ref(false);
  const isStarted = ref(false);
  const isGameOver = ref(false);
  const isWon = ref(false);

  // True when the player must complete a level test.
  const isLevelTestRequired = ref(false);

  let direction: Point = { ...INITIAL_DIRECTION };
  let nextDirection: Point = { ...INITIAL_DIRECTION };

  let timer: ReturnType<typeof setTimeout> | undefined;

  // ------------------------------------
  // Computed state
  // ------------------------------------

  const targetScore = computed(() => TARGET_SCORE);

  const levelProgress = computed(() =>
    Math.min((levelScore.value / TARGET_SCORE) * 100, 100),
  );

  const isTargetReached = computed(() => levelScore.value >= TARGET_SCORE);

  const speed = computed(() =>
    Math.max(MIN_SPEED, INITIAL_SPEED - (level.value - 1) * SPEED_STEP),
  );

  const speedMultiplier = computed(() =>
    (INITIAL_SPEED / speed.value).toFixed(1),
  );

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

    timer = setTimeout(move, speed.value);
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
      // The game still works without localStorage.
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

    if (levelScore.value >= TARGET_SCORE) {
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
   * Called by the View after the level test is completed.
   *
   * PASS:
   * - Increase level.
   * - Reset current level score.
   * - Resume Snake.
   *
   * FAIL:
   * - Keep current level.
   * - Keep the target score.
   * - Stay paused until the player retries.
   */
  function completeLevelTest(passed: boolean): void {
    if (!isLevelTestRequired.value) return;

    if (!passed) {
      isPlaying.value = false;
      stopTimer();
      return;
    }

    level.value += 1;
    levelScore.value = 0;

    isLevelTestRequired.value = false;

    startGame();
  }

  // ------------------------------------
  // Game lifecycle
  // ------------------------------------

  function resetGame(): void {
    stopTimer();

    snake.value = createSnake();
    food.value = createFood(snake.value);

    score.value = 0;
    levelScore.value = 0;
    level.value = 1;

    direction = { ...INITIAL_DIRECTION };
    nextDirection = { ...INITIAL_DIRECTION };

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

    // Prevent reversing directly into the snake's body.
    if (next.x === -direction.x && next.y === -direction.y) {
      return;
    }

    nextDirection = next;
  }

  function move(): void {
    if (!isPlaying.value) return;

    direction = nextDirection;

    const head = snake.value[0];

    if (!head) return;

    const nextHead: Point = {
      x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    const willEat = isSamePoint(nextHead, food.value);

    // The tail moves away during a normal move,
    // so it should not count as a collision.
    const bodyToCheck = willEat ? snake.value : snake.value.slice(0, -1);

    const hitSelf = bodyToCheck.some((segment) =>
      isSamePoint(segment, nextHead),
    );

    if (hitSelf) {
      endGame();
      return;
    }

    const nextSnake = [nextHead, ...snake.value];

    if (!willEat) {
      nextSnake.pop();
    }

    snake.value = nextSnake;

    if (willEat) {
      // Award game points without opening a question.
      addScore(SCORE_PER_FOOD);

      if (nextSnake.length >= GRID_SIZE * GRID_SIZE) {
        endGame(true);
        return;
      }

      food.value = createFood(nextSnake);

      // The target may have been reached.
      // Do not schedule another move while testing.
      if (isLevelTestRequired.value) {
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

  return {
    snake,
    food,

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
