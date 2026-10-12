import styles from './PuzzleTile.module.css';
import { GRID_SIZE } from '../../lib/puzzle';

const LOGO_SRC = '/assets/logo-unimed.png';

export function PuzzleTile({
  tileId,
  selected = false,
  onClick,
  disabled,
  dissolving = false,
}) {
  const col = (tileId - 1) % GRID_SIZE;
  const row = Math.floor((tileId - 1) / GRID_SIZE);

  const bgX = col * 50;
  const bgY = row * 50;

  return (
    <button
      type="button"
      className={[
        styles.tile,
        selected ? styles.selected : '',
        disabled ? styles.disabled : '',
        dissolving ? styles.dissolving : '',
      ].filter(Boolean).join(' ')}
      style={{
        backgroundImage: `url(${LOGO_SRC})`,
        backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
        backgroundPosition: `${bgX}% ${bgY}%`,
      }}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={disabled ? undefined : (selected ? 'true' : 'false')}
      aria-label={
        disabled
          ? `Keping ${tileId}`
          : selected
          ? `Keping ${tileId} dipilih — klik keping lain untuk menukar posisi`
          : `Keping ${tileId} — klik untuk memilih`
      }
    />
  );
}
