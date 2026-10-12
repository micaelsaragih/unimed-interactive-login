import styles from './PuzzlePlaceholder.module.css';

export function PuzzlePlaceholder({ logoSrc, disabled = false }) {
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
          const bgX = col * 50;
          const bgY = row * 50;

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
