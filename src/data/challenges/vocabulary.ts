import type { Challenge } from "@/types/learning";

export const vocabularyChallenges: Challenge[] = [
  {
    id: "vocabulary-001",
    skill: "vocabulary",
    difficulty: "easy",
    type: "multiple-choice",
    title: "Vocabulary",
    instruction: "Choose the correct meaning.",
    question: 'What does "spacious" mean?',
    options: [
      "Very small",
      "Having plenty of space",
      "Very expensive",
      "Extremely old",
    ],
    correctAnswer: "Having plenty of space",
    explanation:
      '"Spacious" means having a lot of room or space. It is often used to describe large rooms, houses, or buildings.',
    reviewWord: "spacious",
  },
  {
    id: "vocabulary-002",
    skill: "vocabulary",
    difficulty: "medium",
    type: "multiple-choice",
    title: "Vocabulary",
    instruction: "Choose the closest meaning.",
    question: 'What does "reluctant" mean?',
    options: [
      "Unwilling or hesitant",
      "Very excited",
      "Completely certain",
      "Extremely tired",
    ],
    correctAnswer: "Unwilling or hesitant",
    explanation:
      '"Reluctant" means not willing or not wanting to do something. For example: She was reluctant to speak in front of the class.',
    reviewWord: "reluctant",
  },
  {
    id: "vocabulary-003",
    skill: "vocabulary",
    difficulty: "hard",
    type: "multiple-choice",
    title: "Vocabulary",
    instruction: "Choose the correct definition.",
    question: 'What does "inevitable" mean?',
    options: [
      "Impossible to understand",
      "Certain to happen",
      "Easy to avoid",
      "Likely to disappear",
    ],
    correctAnswer: "Certain to happen",
    explanation:
      '"Inevitable" describes something that is certain to happen and cannot be avoided. Example: Change is inevitable.',
    reviewWord: "inevitable",
  },
];
