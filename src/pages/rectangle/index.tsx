import styles from '../app.module.scss';
import React, { useState } from 'react';
import { Board, calculateWinner, type GameStatus, type Squares } from '../common/common.tsx';

export function RectangleApp() {
  // 定数は定数でまとめておく、定数を関数内におくのもあまりよくない　バラバラと置いておかない

  // グリッドの選択肢用
  const minGridSizeRow = 3;
  const maxGridSizeRow = 9;
  const minGridSizeCol = 4;
  const maxGridSizeCol = 10;

  // 勝利条件を変更できるのはたてよこそれぞれ何マス以上か
  const minBoardSizeForCustomWin = 5;

  // 各種State
  const [gridRowSize, setGridRowSize] = useState(0);
  const [gridColSize, setGridColSize] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('READY');
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState<Squares>([]);
  const [winConditionCount, setWinConditionCount] = useState<number>(0);

  // 勝利カウントの更新 更新じゃなくて、resetかinitが適切　初期化しているので　countもわかりづらくてびみょ
  const initWinConditionCount = (row: number, col: number) => {
    // row,col,customWinCountの最小値をとればいい　customWinCountも名前びみょう
    setWinConditionCount(Math.min(row, col, minBoardSizeForCustomWin));
  };

  // サイズ変更、リスタート時の共通初期化処理 restart
  const restart = (newRowSize: number, newColSize: number) => {
    setSquares(Array.from({ length: newRowSize }, () => Array(newColSize).fill(null)));
    setXIsNext(true);
    setGameStatus('READY');
  };

  // マスクリック時の処理
  const handleClick = (row: number, col: number) => {
    if (squares[row]?.[col] !== null || gameStatus === 'WIN' || gameStatus === 'LOSE' || gameStatus === 'DRAW') {
      return;
    }
    // 配列をコピーする
    const nextSquares = squares.map((row) => [...row]);

    nextSquares[row][col] = xIsNext ? 'X' : 'O';

    // このタイミングで勝者がきまるからここで勝者判定されればよいね
    // ステータスも更新する

    const winner = calculateWinner(nextSquares, winConditionCount);

    if (winner === 'X') {
      setGameStatus('WIN');
    } else if (winner === 'O') {
      setGameStatus('LOSE');
    } else if (!nextSquares.every((row) => row.every((cell) => cell !== null))) {
      setGameStatus('PLAYING');
    } else {
      setGameStatus('DRAW');
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // リセット確認 1行でもかけるね　、かいてみる
  const confirmReset = (): boolean => window.confirm('サイズを変更するとゲームがリセットされます。\nよろしいですか？');

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
    initWinConditionCount(newRowSize, gridColSize);

    restart(newRowSize, gridColSize);
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
    initWinConditionCount(gridRowSize, newColSize);

    // リスタート
    restart(gridRowSize, newColSize);
  };

  // 勝利条件変更時の処理
  const handleWinCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus === 'PLAYING') {
      if (!confirmReset()) {
        return;
      }
    }
    setWinConditionCount(Number(event.target.value));
    restart(gridRowSize, gridColSize);
  };

  // リセットボタン押下時の処理
  const handleRestart = () => {
    // ここでも確認ダイアログだすなら、Restart関数をもうひとつつくって双方でよぶ
    // gridSizeを引数で->Restart関数が何をするものなのかが明確になる

    if (gameStatus === 'PLAYING') {
      if (!confirmReset()) {
        return;
      }
    }

    restart(gridRowSize, gridColSize);
  };

  const player =
    gameStatus === 'WIN'
      ? `あなたの勝ちです！`
      : gameStatus === 'LOSE'
        ? 'ゲームに負けました。'
        : gameStatus === 'DRAW'
          ? '引き分けです。'
          : `次の人: ${xIsNext ? 'X' : 'O'}`;

  // {[...Array(maxGridSizeRow - minGridSizeRow + 1)].map((_, index) => (ここの動き微妙なので他の書き方考える
  return (
    <>
      <h1>まるばつゲーム (正方形＆長方形)</h1>
      <div>何マス×何マスでゲームする？</div>
      <div>
        たて
        <select className={styles.number} value={gridRowSize} onChange={handleRowSizeChange}>
          {!gridRowSize && <option value={0}>選択してね</option>}
          {Array(maxGridSizeRow - minGridSizeRow + 1)
            .fill(null)
            .map((_, index) => {
              const value = index + minGridSizeRow;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
        </select>
        × よこ
        <select className={styles.number} value={gridColSize} onChange={handleColSizeChange}>
          {!gridColSize && <option value={0}>選択してね</option>}
          {Array(maxGridSizeCol - minGridSizeCol + 1)
            .fill(null)
            .map((_, index) => {
              const value = index + minGridSizeCol;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
        </select>
      </div>
      <div>
        勝利条件（Xマス連続で勝利）
        <input
          type="number"
          min={Math.min(gridRowSize, gridColSize, minBoardSizeForCustomWin)}
          max={Math.min(gridRowSize, gridColSize)}
          value={winConditionCount}
          disabled={Math.min(gridRowSize, gridColSize) <= minBoardSizeForCustomWin}
          onChange={handleWinCountChange}
        />
        <br />
        ※縦横が{minBoardSizeForCustomWin}マスより大きい場合、変更可能です！
      </div>
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
