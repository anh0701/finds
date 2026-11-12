export type LearningSkill =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'writing'

export type ChallengeDifficulty =
  | 'easy'
  | 'medium'
  | 'hard'

export type ChallengeType =
  | 'multiple-choice'
  | 'writing'

export type WritingErrorType =
  | 'grammar'
  | 'spelling'
  | 'keyword'
  | 'word-count'
  | 'format'

export interface WritingError {
  type: WritingErrorType
  message: string
  suggestion?: string
}

export interface WritingGrade {
  passed: boolean
  score: number
  wordCount: number
  requiredWordCount: number
  wordCountPassed: boolean
  requiredWordsPassed: boolean
  grammarPassed: boolean
  formatPassed: boolean
  matchedKeywords: string[]
  missingKeywords: string[]
  errors: WritingError[]
}

export interface Challenge {
  id: string
  skill: LearningSkill
  difficulty: ChallengeDifficulty
  type: ChallengeType
  title: string
  instruction: string
  question: string
  options?: string[]
  correctAnswer?: string
  explanation: string
  minWords?: number
  requiredKeywords?: string[]
  audioText?: string
  reviewWord?: string
}

export interface ChallengeResult {
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
  explanation: string
  xpEarned: number
  writingGrade?: WritingGrade
}

export interface SkillProgress {
  attempts: number
  correct: number
  recentResults: boolean[]
  difficulty: ChallengeDifficulty
}

export interface LearningProgress {
  xp: number
  stars: number
  combo: number
  learnedWords: string[]
  reviewQueue: string[]
  lastChallengeIds: string[]
  skillProgress: Record<LearningSkill, SkillProgress>
}