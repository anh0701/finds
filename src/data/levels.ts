import type { Level } from "../types/game";

export const levels: Level[] = [
  // LEVEL 1
  {
    id: 1,
    requiredScore: 2,
    worldWidth: 1000,
    worldHeight: 400,

    playerStart: {
      x: 50,
      y: 250,
    },

    grounds: [
      { id: 1, x: 0, y: 340, width: 1000, height: 60 },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 220,
        y: 260,
        width: 50,
        height: 50,
        questionId: 1,
        answered: false,
      },
      {
        id: 2,
        x: 600,
        y: 220,
        width: 50,
        height: 50,
        questionId: 2,
        answered: false,
      },
    ],
  },

  // LEVEL 2
  {
    id: 2,
    requiredScore: 3,
    worldWidth: 1300,
    worldHeight: 450,

    playerStart: {
      x: 40,
      y: 250,
    },

    grounds: [
      { id: 1, x: 0, y: 340, width: 250, height: 60 },
      { id: 2, x: 340, y: 290, width: 220, height: 40 },
      { id: 3, x: 660, y: 230, width: 220, height: 40 },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 100,
        y: 260,
        width: 50,
        height: 50,
        questionId: 3,
        answered: false,
      },
      {
        id: 2,
        x: 420,
        y: 210,
        width: 50,
        height: 50,
        questionId: 4,
        answered: false,
      },
      {
        id: 3,
        x: 740,
        y: 150,
        width: 50,
        height: 50,
        questionId: 5,
        answered: false,
      },
    ],
  },

  // LEVEL 3
  {
    id: 3,
    requiredScore: 4,
    worldWidth: 1500,
    worldHeight: 500,

    playerStart: {
      x: 30,
      y: 250,
    },

    grounds: [
      { id: 1, x: 0, y: 340, width: 180, height: 60 },
      { id: 2, x: 260, y: 290, width: 180, height: 40 },
      { id: 3, x: 520, y: 240, width: 180, height: 40 },
      { id: 4, x: 780, y: 190, width: 180, height: 40 },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 70,
        y: 260,
        width: 50,
        height: 50,
        questionId: 6,
        answered: false,
      },
      {
        id: 2,
        x: 330,
        y: 210,
        width: 50,
        height: 50,
        questionId: 7,
        answered: false,
      },
      {
        id: 3,
        x: 590,
        y: 160,
        width: 50,
        height: 50,
        questionId: 8,
        answered: false,
      },
      {
        id: 4,
        x: 860,
        y: 110,
        width: 50,
        height: 50,
        questionId: 9,
        answered: false,
      },
    ],
  },

  // LEVEL 4
  {
    id: 4,
    requiredScore: 5,
    worldWidth: 1800,
    worldHeight: 550,

    playerStart: {
      x: 20,
      y: 250,
    },

    grounds: [
      { id: 1, x: 0, y: 340, width: 150, height: 60 },
      { id: 2, x: 220, y: 300, width: 140, height: 40 },
      { id: 3, x: 440, y: 250, width: 140, height: 40 },
      { id: 4, x: 660, y: 200, width: 140, height: 40 },
      { id: 5, x: 900, y: 150, width: 180, height: 40 },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 70,
        y: 260,
        width: 50,
        height: 50,
        questionId: 10,
        answered: false,
      },
      {
        id: 2,
        x: 250,
        y: 220,
        width: 50,
        height: 50,
        questionId: 11,
        answered: false,
      },
      {
        id: 3,
        x: 470,
        y: 170,
        width: 50,
        height: 50,
        questionId: 12,
        answered: false,
      },
      {
        id: 4,
        x: 700,
        y: 120,
        width: 50,
        height: 50,
        questionId: 13,
        answered: false,
      },
      {
        id: 5,
        x: 970,
        y: 70,
        width: 50,
        height: 50,
        questionId: 14,
        answered: false,
      },
    ],
  },

  // LEVEL 5
  {
    id: 5,
    requiredScore: 6,
    worldWidth: 1900,
    worldHeight: 600,

    playerStart: {
      x: 20,
      y: 250,
    },

    grounds: [
      { id: 1, x: 0, y: 340, width: 180, height: 60 },
      { id: 2, x: 260, y: 300, width: 160, height: 40 },
      { id: 3, x: 520, y: 250, width: 160, height: 40 },
      { id: 4, x: 780, y: 200, width: 160, height: 40 },
      { id: 5, x: 1040, y: 150, width: 160, height: 40 },
      { id: 6, x: 1260, y: 220, width: 200, height: 40 },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 70,
        y: 260,
        width: 50,
        height: 50,
        questionId: 15,
        answered: false,
      },
      {
        id: 2,
        x: 310,
        y: 220,
        width: 50,
        height: 50,
        questionId: 16,
        answered: false,
      },
      {
        id: 3,
        x: 570,
        y: 170,
        width: 50,
        height: 50,
        questionId: 17,
        answered: false,
      },
      {
        id: 4,
        x: 830,
        y: 120,
        width: 50,
        height: 50,
        questionId: 18,
        answered: false,
      },
      {
        id: 5,
        x: 1090,
        y: 70,
        width: 50,
        height: 50,
        questionId: 19,
        answered: false,
      },
      {
        id: 6,
        x: 1330,
        y: 140,
        width: 50,
        height: 50,
        questionId: 20,
        answered: false,
      },
    ],
  }
];