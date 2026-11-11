import { computed, reactive } from 'vue'
import type {
  ChallengeDifficulty,
  LearningProgress,
  LearningSkill,
  SkillProgress,
} from '@/types/learning'

const STORAGE_KEY = 'snake-english-survival-progress'

function createSkillProgress(): Record<LearningSkill, SkillProgress> {
  const createProgress = (): SkillProgress => ({
    attempts: 0,
    correct: 0,
    recentResults: [],
    difficulty: 'easy',
  })

  return {
    vocabulary: createProgress(),
    grammar: createProgress(),
    reading: createProgress(),
    listening: createProgress(),
    writing: createProgress(),
  }
}

function createInitialProgress(): LearningProgress {
  return {
    xp: 0,
    stars: 0,
    combo: 0,
    learnedWords: [],
    reviewQueue: [],
    lastChallengeIds: [],
    skillProgress: createSkillProgress(),
  }
}

const state = reactive<LearningProgress>(createInitialProgress())

function normalizeDifficulty(value: unknown): ChallengeDifficulty {
  if (value === 'medium' || value === 'hard') {
    return value
  }

  return 'easy'
}

function loadProgress(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return

    const saved = JSON.parse(raw) as Partial<LearningProgress>
    const defaults = createInitialProgress()

    state.xp = Math.max(0, Number(saved.xp) || 0)
    state.stars = Math.max(0, Number(saved.stars) || 0)
    state.combo = Math.max(0, Number(saved.combo) || 0)

    state.learnedWords = Array.isArray(saved.learnedWords)
      ? saved.learnedWords.filter(
          (value): value is string => typeof value === 'string',
        )
      : []

    state.reviewQueue = Array.isArray(saved.reviewQueue)
      ? saved.reviewQueue.filter(
          (value): value is string => typeof value === 'string',
        )
      : []

    state.lastChallengeIds = Array.isArray(saved.lastChallengeIds)
      ? saved.lastChallengeIds.filter(
          (value): value is string => typeof value === 'string',
        ).slice(-5)
      : []

    for (const skill of Object.keys(defaults.skillProgress) as LearningSkill[]) {
      const savedSkill = saved.skillProgress?.[skill]

      state.skillProgress[skill] = {
        attempts: Math.max(0, Number(savedSkill?.attempts) || 0),
        correct: Math.max(0, Number(savedSkill?.correct) || 0),
        recentResults: Array.isArray(savedSkill?.recentResults)
          ? savedSkill.recentResults
              .filter((value): value is boolean => typeof value === 'boolean')
              .slice(-10)
          : [],
        difficulty: normalizeDifficulty(savedSkill?.difficulty),
      }
    }
  } catch {
    state.xp = 0
    state.stars = 0
    state.combo = 0
    state.learnedWords = []
    state.reviewQueue = []
    state.lastChallengeIds = []
    state.skillProgress = createSkillProgress()
  }
}

function saveProgress(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Learning vẫn hoạt động nếu trình duyệt không cho phép localStorage.
  }
}

function updateDifficulty(skill: LearningSkill): void {
  const progress = state.skillProgress[skill]

  if (progress.recentResults.length < 4) return

  const correctCount = progress.recentResults.filter(Boolean).length
  const accuracy = correctCount / progress.recentResults.length

  if (accuracy >= 0.8) {
    if (progress.difficulty === 'easy') {
      progress.difficulty = 'medium'
    } else if (progress.difficulty === 'medium') {
      progress.difficulty = 'hard'
    }

    return
  }

  if (accuracy <= 0.4) {
    if (progress.difficulty === 'hard') {
      progress.difficulty = 'medium'
    } else if (progress.difficulty === 'medium') {
      progress.difficulty = 'easy'
    }
  }
}

function recordAttempt(
  skill: LearningSkill,
  isCorrect: boolean,
): number {
  const progress = state.skillProgress[skill]

  progress.attempts += 1

  let xpEarned = 0

  if (isCorrect) {
    progress.correct += 1
    state.combo += 1

    xpEarned = 10 + Math.min(state.combo, 10) * 2
    state.xp += xpEarned

    // Mỗi 5 câu đúng liên tiếp nhận 1 sao.
    if (state.combo % 5 === 0) {
      state.stars += 1
    }
  } else {
    state.combo = 0
  }

  progress.recentResults.push(isCorrect)
  progress.recentResults = progress.recentResults.slice(-10)

  updateDifficulty(skill)
  saveProgress()

  return xpEarned
}

function addLearnedWord(word: string): void {
  const normalized = word.trim().toLowerCase()

  if (!normalized || state.learnedWords.includes(normalized)) {
    return
  }

  state.learnedWords.push(normalized)
  saveProgress()
}

function addReviewWord(word: string): void {
  const normalized = word.trim().toLowerCase()

  if (!normalized || state.reviewQueue.includes(normalized)) {
    return
  }

  state.reviewQueue.push(normalized)
  saveProgress()
}

function removeReviewWord(word: string): void {
  state.reviewQueue = state.reviewQueue.filter(
    (item) => item !== word.trim().toLowerCase(),
  )

  saveProgress()
}

function rememberChallenge(id: string): void {
  state.lastChallengeIds.push(id)
  state.lastChallengeIds = state.lastChallengeIds.slice(-5)
  saveProgress()
}

const totalAttempts = computed(() =>
  Object.values(state.skillProgress).reduce(
    (total, progress) => total + progress.attempts,
    0,
  ),
)

const totalCorrect = computed(() =>
  Object.values(state.skillProgress).reduce(
    (total, progress) => total + progress.correct,
    0,
  ),
)

const accuracy = computed(() => {
  if (totalAttempts.value === 0) return 0

  return Math.round(
    (totalCorrect.value / totalAttempts.value) * 100,
  )
})

export function useLearningStore() {
  return {
    state,
    totalAttempts,
    totalCorrect,
    accuracy,
    loadProgress,
    saveProgress,
    recordAttempt,
    addLearnedWord,
    addReviewWord,
    removeReviewWord,
    rememberChallenge,
  }
}