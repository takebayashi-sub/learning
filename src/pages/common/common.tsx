import styles from '../square/square.module.scss';

/**
 * 共通の定義
 */
export type CellValue = 'X' | 'O' | null;
export type Squares = CellValue[][];

/**
 * ゲームステータス
 */
export const GameStatus = {
  READY: 'ゲーム前',
  PLAYING: 'ゲーム中',
  WIN: '勝利',
  LOSE: '負け',
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

/**
 * ひとつひとつのマス
 */
export type SquareProps = {
  value: CellValue;
  onSquareClick: () => void;
};

export function Square({ value, onSquareClick }: SquareProps) {
  // const [value, setValue] = useState<string | null>(null);

  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}
