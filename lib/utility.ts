import type {BlockID} from "@/types";

export function generateEmptyGrid(width: number, height: number): BlockID[][] {
  return Array.from({length: height}, () => {
    return Array.from({length: width}, () => 0);
  });
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function processTetrominoes(boardState: BlockID[][], width: number, height: number, numberOfBlocks: number): {points: number, state: BlockID[][]} {
  let awardedPoints = 0;
  let newBoardState = boardState.map(row => row.slice());

  for (let n = 0; n < numberOfBlocks; n++) {
    let tetrominoBlocks = checkTetromino(newBoardState, width, height, n + 1);
    if (tetrominoBlocks.length > 0) {
      awardedPoints = awardedPoints + 1000 / 2;
      for (const [x, y] of tetrominoBlocks) {
        newBoardState[y][x] = 0;
      }
      newBoardState = dropFloatingBlocks(newBoardState, width, height);
    }
  }

  return {points: awardedPoints, state: newBoardState};
}

export function dropFloatingBlocks(boardState: BlockID[][], width: number, height: number): BlockID[][] {
  const newBoardState = boardState.map(row => row.slice());

  for (let x = 0; x < width; x++) {
    let emptyRow = height - 1;

    for (let y = height - 1; y >= 0; y--) {
      if (newBoardState[y][x] !== 0) {
        if (y !== emptyRow) {
          newBoardState[emptyRow][x] = newBoardState[y][x];
          newBoardState[y][x] = 0;
        }
        emptyRow--;
      }
    }
  }

  return newBoardState;
}

export function checkTetromino(boardState: BlockID[][], width: number, height: number, target: BlockID): number[][] {
  const visited = new Set<string>();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (boardState[y][x] === target && !visited.has(`${x},${y}`)) {
        const shape = dfs(boardState, width, height, x, y, target, visited);

        if (shape.length >= 4) {
          return shape;
        }
      }
    }
  }

  return [];
}

function dfs(boardState: BlockID[][], width: number, height: number, x: number, y: number, target: BlockID, visited: Set<string>): number[][] {
  if (x < 0 || x >= width || y < 0 || y >= height || boardState[y][x] !== target || visited.has(`${x},${y}`)) {
    return [];
  }
  visited.add(`${x},${y}`);
  let blocks = [[x, y]];

  blocks = blocks.concat(dfs(boardState, width, height, x + 1, y, target, visited));
  blocks = blocks.concat(dfs(boardState, width, height, x - 1, y, target, visited));
  blocks = blocks.concat(dfs(boardState, width, height, x, y + 1, target, visited));
  blocks = blocks.concat(dfs(boardState, width, height, x, y - 1, target, visited));

  return blocks;
}
