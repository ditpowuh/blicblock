import {getRandomNumber, generateEmptyGrid, processTetrominoes} from "@/lib/utility";

import type {BlockID} from "@/types";

type ActionType = "DismissStartScreen" | "Pause" | "Unpause" | "MoveLeft" | "MoveRight" | "Drop" | "Tick";

export interface GameState {
  board: BlockID[][];
  currentBlockPosition: {x: number, y: number};
  currentBlockQueue: number[];
  dropSpeed: number;
  level: number;
  score: number;
  gameOver: boolean;
  gamePause: boolean;
  startingScreenOn: boolean;
  lastTickTime: number;
  lastDropTime: number;
  delay: number;
  dropTargetY: number | null;
}

interface GameAction {
  type: ActionType;
  time: number;
  fastDrop: boolean;
  width: number;
  height: number;
  numberOfColors: number;
  pointsPerTetromino: number[];
  levelUpIncrement: number;
  startingLevel: number;
  dropSpeedAcceleration: number;
}

function getInitialDropSpeed(startingDropSpeed: number, startingLevel: number, dropSpeedAcceleration: number): number {
  let speed = startingDropSpeed;
  for (let i = 0; i < startingLevel - 1; i++) {
    speed = speed - speed * dropSpeedAcceleration;
  }
  return speed;
}

export function createInitialState(width: number, height: number, numberOfColors: number, startingLevel: number, startingDropSpeed: number, dropSpeedAcceleration: number): GameState {
  return {
    board: generateEmptyGrid(width, height),
    currentBlockPosition: {x: Math.ceil(width / 2), y: 1},
    currentBlockQueue: Array.from({length: 3}, () => getRandomNumber(1, numberOfColors)),
    dropSpeed: getInitialDropSpeed(startingDropSpeed, startingLevel, dropSpeedAcceleration),
    level: startingLevel,
    score: 0,
    gameOver: false,
    gamePause: false,
    startingScreenOn: true,
    lastTickTime: 0,
    lastDropTime: 0,
    delay: 2000,
    dropTargetY: null
  };
}

function getDropLandingY(board: BlockID[][], positionX: number, startY: number, height: number): number {
  let positionY = startY;
  while (positionY < height && board[positionY][positionX - 1] === 0) {
    positionY = positionY + 1;
  }
  return positionY;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "DismissStartScreen": {
      return {...state, startingScreenOn: false};
    }
    case "Pause": {
      return {...state, gamePause: true};
    }
    case "Unpause": {
      return {...state, gamePause: false};
    }
    case "MoveLeft": {
      const {width, height} = action;
      const {currentBlockPosition, board} = state;

      if (currentBlockPosition.x <= 1 || currentBlockPosition.y <= 0) {
        return state;
      }
      if (board[currentBlockPosition.y - 1][currentBlockPosition.x - 2] !== 0) {
        return state;
      }

      return {
        ...state,
        currentBlockPosition: {
          x: currentBlockPosition.x - 1,
          y: currentBlockPosition.y
        }
      };
    }
    case "MoveRight": {
      const {width, height} = action;
      const {currentBlockPosition, board} = state;

      if (currentBlockPosition.x >= width || currentBlockPosition.y <= 0) {
        return state;
      }
      if (board[currentBlockPosition.y - 1][currentBlockPosition.x] !== 0) {
        return state;
      }

      return {
        ...state,
        currentBlockPosition: {
          x: currentBlockPosition.x + 1,
          y: currentBlockPosition.y
        }
      };
    }
    case "Drop": {
      const {width, height} = action;
      const {currentBlockPosition, board} = state;

      if (state.gameOver || state.gamePause || state.startingScreenOn || state.dropTargetY !== null) {
        return state;
      }
      if (currentBlockPosition.y <= 0) {
        return state;
      }

      const landingY = getDropLandingY(board, currentBlockPosition.x, currentBlockPosition.y, height);
      if (landingY <= currentBlockPosition.y) {
        return state;
      }

      return {...state, dropTargetY: landingY};
    }
    case "Tick": {
      const {time, fastDrop, width, height, numberOfColors, pointsPerTetromino, levelUpIncrement, startingLevel, dropSpeedAcceleration} = action;

      if (state.gameOver || state.gamePause || state.startingScreenOn) {
        return state;
      }

      const nextTickTime = time;
      const processed = processTetrominoes(state.board, width, height, numberOfColors, pointsPerTetromino);

      let nextState = {
        ...state,
        board: processed.state,
        score: state.score + processed.points,
        lastTickTime: nextTickTime
      };

      const newLevel = Math.floor(nextState.score / levelUpIncrement) + startingLevel;
      const levelChanged = newLevel > nextState.level;
      nextState = {
        ...nextState,
        level: newLevel,
        dropSpeed: levelChanged ? nextState.dropSpeed - nextState.dropSpeed * dropSpeedAcceleration : nextState.dropSpeed
      };

      const {currentBlockPosition, currentBlockQueue} = nextState;

      const positionX = currentBlockPosition.x;
      const positionY = currentBlockPosition.y;

      if (nextState.dropTargetY !== null) {
        const targetY = nextState.dropTargetY;
        const newY = Math.min(positionY + 1, targetY);

        if (newY < targetY) {
          return {...nextState, currentBlockPosition: {x: positionX, y: newY}};
        }
        if (targetY === 0) {
          return {...nextState, gameOver: true, dropTargetY: null};
        }

        const placed = currentBlockQueue[0];
        const newBlock = getRandomNumber(1, numberOfColors);
        const newBoard = nextState.board.map((row) => row.slice());

        newBoard[targetY - 1][positionX - 1] = placed;

        const newQueue = [...currentBlockQueue.slice(1), newBlock];

        return {
          ...nextState,
          board: newBoard,
          currentBlockQueue: newQueue,
          currentBlockPosition: {
            x: Math.ceil(width / 2),
            y: 0
          },
          lastDropTime: nextTickTime,
          delay: 0,
          dropTargetY: null
        };
      }

      if (!(fastDrop || nextTickTime >= state.lastDropTime + state.dropSpeed + state.delay)) {
        return nextState;
      }

      if (positionY < height && nextState.board[positionY][positionX - 1] === 0) {
        return {
          ...nextState,
          currentBlockPosition: {x: positionX, y: positionY + 1},
          lastDropTime: nextTickTime,
          delay: 0
        };
      }

      if (positionY === 0) {
        return {
          ...nextState,
          gameOver: true
        };
      }

      const placed = currentBlockQueue[0];
      const newBlock = getRandomNumber(1, numberOfColors);
      const newBoard = nextState.board.map((row) => row.slice());

      newBoard[positionY - 1][positionX - 1] = placed;

      const newQueue = [...currentBlockQueue.slice(1), newBlock];

      return {
        ...nextState,
        board: newBoard,
        currentBlockQueue: newQueue,
        currentBlockPosition: {
          x: Math.ceil(width / 2),
          y: 0
        },
        lastDropTime: nextTickTime,
        delay: 0
      };
    }
    default: {
      return state;
    }
  }
}
