export const GRID_SIZE = 3;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export function createSolvedBoard() {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i + 1);
}

export function indexToPos(index) {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

export function posToIndex(row, col) {
  return row * GRID_SIZE + col;
}

export function applySwap(board, indexA, indexB) {
  if (
    indexA === indexB ||
    indexA < 0 || indexA >= TOTAL_TILES ||
    indexB < 0 || indexB >= TOTAL_TILES
  ) {
    return board;
  }
  const next = [...board];
  [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
  return next;
}

export function isSolved(board) {
  const solved = createSolvedBoard();
  return board.length === TOTAL_TILES && board.every((v, i) => v === solved[i]);
}

export function countMisplaced(board) {
  return board.reduce((acc, v, i) => (v !== i + 1 ? acc + 1 : acc), 0);
}

export function createRandomBoard() {
  let board = createSolvedBoard();

  for (let i = TOTAL_TILES - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  if (isSolved(board)) {
    [board[0], board[1]] = [board[1], board[0]];
  }

  return board;
}
