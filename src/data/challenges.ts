import type { Challenge, LearningSkill } from "@/types/learning";

export const SKILLS: LearningSkill[] = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "writing",
];

export const CHALLENGES: Challenge[] = [
  // =========================
  // VOCABULARY
  // =========================
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

  // =========================
  // GRAMMAR
  // =========================
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

  // =========================
  // READING
  // =========================
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

  // =========================
  // LISTENING
  // =========================
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

  // =========================
  // WRITING
  // =========================
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
