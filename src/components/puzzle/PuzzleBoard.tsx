/**
 * PuzzleBoard — 3×3 swap puzzle using the official UNIMED logo.
 *
 * Mechanism: select-and-swap.
 *   - All 9 cells always display a tile (no empty space).
 *   - Clicking one tile selects it (highlighted ring).
 *   - Clicking a second tile swaps the two selected tiles.
 *   - Clicking the already-selected tile deselects it (cancel).
 *
 * Board logic is fully delegated to src/lib/puzzle.ts (pure, testable).
 * onSolved is called exactly once, guarded by a ref.
 */

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  applySwap,
  createRandomBoard,
  isSolved,
  type Board,
} from '../../lib/puzzle';
import { PuzzleTile } from './PuzzleTile';
import styles from './PuzzleBoard.module.css';

interface PuzzleBoardProps {
  /** Called exactly once when the puzzle reaches its solved arrangement. */
  onSolved: () => void;
  /** When true, all tile interaction and the reshuffle button are locked. */
  disabled?: boolean;
  dissolving?: boolean;
  dissolveSeed: number | null;
}

interface Particle {
  cell: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
}

function createParticles(seed: number): Particle[] {
  let value = seed || 1;
  const random = () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0xffffffff;
  };

  return Array.from({ length: 9 }, (_, cell) =>
    Array.from({ length: 4 }, () => {
      const angle = random() * Math.PI * 2;
      const distance = 28 + random() * 54;

      return {
        cell,
        left: 12 + random() * 76,
        top: 12 + random() * 76,
        size: 3 + random() * 3,
        opacity: 0.45 + random() * 0.4,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        duration: 620 + random() * 180,
        delay: random() * 100,
      };
    }),
  ).flat();
}

export function PuzzleBoard({
  onSolved,
  disabled = false,
  dissolving = false,
  dissolveSeed,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState<Board>(() => createRandomBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [solved, setSolved] = useState(false);
  /** Index of the currently selected tile, or null if none selected. */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Guard: onSolved must fire at most once per puzzle instance.
  const solvedCalledRef = useRef(false);
  const particles = useMemo(
    () => dissolveSeed === null ? [] : createParticles(dissolveSeed),
    [dissolveSeed],
  );

  function handleTileClick(clickedIndex: number) {
    // Ignore clicks when board is locked
    if (disabled || solved) return;

    if (selectedIndex === null) {
      // First click — select this tile
      setSelectedIndex(clickedIndex);
      return;
    }

    if (selectedIndex === clickedIndex) {
      // Clicking the same tile again → deselect
      setSelectedIndex(null);
      return;
    }

    // Second click on a different tile → swap
    const newBoard = applySwap(board, selectedIndex, clickedIndex);
    setSelectedIndex(null);
    setBoard(newBoard);
    setMoveCount((prev) => prev + 1);

    if (isSolved(newBoard) && !solvedCalledRef.current) {
      solvedCalledRef.current = true;
      setSolved(true);
      onSolved();
    }
  }

  function handleReshuffle() {
    if (solved || disabled) return;
    setBoard(createRandomBoard());
    setMoveCount(0);
    setSelectedIndex(null);
  }

  return (
    <div className={styles.wrapper} aria-hidden={dissolving}>
      {/* 3×3 grid — all 9 cells always filled */}
      <div className={styles.boardStage}>
        <div
          className={styles.grid}
          role="group"
          aria-label="Puzzle pertukaran keping logo UNIMED"
        >
          {board.map((tileId, index) => (
            <PuzzleTile
              key={tileId}
              tileId={tileId}
              selected={selectedIndex === index}
              onClick={() => handleTileClick(index)}
              disabled={disabled || solved}
              dissolving={dissolving}
            />
          ))}
        </div>
        {dissolving && particles.length > 0 && (
          <div className={styles.particleLayer} aria-hidden="true">
            {Array.from({ length: 9 }, (_, cell) => (
              <div className={styles.particleCell} key={cell}>
                {particles.filter((particle) => particle.cell === cell).map((particle, index) => (
                  <span
                    className={styles.particle}
                    key={index}
                    style={{
                      '--left': `${particle.left}%`,
                      '--top': `${particle.top}%`,
                      '--size': `${particle.size}px`,
                      '--opacity': particle.opacity,
                      '--dx': `${particle.dx}px`,
                      '--dy': `${particle.dy}px`,
                      '--duration': `${particle.duration}ms`,
                      '--delay': `${particle.delay}ms`,
                    } as CSSProperties}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls row — hidden once solved */}
      {!solved && !disabled && (
        <div className={styles.controls}>
          <span
            className={styles.moveCounter}
            aria-live="polite"
            aria-atomic="true"
          >
            {moveCount} pertukaran
          </span>
          <button
            type="button"
            className={styles.reshuffleBtn}
            onClick={handleReshuffle}
            disabled={solved || disabled}
          >
            Acak ulang
          </button>
        </div>
      )}

      {/* Selection hint — shown while a tile is selected */}
      {!solved && !disabled && selectedIndex !== null && (
        <p className={styles.selectionHint} role="status" aria-live="polite">
          Keping dipilih — klik keping lain untuk menukar posisi.
        </p>
      )}

      {/* Success message */}
      {solved && (
        <p className={styles.successMsg} role="status" aria-live="polite">
          ✓ Puzzle berhasil diselesaikan!
        </p>
      )}
    </div>
  );
}
