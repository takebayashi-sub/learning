import styles from '../app.module.scss';

/**
 * 共通の定義
 */
export type CellValue = 'X' | 'O' | null;
export type Squares = CellValue[][];

type BoardProps = {
  variableSquare: Squares;
  onSquareClick: (row: number, col: number) => void;
};

/**
 * ゲームステータス
 */
export type GameStatus = 'READY' | 'PLAYING' | 'WIN' | 'LOSE' | 'DRAW';

/**
 * ボード内のひとつひとつのマス
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

/**
 * ゲームボードの作成
 */

export function Board(props: BoardProps) {
  const { variableSquare, onSquareClick } = props;

  return (
    <table className={styles.board}>
      <tbody>
        {variableSquare.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <Square value={cell} onSquareClick={() => onSquareClick(rowIndex, colIndex)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * 勝利判定
 */
export function calculateWinner(squares: Squares, winCount: number): CellValue {
  if (squares.length === 0 || !squares[0]) {
    return null;
  }

  const rowSize = squares.length;
  const colSize = squares[0].length;
  // 盤面の中をクリックしたときだけこれが呼ばれることを確認してみる

  // 横（各行）、縦（各列）、斜め（2本）のすべてのラインを配列として抽出
  // 縦
  const rows = squares;
  // 横
  const cols = Array.from({ length: colSize }, (_, col) => squares.map((row) => row[col]));

  // 斜め 左上->右下
  const mainDiagonal: CellValue[][] = [];
  for (let startCol = 0; startCol < colSize; startCol++) {
    const diagonal: CellValue[] = [];

    let row = 0;
    let col = startCol;

    while (row < rowSize && col < colSize) {
      diagonal.push(squares[row][col]);

      row++;
      col++;
    }

    mainDiagonal.push(diagonal);
  }

  for (let startRow = 1; startRow < rowSize; startRow++) {
    const diagonal: CellValue[] = [];

    let row = startRow;
    let col = 0;

    while (row < rowSize && col < colSize) {
      diagonal.push(squares[row][col]);

      row++;
      col++;
    }

    mainDiagonal.push(diagonal);
  }

  // 斜め 右上->左下
  const antiDiagonal: CellValue[][] = [];

  for (let startCol = 0; startCol < colSize; startCol++) {
    const diagonal: CellValue[] = [];

    let row = 0;
    let col = startCol;

    while (row < rowSize && col >= 0) {
      diagonal.push(squares[row][col]);

      row++;
      col--;
    }

    antiDiagonal.push(diagonal);
  }

  for (let startRow = 1; startRow < rowSize; startRow++) {
    const diagonal: CellValue[] = [];

    let row = startRow;
    let col = colSize - 1;

    while (row < rowSize && col >= 0) {
      diagonal.push(squares[row][col]);

      row++;
      col--;
    }

    antiDiagonal.push(diagonal);
  }

  const allLines = [...rows, ...cols, ...mainDiagonal, ...antiDiagonal];

  // 作成した配列から勝利判定
  for (const line of allLines) {
    let count = 1;
    for (let i = 1; i < line.length; i++) {
      if (line[i] !== null && line[i] === line[i - 1]) {
        // 一致したらカウントを増やす
        count++;

        if (count === winCount) {
          return line[i];
        }
      } else {
        // 一致しなくなったらリセット
        count = 1;
      }
    }
  }
  return null;
}
