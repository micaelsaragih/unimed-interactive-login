/**
 * puzzle.ts — Pure puzzle logic for the 3×3 swap puzzle.
 *
 * No React, no DOM. All functions are pure and independently testable.
 *
 * Mechanism: select-and-swap.
 *   - The board has 9 tiles, each always showing a portion of the logo.
 *   - There is NO empty cell.
 *   - The user selects one tile, then another; the two tiles swap positions.
 *   - Any two tiles may be swapped (no adjacency restriction).
 *
 * Board representation:
 *   - A flat array of 9 numbers (length 9).
 *   - Values 1–9 are tile IDs; each ID corresponds to the tile's home position
 *     in the solved arrangement.
 *   - Solved board: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * Index layout:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 *
 * Tile-to-logo mapping (solved positions):
 *   Tile 1 → top-left,    Tile 2 → top-center,    Tile 3 → top-right
 *   Tile 4 → mid-left,    Tile 5 → mid-center,    Tile 6 → mid-right
 *   Tile 7 → bot-left,    Tile 8 → bot-center,    Tile 9 → bot-right
 */

export const GRID_SIZE = 3;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 9

/** A flat array of 9 tile IDs (1–9) representing the current board state. */
export type Board = number[];

/**
 * Returns the canonical solved board: [1, 2, 3, 4, 5, 6, 7, 8, 9].
 */
export function createSolvedBoard(): Board {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i + 1);
}

/**
 * Returns the { row, col } of a given board index (0-indexed flat position).
 */
export function indexToPos(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

/**
 * Converts a (row, col) pair to a flat board index.
 */
export function posToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

/**
 * Returns a new board with the tiles at indexA and indexB swapped.
 * Returns the SAME reference if indexA === indexB or either is out of range.
 * Never mutates the input board.
 */
export function applySwap(board: Board, indexA: number, indexB: number): Board {
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

/**
 * Returns true when the board matches the solved arrangement [1,2,3,4,5,6,7,8,9].
 */
export function isSolved(board: Board): boolean {
  const solved = createSolvedBoard();
  return board.length === TOTAL_TILES && board.every((v, i) => v === solved[i]);
}

/**
 * Returns the number of tiles that are NOT in their solved position.
 * Useful for providing progress feedback (0 = solved).
 */
export function countMisplaced(board: Board): number {
  return board.reduce((acc, v, i) => (v !== i + 1 ? acc + 1 : acc), 0);
}

/**
 * Generates a randomised board that is guaranteed to be:
 *   - Solvable (any permutation of 9 tiles is reachable via swaps, so always true).
 *   - Not already in the solved arrangement.
 *
 * Uses a Fisher-Yates shuffle. Since every permutation is reachable by swaps,
 * no parity correction is needed.
 */
export function createRandomBoard(): Board {
  let board = createSolvedBoard();

  // Fisher-Yates shuffle
  for (let i = TOTAL_TILES - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  // Safety: if somehow the board ended up solved, swap the first two tiles.
  if (isSolved(board)) {
    [board[0], board[1]] = [board[1], board[0]];
  }

  return board;
}
