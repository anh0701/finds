import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

export interface Point {
  x: number
  y: number
}

export interface SnakeGameOptions {
  onFoodEaten?: (score: number) => void
  isInputBlocked?: () => boolean
}

const GRID_SIZE = 20
const INITIAL_SPEED = 250
const MIN_SPEED = 65
const SPEED_STEP = 12
const SCORE_PER_FOOD = 10
const SCORE_PER_LEVEL = 50
const STORAGE_KEY = 'snake-best'

const INITIAL_SNAKE: Point[] = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
]

const INITIAL_DIRECTION: Point = { x: 1, y: 0 }

const KEY_DIRECTIONS: Record<string, Point> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
}

function isSamePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

function createSnake(): Point[] {
  return INITIAL_SNAKE.map((segment) => ({ ...segment }))
}

function createFood(snake: Point[]): Point {
  const availableCells: Point[] = []

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const occupied = snake.some((segment) =>
        segment.x === x && segment.y === y,
      )

      if (!occupied) {
        availableCells.push({ x, y })
      }
    }
  }

  if (availableCells.length === 0) {
    return { x: -1, y: -1 }
  }

  const randomIndex = Math.floor(
    Math.random() * availableCells.length,
  )

  return availableCells[randomIndex] ?? { x: -1, y: -1 }
}

function readBestScore(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

export function useSnakeGame(options: SnakeGameOptions = {}) {
  const snake = ref<Point[]>(createSnake())
  const food = ref<Point>(createFood(snake.value))

  const score = ref(0)
  const bestScore = ref(0)

  const isPlaying = ref(false)
  const isStarted = ref(false)
  const isGameOver = ref(false)
  const isWon = ref(false)

  let direction: Point = { ...INITIAL_DIRECTION }
  let nextDirection: Point = { ...INITIAL_DIRECTION }
  let timer: ReturnType<typeof setTimeout> | undefined

  const level = computed(() =>
    Math.floor(score.value / SCORE_PER_LEVEL) + 1,
  )

  const speed = computed(() =>
    Math.max(
      MIN_SPEED,
      INITIAL_SPEED - (level.value - 1) * SPEED_STEP,
    ),
  )

  const speedMultiplier = computed(() =>
    (INITIAL_SPEED / speed.value).toFixed(1),
  )

  function stopTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function saveBestScore(): void {
    if (score.value <= bestScore.value) return

    bestScore.value = score.value

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        String(bestScore.value),
      )
    } catch {
      // Game vẫn hoạt động nếu trình duyệt không cho phép localStorage.
    }
  }

  function resetGame(): void {
    stopTimer()

    snake.value = createSnake()
    food.value = createFood(snake.value)

    score.value = 0
    direction = { ...INITIAL_DIRECTION }
    nextDirection = { ...INITIAL_DIRECTION }

    isPlaying.value = false
    isStarted.value = false
    isGameOver.value = false
    isWon.value = false
  }

  function endGame(won = false): void {
    stopTimer()

    isPlaying.value = false
    isGameOver.value = !won
    isWon.value = won

    saveBestScore()
  }

  function pauseGame(): void {
    if (!isPlaying.value) return

    isPlaying.value = false
    stopTimer()
  }

  function changeDirection(next: Point): void {
    if (!isPlaying.value) return

    // Không cho rắn quay ngược 180 độ.
    if (
      next.x === -direction.x &&
      next.y === -direction.y
    ) {
      return
    }

    nextDirection = next
  }

  function move(): void {
    if (!isPlaying.value) return

    direction = nextDirection

    const head = snake.value[0]

    if (!head) return

    const nextHead: Point = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    }

    const willEat = isSamePoint(nextHead, food.value)

    const hitWall =
      nextHead.x < 0 ||
      nextHead.x >= GRID_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_SIZE

    // Nếu không ăn, đuôi sẽ rời vị trí hiện tại trong lượt này.
    const bodyToCheck = willEat
      ? snake.value
      : snake.value.slice(0, -1)

    const hitSelf = bodyToCheck.some((segment) =>
      isSamePoint(segment, nextHead),
    )

    if (hitWall || hitSelf) {
      endGame()
      return
    }

    const nextSnake = [nextHead, ...snake.value]

    if (willEat) {
      score.value += SCORE_PER_FOOD
      saveBestScore()

      if (nextSnake.length >= GRID_SIZE * GRID_SIZE) {
        snake.value = nextSnake
        endGame(true)
        return
      }

      food.value = createFood(nextSnake)
      snake.value = nextSnake

      // Tạm dừng để mở thử thách học tiếng Anh.
      stopTimer()
      isPlaying.value = false

      options.onFoodEaten?.(score.value)
      return
    }

    nextSnake.pop()
    snake.value = nextSnake

    timer = setTimeout(move, speed.value)
  }

  function startGame(): void {
    if (isPlaying.value) return

    if (isGameOver.value || isWon.value) {
      resetGame()
    }

    isStarted.value = true
    isPlaying.value = true

    stopTimer()
    timer = setTimeout(move, speed.value)
  }

  function toggleGame(): void {
    if (isPlaying.value) {
      pauseGame()
      return
    }

    startGame()
  }

  function handleKeydown(event: KeyboardEvent): void {
    const target = event.target

    if (
      target instanceof HTMLElement &&
      (
        target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      )
    ) {
      return
    }

    if (options.isInputBlocked?.()) {
      const blockedKeys = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        ' ',
        'w',
        'a',
        's',
        'd',
      ]

      if (blockedKeys.includes(event.key.toLowerCase())) {
        event.preventDefault()
      }

      return
    }

    const key = event.key.toLowerCase()

    if (options.isInputBlocked?.()) {
      if (key in KEY_DIRECTIONS || key === ' ') {
        event.preventDefault()
      }

      return
    }

    const next = KEY_DIRECTIONS[key]

    if (next) {
      event.preventDefault()
      changeDirection(next)
      return
    }

    if (key === ' ' && !event.repeat) {
      event.preventDefault()
      toggleGame()
    }
  }

  function moveUp(): void {
    changeDirection({ x: 0, y: -1 })
  }

  function moveDown(): void {
    changeDirection({ x: 0, y: 1 })
  }

  function moveLeft(): void {
    changeDirection({ x: -1, y: 0 })
  }

  function moveRight(): void {
    changeDirection({ x: 1, y: 0 })
  }

  onMounted(() => {
    bestScore.value = readBestScore()

    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    stopTimer()
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    snake,
    food,
    score,
    bestScore,
    level,
    speed,
    speedMultiplier,
    isPlaying,
    isStarted,
    isGameOver,
    isWon,
    startGame,
    pauseGame,
    toggleGame,
    resetGame,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  }
}