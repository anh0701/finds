export type Ground = {
  id: number;

  x: number;

  y: number;

  width: number;

  height: number;
};

export type QuestionBlock = {
  id: number;

  x: number;

  y: number;

  width: number;

  height: number;

  questionId: number;

  answered: boolean;
};

export type Question = {
  id: number;

  question: string;

  choices: string[];

  answer: string;
};

export type Level = {
  id: number;

  requiredScore: number;

  playerStart: {
    x: number;
    y: number;
  };

  grounds: Ground[];

  questionBlocks: QuestionBlock[];

  worldWidth: number;

  worldHeight: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Player = {
  x: number;

  y: number;

  width: number;

  height: number;

  velocityY: number;

  speed: number;

  isJumping: boolean;
};
