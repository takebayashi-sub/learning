import styles from '../app.module.scss';

/**
 * 共通の定義
 */
export type CellValue = 'X' | 'O' | null;
export type Squares = CellValue[][];

/**
 * ゲームステータス
 */
export type GameStatus = 'READY' | 'PLAYING' | 'WIN' | 'LOSE';

/**
 * ひとつひとつのマス
 */
export type SquareProps = {
  value: CellValue;
  onSquareClick: () => void;
};

export function Square(props: SquareProps) {
  // const [value, setValue] = useState<string | null>(null);
  const { value, onSquareClick } = props;

  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}
