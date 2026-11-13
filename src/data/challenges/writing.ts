import type { Challenge } from "@/types/learning";

export const writingChallenges: Challenge[] = [
  {
    id: "writing-001",
    skill: "writing",
    difficulty: "easy",
    type: "writing",
    title: "Writing",
    instruction: "Write a short introduction.",
    question: "Introduce yourself in English using at least 5 words.",
    explanation:
      "A good introduction usually includes your name and some basic information about yourself, such as your age, hometown, hobbies, or interests.",
    minWords: 5,
    requiredKeywords: ["i", "my"],
    sampleAnswer:
      "Hello! My name is Alex. I am a student. I love learning English and reading books. Nice to meet you!",
    usefulVocabulary: [
      {
        word: "student",
        meaning: "Học sinh / sinh viên",
      },
      {
        word: "hobby",
        meaning: "Sở thích",
      },
      {
        word: "interested in",
        meaning: "Quan tâm đến / yêu thích",
      },
    ],
    usefulStructures: [
      "My name is ...",
      "I am ... years old.",
      "I live in ...",
      "I enjoy ...",
    ],
  },
  {
    id: "writing-002",
    skill: "writing",
    difficulty: "medium",
    type: "writing",
    title: "Writing",
    instruction: "Write a short paragraph.",
    question: "Describe your favorite hobby in English.",
    explanation:
      "A good paragraph should introduce your hobby, explain why you enjoy it, and describe when or how you do it. Try to connect your ideas using simple sentences.",
    minWords: 8,
    requiredKeywords: ["i", "because"],
    sampleAnswer:
      "My favorite hobby is reading books. I usually read in the evening because it helps me relax after a busy day. I enjoy reading stories about adventure and science. Reading also helps me learn new vocabulary and improve my English.",
    usefulVocabulary: [
      {
        word: "favorite hobby",
        meaning: "Sở thích yêu thích",
      },
      {
        word: "relax",
        meaning: "Thư giãn",
      },
      {
        word: "adventure",
        meaning: "Cuộc phiêu lưu",
      },
      {
        word: "improve",
        meaning: "Cải thiện",
      },
      {
        word: "vocabulary",
        meaning: "Từ vựng",
      },
    ],
    usefulStructures: [
      "My favorite hobby is ...",
      "I usually ... because ...",
      "I enjoy ...",
      "It helps me ...",
      "I also ...",
    ],
  },
];
