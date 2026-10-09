/**
 * PuzzleTile — a single interactive tile in the 3×3 swap puzzle.
 *
 * Renders as a <button> showing the correct slice of /assets/logo-unimed.png.
 *
 * Background math (9 tiles, 3 columns):
 *   backgroundSize: '300% 300%'  — scale the full image so each cell shows 1/3
 *   backgroundPosition: col × 50%, row × 50%
 *     col 0 → 0%,  col 1 → 50%,  col 2 → 100%
 *     row 0 → 0%,  row 1 → 50%,  row 2 → 100%
 *
 * The tile's IMAGE position is fixed to its tileId (1–9), regardless of where
 * the tile currently sits on the board. Moving a tile only changes its board
 * position; the image slice it carries stays the same.
 *
 * States:
 *   default  — normal interactive tile
 *   selected — first tile clicked, waiting for the second selection
 *   disabled — board is locked (puzzle solved or app in unlocking/unlocked state)
 */

import styles from './PuzzleTile.module.css';
import { GRID_SIZE } from '../../lib/puzzle';

interface PuzzleTileProps {
  /** 1–9: identifies which logo slice this tile carries. */
  tileId: number;
  /** Whether this tile is the currently selected (first-click) tile. */
  selected?: boolean;
  onClick: () => void;
  disabled: boolean;
  dissolving?: boolean;
}

const LOGO_SRC = '/assets/logo-unimed.png';

export function PuzzleTile({
  tileId,
  selected = false,
  onClick,
  disabled,
  dissolving = false,
}: PuzzleTileProps) {
  // Original grid column and row based on tileId (1-indexed → 0-indexed).
  const col = (tileId - 1) % GRID_SIZE;
  const row = Math.floor((tileId - 1) / GRID_SIZE);

  // Percentage-based background position — correct at any rendered tile size.
  const bgX = col * 50; // 0, 50, or 100
  const bgY = row * 50; // 0, 50, or 100

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
