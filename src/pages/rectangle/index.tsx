import styles from '../app.module.scss';
import React, { useState } from 'react';
import { type CellValue, type GameStatus, Square, type Squares } from '../common/common.tsx';

export default function RectangleApp() {
  // グリッドの選択肢用
  const minGridSizeRow = 3;
  const maxGridSizeRow = 6;
  const minGridSizeCol = 4;
  const maxGridSizeCol = 7;

  // 各種State
  const [gridRowSize, setGridRowSize] = useState(0);
  const [gridColSize, setGridColSize] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('READY');
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState<Squares>([]);
  const [winCount, setWinCount] = useState<number>(0);

  // 勝利条件を変更できるのはたてよこそれぞれ何マス以上か
  const customWinCount = 5;

  // 勝利カウントの更新
  const updateWinCount = (row: number, col: number) => {
    const smallSize = Math.min(row, col);
    if (row >= customWinCount && col >= customWinCount) {
      setWinCount(customWinCount);
    } else {
      setWinCount(smallSize);
    }
  };

  // サイズ変更、リスタート時の共通初期化処理
  const Restart = (newRowSize: number, newColSize: number) => {
    setSquares(Array.from({ length: newRowSize }, () => Array(newColSize).fill(null)));
    setXIsNext(true);
    setGameStatus('READY');
  };

  // マスクリック時の処理
  const handleClick = (row: number, col: number) => {
    if (squares[row]?.[col] !== null || gameStatus === 'WIN' || gameStatus === 'LOSE') {
      return;
    }
    // 配列をコピーする
    const nextSquares = squares.map((row) => [...row]);

    nextSquares[row][col] = xIsNext ? 'X' : 'O';

    // このタイミングで勝者がきまるからここで勝者判定されればよいね
    // ステータスも更新する
    const winner = calculateWinner(nextSquares, winCount);

    console.log(winCount);

    if (winner === 'X') {
      setGameStatus('WIN');
    } else if (winner === 'O') {
      setGameStatus('LOSE');
    } else {
      setGameStatus('PLAYING');
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // リセット確認
  const confirmReset = (): boolean => {
    return window.confirm('サイズを変更するとゲームがリセットされます。\nよろしいですか？');
  };

  // サイズ変更時の処理
  const handleRowSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus === 'PLAYING') {
      if (!confirmReset()) {
        return;
      }
    }
    const newRowSize = Number(event.target.value);
    setGridRowSize(newRowSize);

    // 勝利カウントを更新
    updateWinCount(newRowSize, gridColSize);

    Restart(newRowSize, gridColSize);
  };

  const handleColSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus === 'PLAYING') {
      if (!confirmReset) {
        return;
      }
    }
    const newColSize = Number(event.target.value);
    setGridColSize(newColSize);

    // 勝利カウントを更新
    updateWinCount(gridRowSize, newColSize);

    // リスタート
    Restart(gridRowSize, newColSize);
  };

  // 勝利条件変更時の処理
  const handleWinCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus === 'PLAYING') {
      if (!confirmReset()) {
        return;
      }
    }
    setWinCount(Number(event.target.value));
    Restart(gridRowSize, gridColSize);
  };

  // リセットボタン押下時の処理
  const handleRestart = () => {
    // ここでも確認ダイアログだすなら、Restart関数をもうひとつつくって双方でよぶ
    // gridSizeを引数で->Restart関数が何をするものなのかが明確になる

    if (gameStatus === 'PLAYING') {
      const result = window.confirm('ゲームをリセットしてもよろしいですか？');
      if (!result) {
        return;
      }
    }

    Restart(gridRowSize, gridColSize);
  };

  const player =
    gameStatus === 'WIN'
      ? `あなたの勝ちです！`
      : gameStatus === 'LOSE'
        ? 'ゲームに負けました。'
        : `次の人: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <h1>まるばつゲーム (正方形＆長方形)</h1>
      <div>何マス×何マスでゲームする？</div>
      <div>
        たて
        <select className={styles.number} value={gridRowSize} onChange={handleRowSizeChange}>
          {!gridRowSize && <option value={0}>選択してね</option>}
          {[...Array(maxGridSizeRow - minGridSizeRow + 1)].map((_, index) => (
            <option key={index} value={index + minGridSizeRow}>
              {index + minGridSizeRow}
            </option>
          ))}
        </select>
        × よこ
        <select className={styles.number} value={gridColSize} onChange={handleColSizeChange}>
          {!gridColSize && <option value={0}>選択してね</option>}
          {[...Array(maxGridSizeCol - minGridSizeCol + 1)].map((_, index) => (
            <option key={index} value={index + minGridSizeCol}>
              {index + minGridSizeCol}
            </option>
          ))}
        </select>
      </div>
      {gridRowSize >= 5 && gridColSize >= 5 && (
        <div>
          <label>何個連続で勝ちとする？</label>
          <input
            type="number"
            min={5}
            max={Math.max(gridRowSize, gridColSize)}
            value={winCount}
            onChange={handleWinCountChange}
          />
        </div>
      )}
      <hr />
      <div className={styles.player}>
        {player}
        <button onClick={handleRestart}>Restart</button>
      </div>
      <hr />
      <Board variableSquare={squares} onSquareClick={handleClick} />
    </>
  );
}

type CreateBoardProps = {
  variableSquare: Squares;
  onSquareClick: (row: number, col: number) => void;
};

function Board({ variableSquare, onSquareClick }: CreateBoardProps) {
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
function calculateWinner(squares: Squares, winCount: number): CellValue {
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
