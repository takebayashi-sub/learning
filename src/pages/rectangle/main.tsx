import styles from '../app.module.scss';
import React, { useState } from 'react';
import { GameStatus, type Squares } from '../common/common.tsx';

export default function RectangleApp() {
  // グリッドの選択肢用
  const minGridSizeRow = 3;
  const maxGridSizeRow = 6;
  const minGridSizeCol = 4;
  const maxGridSizeCol = 7;

  // 各種State
  const [gridSizeRow, setGridSizeRow] = useState(0);
  const [gridSizeCol, setGridSizeCol] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.READY);
  const [xIsNext, setXIsNext] = useState(true);
  const [gridSize, setGridSize] = useState(0);
  const [squares, setSquares] = useState<Squares>([]);

  // サイズ変更、リスタート時の共通初期化処理
  const Restart = (newSize: number) => {
    setSquares(Array.from({ length: newSize }, () => Array(newSize).fill(null)));
    setXIsNext(true);
    setGameStatus(GameStatus.READY);
  };

  // マスクリック時の処理
  const handleClick = (row: number, col: number) => {};

  // サイズ変更時の処理
  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus === GameStatus.PLAYING) {
      const result = window.confirm('サイズを変更するとゲームがリセットされます。\nよろしいですか？');
      if (!result) {
        return;
      }
    }
    const newSize = Number(event.target.value);
    setGridSize(newSize);
    Restart(newSize);
  };

  // リセットボタン押下時の処理
  const handleRestart = () => {
    // ここでも確認ダイアログだすなら、Restart関数をもうひとつつくって双方でよぶ
    // gridSizeを引数で->Restart関数が何をするものなのかが明確になる

    if (gameStatus === GameStatus.PLAYING) {
      const result = window.confirm('ゲームをリセットしてもよろしいですか？');
      if (!result) {
        return;
      }
    }

    Restart(gridSize);
  };

  const player =
    gameStatus === GameStatus.WIN
      ? `あなたの勝ちです！`
      : gameStatus === GameStatus.LOSE
        ? 'ゲームに負けました。'
        : `次の人: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <h1>まるばつゲーム (正方形＆長方形)</h1>
      <div>何マス×何マスでゲームする？</div>
      <div>
        たて
        <select className={styles.number} value={gridSizeCol} onChange={handleSizeChange}>
          {!gridSizeCol && <option value={0}>選択してね</option>}
          {[...Array(maxGridSizeCol - minGridSizeCol + 1)].map((_, index) => (
            <option key={index} value={index + minGridSizeCol}>
              {index + minGridSizeCol}
            </option>
          ))}
        </select>
        × よこ
        <select className={styles.number} value={gridSizeRow} onChange={handleSizeChange}>
          {!gridSizeRow && <option value={0}>選択してね</option>}
          {[...Array(maxGridSizeRow - minGridSizeRow + 1)].map((_, index) => (
            <option key={index} value={index + minGridSizeRow}>
              {index + minGridSizeRow}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className={styles.player}>
        {player}
        <button onClick={handleRestart}>Restart</button>
      </div>
      <hr />
      <Board size={gridSize} variableSquare={squares} onSquareClick={handleClick} />
    </>
  );
}

type CreateBoardProps = {
  size: number;
  variableSquare: Squares;
  onSquareClick: (row: number, col: number) => void;
};

function Board({ size, variableSquare, onSquareClick }: CreateBoardProps) {
  return (
    <>
      <div>{size}</div>
    </>
  );
}
