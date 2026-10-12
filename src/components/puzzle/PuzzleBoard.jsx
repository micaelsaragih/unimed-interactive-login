import { useMemo, useRef, useState } from 'react';
import {
  applySwap,
  createRandomBoard,
  isSolved,
} from '../../lib/puzzle';
import { PuzzleTile } from './PuzzleTile';
import styles from './PuzzleBoard.module.css';

function createParticles(seed) {
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
}) {
  const [board, setBoard] = useState(() => createRandomBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const solvedCalledRef = useRef(false);
  const particles = useMemo(
    () => dissolveSeed === null ? [] : createParticles(dissolveSeed),
    [dissolveSeed],
  );

  function handleTileClick(clickedIndex) {
    if (disabled || solved) return;

    if (selectedIndex === null) {
      setSelectedIndex(clickedIndex);
      return;
    }

    if (selectedIndex === clickedIndex) {
      setSelectedIndex(null);
      return;
    }
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
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

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

      {!solved && !disabled && selectedIndex !== null && (
        <p className={styles.selectionHint} role="status" aria-live="polite">
          Keping dipilih — klik keping lain untuk menukar posisi.
        </p>
      )}

      {solved && (
        <p className={styles.successMsg} role="status" aria-live="polite">
          ✓ Puzzle berhasil diselesaikan!
        </p>
      )}
    </div>
  );
}
