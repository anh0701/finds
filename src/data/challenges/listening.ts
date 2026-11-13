import type { Challenge } from "@/types/learning";

export const listeningChallenges: Challenge[] = [
  {
    id: "listening-001",
    skill: "listening",
    difficulty: "easy",
    type: "multiple-choice",
    title: "Listening",
    instruction: "Listen and choose the meaning.",
    question: "What does the speaker mean?",
    audioText: "Could you give me a hand?",
    transcript: "Could you give me a hand?",
    options: [
      "Can you help me?",
      "Can you leave me alone?",
      "Can you call me later?",
      "Can you wait for me?",
    ],
    correctAnswer: "Can you help me?",
    explanation:
      '"Give me a hand" is a common English idiom meaning "help me". It is often used when asking someone for assistance.',
  },
  {
    id: "listening-002",
    skill: "listening",
    difficulty: "medium",
    type: "multiple-choice",
    title: "Listening",
    instruction: "Listen and choose the meaning.",
    question: "What does the speaker mean?",
    audioText: "I am feeling under the weather.",
    transcript: "I am feeling under the weather.",
    options: [
      "The speaker is very busy.",
      "The speaker is feeling slightly ill.",
      "The speaker wants to go outside.",
      "The speaker has finished working.",
    ],
    correctAnswer: "The speaker is feeling slightly ill.",
    explanation:
      '"Under the weather" is an idiom meaning to feel unwell or slightly sick. It does not refer to actual weather conditions.',
  },
];
