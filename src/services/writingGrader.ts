import type { Challenge, WritingError, WritingGrade } from "@/types/learning";

const WORD_PATTERN = /[a-zA-Z]+(?:['’][a-zA-Z]+)*/g;

const THIRD_PERSON_VERBS = [
  "like",
  "want",
  "need",
  "play",
  "work",
  "study",
  "go",
  "eat",
  "drink",
  "watch",
  "read",
  "write",
  "live",
  "speak",
  "know",
  "have",
  "do",
  "make",
  "take",
  "come",
  "use",
  "try",
  "enjoy",
];

const BASE_VERBS = [
  "like",
  "want",
  "need",
  "play",
  "work",
  "study",
  "go",
  "eat",
  "drink",
  "watch",
  "read",
  "write",
  "live",
  "speak",
  "know",
  "make",
  "take",
  "come",
  "use",
  "try",
  "enjoy",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countWords(value: string): number {
  return value.match(WORD_PATTERN)?.length ?? 0;
}

function containsWholeKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const pattern = new RegExp(
    `(^|[^a-zA-Z'])${escapeRegExp(normalizedKeyword)}(?=$|[^a-zA-Z'])`,
    "i",
  );

  return pattern.test(text);
}

function addError(
  errors: WritingError[],
  type: WritingError["type"],
  message: string,
  suggestion?: string,
): void {
  errors.push({
    type,
    message,
    suggestion,
  });
}

function checkRepeatedWords(text: string, errors: WritingError[]): void {
  const repeatedWordPattern = /\b([a-z]+)\s+\1\b/gi;
  const match = text.match(repeatedWordPattern);

  if (match) {
    addError(
      errors,
      "grammar",
      "You repeated a word.",
      "Remove the duplicated word.",
    );
  }
}

function checkSubjectVerbAgreement(text: string, errors: WritingError[]): void {
  const rules = [
    {
      pattern: /\b(i|you|we|they)\s+is\b/i,
      message: 'The subject does not agree with "is".',
      suggestion: 'Use "am" with I, and "are" with you, we, or they.',
    },
    {
      pattern: /\b(he|she|it)\s+are\b/i,
      message: 'The subject does not agree with "are".',
      suggestion: 'Use "is" with he, she, or it.',
    },
    {
      pattern: /\b(i|you|we|they)\s+has\b/i,
      message: 'The subject does not agree with "has".',
      suggestion: 'Use "have" with I, you, we, or they.',
    },
    {
      pattern: /\b(he|she|it)\s+have\b/i,
      message: 'The subject does not agree with "have".',
      suggestion: 'Use "has" with he, she, or it.',
    },
    {
      pattern: /\b(i)\s+am\s+not\b/i,
      message: "Check the structure of this sentence.",
      suggestion: "Make sure the sentence has a complete verb phrase.",
    },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(text)) {
      addError(errors, "grammar", rule.message, rule.suggestion);
    }
  }

  for (const verb of THIRD_PERSON_VERBS) {
    const pattern = new RegExp(`\\b(he|she|it)\\s+(?:${verb})\\b`, "i");

    if (pattern.test(text)) {
      addError(
        errors,
        "grammar",
        `The verb "${verb}" may be missing its third-person ending.`,
        `Use "${getThirdPersonForm(verb)}" with he, she, or it.`,
      );
    }
  }

  for (const verb of BASE_VERBS) {
    const pattern = new RegExp(
      `\\b(they|we|you)\\s+${escapeRegExp(getThirdPersonForm(verb))}\\b`,
      "i",
    );

    if (pattern.test(text)) {
      addError(
        errors,
        "grammar",
        `The verb "${getThirdPersonForm(verb)}" does not agree with the subject.`,
        `Use "${verb}" with they, we, or you.`,
      );
    }
  }
}

function getThirdPersonForm(verb: string): string {
  if (verb === "have") return "has";
  if (verb === "do") return "does";
  if (verb === "go") return "goes";
  if (verb.endsWith("y")) {
    return `${verb.slice(0, -1)}ies`;
  }

  if (
    verb.endsWith("s") ||
    verb.endsWith("sh") ||
    verb.endsWith("ch") ||
    verb.endsWith("x")
  ) {
    return `${verb}es`;
  }

  return `${verb}s`;
}

function checkAuxiliaryVerbs(text: string, errors: WritingError[]): void {
  const invalidPatterns = [
    {
      pattern:
        /\b(?:did|didn't|did not)\s+(?:went|ate|saw|wrote|came|took|made|had|was|were)\b/i,
      message: 'The verb after "did" should be in its base form.',
      suggestion: 'For example: "did go", "did not eat".',
    },
    {
      pattern: /\b(?:does|doesn't|does not)\s+[a-z]+s\b/i,
      message: 'The verb after "does" should be in its base form.',
      suggestion: 'For example: "does like", "does not work".',
    },
    {
      pattern: /\b(?:can|could|will|would|should|must|may|might)\s+[a-z]+s\b/i,
      message: "A modal verb should be followed by a base verb.",
      suggestion: 'For example: "can go", not "can goes".',
    },
  ];

  for (const rule of invalidPatterns) {
    if (rule.pattern.test(text)) {
      addError(errors, "grammar", rule.message, rule.suggestion);
    }
  }
}

function checkArticles(text: string, errors: WritingError[]): void {
  const articlePattern = /\b(a)\s+[aeiou]\w*/i;

  if (articlePattern.test(text)) {
    addError(
      errors,
      "grammar",
      'You may need to use "an" before this word.',
      'Use "an" before a vowel sound, for example: "an apple".',
    );
  }

  const anConsonantPattern = /\b(an)\s+[bcdfghjklmnpqrstvwxyz]\w*/i;

  if (anConsonantPattern.test(text)) {
    addError(
      errors,
      "grammar",
      'You may need to use "a" before this word.',
      'Use "a" before a consonant sound, for example: "a book".',
    );
  }
}

function checkGrammar(answer: string): WritingError[] {
  const errors: WritingError[] = [];
  const normalized = normalizeText(answer);

  checkRepeatedWords(normalized, errors);
  checkSubjectVerbAgreement(normalized, errors);
  checkAuxiliaryVerbs(normalized, errors);
  checkArticles(normalized, errors);

  return errors;
}

function checkSentenceFormat(answer: string, errors: WritingError[]): boolean {
  const trimmed = answer.trim();

  if (!trimmed) {
    return false;
  }

  let passed = true;

  if (!/^[A-Z]/.test(trimmed)) {
    passed = false;

    addError(
      errors,
      "format",
      "Start your sentence with a capital letter.",
      "Capitalize the first letter of your sentence.",
    );
  }

  if (!/[.!?]$/.test(trimmed)) {
    passed = false;

    addError(
      errors,
      "format",
      "Your answer should end with punctuation.",
      "Add a period, question mark, or exclamation mark.",
    );
  }

  return passed;
}

export function gradeWriting(
  challenge: Challenge,
  answer: string,
): WritingGrade {
  const errors: WritingError[] = [];
  const normalizedAnswer = normalizeText(answer);
  const wordCount = countWords(answer);
  const requiredWordCount = challenge.minWords ?? 1;

  const wordCountPassed = wordCount >= requiredWordCount;

  if (!wordCountPassed) {
    addError(
      errors,
      "word-count",
      `Your answer has ${wordCount} words, but needs at least ${requiredWordCount}.`,
      `Write ${requiredWordCount - wordCount} more word(s).`,
    );
  }

  const requiredKeywords = challenge.requiredKeywords ?? [];

  const matchedKeywords = requiredKeywords.filter((keyword) =>
    containsWholeKeyword(normalizedAnswer, keyword),
  );

  const missingKeywords = requiredKeywords.filter(
    (keyword) => !containsWholeKeyword(normalizedAnswer, keyword),
  );

  const requiredWordsPassed = missingKeywords.length === 0;

  if (missingKeywords.length > 0) {
    const missingList = missingKeywords
      .map((keyword) => `"${keyword}"`)
      .join(", ");

    addError(
      errors,
      "keyword",
      `Missing required words: ${missingList}.`,
      `Try to include ${missingList} naturally in your answer.`,
    );
  }

  const grammarErrors = checkGrammar(answer);
  errors.push(...grammarErrors);

  const grammarPassed = grammarErrors.length === 0;
  const formatPassed = checkSentenceFormat(answer, errors);

  const wordCountScore = wordCountPassed ? 20 : 0;
  const keywordScore = requiredWordsPassed ? 30 : 0;
  const grammarScore = grammarPassed ? 40 : 0;
  const formatScore = formatPassed ? 10 : 0;

  const score = wordCountScore + keywordScore + grammarScore + formatScore;

  return {
    passed: wordCountPassed && requiredWordsPassed && grammarPassed,
    score,
    wordCount,
    requiredWordCount,
    wordCountPassed,
    requiredWordsPassed,
    grammarPassed,
    formatPassed,
    matchedKeywords,
    missingKeywords,
    errors,
  };
}
