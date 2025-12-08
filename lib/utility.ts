export function generateEmptyGrid(width: number, height: number): number[][] {
  return Array.from({length: height}, () => {
    return Array.from({length: width}, () => 0);
  });
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
