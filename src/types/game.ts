export type Question = {
  id: number;
  question: string;
  choices: string[];
  answer: string;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PlatformType = "normal" | "question" | "energy";

export type Platform = Rect & {
  id: string;
  type: PlatformType;
  qId?: number;
  used: boolean;
};
