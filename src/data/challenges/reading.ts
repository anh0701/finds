import type { Challenge } from "@/types/learning";

export const readingChallenges: Challenge[] = [
  {
    id: "reading-001",
    skill: "reading",
    difficulty: "easy",
    type: "multiple-choice",
    title: "Reading",
    instruction: "Read the passage and answer.",
    question:
      "Mia usually takes the bus to school. Today, she is walking because the weather is beautiful. Why is Mia walking?",
    options: [
      "She missed the bus.",
      "She wants to exercise.",
      "The weather is beautiful.",
      "Her school is closed.",
    ],
    correctAnswer: "The weather is beautiful.",
    explanation:
      'The passage directly states that Mia is walking because the weather is beautiful. Look for the reason introduced by "because".',
  },
  {
    id: "reading-002",
    skill: "reading",
    difficulty: "medium",
    type: "multiple-choice",
    title: "Reading",
    instruction: "Read carefully and answer.",
    question:
      "Tom planned to visit the museum, but heavy rain changed his plans. Instead, he stayed home and read a book. What can we infer?",
    options: [
      "Tom dislikes museums.",
      "The museum was closed permanently.",
      "The weather affected Tom’s decision.",
      "Tom forgot about his plan.",
    ],
    correctAnswer: "The weather affected Tom’s decision.",
    explanation:
      "We can infer that the heavy rain changed Tom’s original plan. The passage does not say that he dislikes museums or forgot about the visit.",
  },
];
