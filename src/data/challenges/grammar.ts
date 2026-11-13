import type { Challenge } from "@/types/learning";

export const grammarChallenges: Challenge[] = [
  {
    id: "grammar-001",
    skill: "grammar",
    difficulty: "easy",
    type: "multiple-choice",
    title: "Grammar",
    instruction: "Choose the correct answer.",
    question: "I have lived here _____ 2020.",
    options: ["for", "since", "during", "from"],
    correctAnswer: "since",
    explanation:
      'Use "since" with a starting point in time, such as 2020, Monday, or last year. Use "for" with a duration, such as two years.',
  },
  {
    id: "grammar-002",
    skill: "grammar",
    difficulty: "medium",
    type: "multiple-choice",
    title: "Grammar",
    instruction: "Choose the correct sentence.",
    question: "Which sentence is correct?",
    options: [
      "If I was rich, I will travel.",
      "If I were rich, I would travel.",
      "If I am rich, I would travel.",
      "If I were rich, I will travel.",
    ],
    correctAnswer: "If I were rich, I would travel.",
    explanation:
      'The second conditional describes an imaginary or unlikely situation. Its structure is: If + past simple, would + base verb. "Were" is commonly used with all subjects in hypothetical statements.',
  },
  {
    id: "grammar-003",
    skill: "grammar",
    difficulty: "hard",
    type: "multiple-choice",
    title: "Grammar",
    instruction: "Choose the correct answer.",
    question: "By the time we arrived, the movie _____.",
    options: [
      "already started",
      "has already started",
      "had already started",
      "was already start",
    ],
    correctAnswer: "had already started",
    explanation:
      "Use the past perfect (had + past participle) for an action completed before another action in the past. The movie started before we arrived.",
  },
];
