/**
 * PuzzlePlaceholder — visual placeholder for the 3×3 sliding puzzle.
 *
 * Renders a 3×3 grid that previews how the tiled logo will look when the
 * real PuzzleBoard is implemented in Phase 3. The last cell (index 8) is
 * the empty space, shown with a dashed border.
 *
 * Props:
 *   logoSrc  — URL of the UNIMED logo image.
 *   disabled — when true the tiles appear visually inactive (post-unlock).
 */

import styles from './PuzzlePlaceholder.module.css';

export function PuzzlePlaceholder({ logoSrc, disabled = false }) {
  // 3×3 grid: indices 0-7 are tiles; index 8 is the empty space.
  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <div
        className={styles.grid}
        role="img"
        aria-label="Puzzle logo UNIMED — implementasi belum tersedia"
      >
        {cells.map((index) => {
          const isEmpty = index === 8;
          const col = index % 3;
          const row = Math.floor(index / 3);
          // backgroundPosition: place each tile's slice of the 3×3 logo.
          // backgroundSize: 300%×300% so each tile shows 1/9 of the image.
          const bgX = col * 50;   // 0%, 50%, 100%
          const bgY = row * 50;   // 0%, 50%, 100%

          return (
            <div
              key={index}
              className={isEmpty ? styles.emptyCell : styles.tileCell}
              style={
                !isEmpty
                  ? {
                      backgroundImage: `url(${logoSrc})`,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${bgX}% ${bgY}%`,
                    }
                  : undefined
              }
              aria-hidden="true"
            />
          );
        })}
      </div>

      <p className={styles.caption}>
        Susun keping untuk membentuk logo UNIMED.
      </p>
    </div>
  );
}
