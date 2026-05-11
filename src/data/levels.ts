import type { Level } from "../types/game";

export const levels: Level[] = [
  // LEVEL 1
  {
    id: 1,
    requiredScore: 2,
    worldWidth: 900,
    worldHeight: 400,

    playerStart: {
      x: 50,
      y: 250,
    },

    grounds: [
      {
        id: 1,
        x: 0,
        y: 340,
        width: 900,
        height: 60,
      },
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
        x: 520,
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
    worldWidth: 1200,
    worldHeight: 400,

    playerStart: {
      x: 50,
      y: 250,
    },

    grounds: [
      {
        id: 1,
        x: 0,
        y: 340,
        width: 300,
        height: 60,
      },
      {
        id: 2,
        x: 380,
        y: 280,
        width: 200,
        height: 40,
      },
      {
        id: 3,
        x: 650,
        y: 220,
        width: 200,
        height: 40,
      },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 120,
        y: 260,
        width: 50,
        height: 50,
        questionId: 3,
        answered: false,
      },
      {
        id: 2,
        x: 450,
        y: 200,
        width: 50,
        height: 50,
        questionId: 4,
        answered: false,
      },
      {
        id: 3,
        x: 730,
        y: 140,
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
    worldWidth: 1400,
    worldHeight: 500,

    playerStart: {
      x: 30,
      y: 250,
    },

    grounds: [
      {
        id: 1,
        x: 0,
        y: 340,
        width: 180,
        height: 60,
      },
      {
        id: 2,
        x: 260,
        y: 290,
        width: 180,
        height: 40,
      },
      {
        id: 3,
        x: 520,
        y: 240,
        width: 180,
        height: 40,
      },
      {
        id: 4,
        x: 760,
        y: 180,
        width: 140,
        height: 40,
      },
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
        x: 800,
        y: 100,
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
    worldHeight: 500,

    playerStart: {
      x: 20,
      y: 250,
    },

    grounds: [
      {
        id: 1,
        x: 0,
        y: 340,
        width: 140,
        height: 60,
      },
      {
        id: 2,
        x: 200,
        y: 300,
        width: 120,
        height: 40,
      },
      {
        id: 3,
        x: 380,
        y: 250,
        width: 120,
        height: 40,
      },
      {
        id: 4,
        x: 560,
        y: 200,
        width: 120,
        height: 40,
      },
      {
        id: 5,
        x: 740,
        y: 150,
        width: 140,
        height: 40,
      },
    ],

    questionBlocks: [
      {
        id: 1,
        x: 40,
        y: 260,
        width: 50,
        height: 50,
        questionId: 10,
        answered: false,
      },
      {
        id: 2,
        x: 230,
        y: 220,
        width: 50,
        height: 50,
        questionId: 1,
        answered: false,
      },
      {
        id: 3,
        x: 410,
        y: 170,
        width: 50,
        height: 50,
        questionId: 2,
        answered: false,
      },
      {
        id: 4,
        x: 590,
        y: 120,
        width: 50,
        height: 50,
        questionId: 3,
        answered: false,
      },
      {
        id: 5,
        x: 790,
        y: 70,
        width: 50,
        height: 50,
        questionId: 4,
        answered: false,
      },
    ],
  },
];
