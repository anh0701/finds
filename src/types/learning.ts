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