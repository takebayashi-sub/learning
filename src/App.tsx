import styles from './app.module.scss';
import React, { useState } from 'react';

type CellValue = 'X' | 'O' | null;
type Squares = CellValue[][];

const GameStatus = {
  READY: 'ゲーム前',
  PLAYING: 'ゲーム中',
  FINISHED: 'ゲーム終了',
};

export default function App() {
  const minBoardSize = 3;
  const maxBoardSize = 9;
  const [gameStatus, setGameStatus] = useState(GameStatus.READY);
  const [xIsNext, setXIsNext] = useState(true);
  const [gridSize, setGridSize] = useState(0);
  // サイズ変換するときに配列を作りなおすので、ここでは配列は空でよい（コストになる）
  const [squares, setSquares] = useState<Squares>([]);

  // handleClick,handleRestartから呼ばれるので前に追加
  const Restart = (newSize: number) => {
    setSquares(Array.from({ length: newSize }, () => Array(newSize).fill(null)));
    setXIsNext(true);
    setGameStatus(GameStatus.READY);
  };
  // row.colは範囲外が渡ってきた時にエラーになるから、範囲内であることの確認を入れた方がよい
  //
  const handleClick = (row: number, col: number) => {
    // すでに値が入っているのであればreturn ＊これで上書きされない
    // すでに勝敗が決まっているのであれば、return ＊これ以上アイコンをおけない

    // ゲーム前、中、終了を持てばここでも判定につかえるね
    // ステータスと勝者の情報を合体する手もある
    if (squares[row]?.[col] !== null || gameStatus === GameStatus.FINISHED) {
      return;
    }
    // 配列をコピーする
    // 浅いコピー　しらべておく
    // 一階層ずつ浅いコピーを行う。structuredCloneは中にあるオブジェクトも含めて全てコピーする
    const nextSquares = squares.map((row) => [...row]);

    // 以下の書き方もOK！sliceは、どこからどこまでをコピーするか引数を指定できる。
    // 引数を指定していない場合は、全量をコピーする
    // const nextSquares = squares.slice();
    nextSquares[row][col] = xIsNext ? 'X' : 'O';

    // このタイミングで勝者がきまるからここで勝者判定されればよいね
    // ステータスも更新する
    const winner = calculateWinner(nextSquares, gridSize);
    if (winner) {
      setGameStatus(GameStatus.FINISHED);
    } else {
      setGameStatus(GameStatus.PLAYING);
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    // trueをtrueにしても再レンダリングしないから判断いらんかも
    // isGameInProgressというフラグじゃなくて、stateをもったほうが実務的　ゲーム前、中、終了
  };

  // これもアロー関数に変えて
  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // ここに確認ダイアログをいれてもよし　OKならすすむ

    // 初回はサイズ変更時に、このダイアログは出さない

    // そもそもこれいらないね

    // ゲーム中であれば、リセットしてよいか聞く
    // ゲーム終了のとき、この確認いらないっていう仕様だとこれではダメだね
    // ここでもゲームステータスを使える
    if (gameStatus === GameStatus.PLAYING) {
      const result = window.confirm('サイズを変更するとゲームがリセットされます。\nよろしいですか？');
      if (!result) {
        return;
      }
    }

    // gridSizeがたぶん前のままだからlogで確認してみること

    const newSize = Number(event.target.value);
    setGridSize(newSize);

    // handleRestartよべばいい、同じコード書いてるよ
    // 呼ぶ関数は前に書くことを忘れないで

    Restart(newSize);
  };

  //　関数内でfunctionはやめて、アロー関数で書いた方がよい。それと、使う関数は使う箇所よりも前に定義しておく。

  // リセット
  // 引数いらなくない？
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

  // gridSizeが存在する１以上のときは、選択するを表示しない処理があるとよい！

  // 何度もおなじ関数をよんでいるので、むだがおおい
  // レンダリングのたびにやるんじゃなくて、クリックしたタイミングだけで判断したらいいんでは

  // アロー関数の間にあったのでここに持ってきた

  // winnerをhandleClickの中にもってしまっているから、ここでも再計算しないといけないことになっている
  // handleClick外にwinnerをもっておく　win/loseでステータスを持つ場合もあるよ
  const winner = squares ? calculateWinner(squares, gridSize) : null;
  const player = winner ? `勝者: ${winner}` : `次の人: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <h1>まるばつゲーム</h1>
      <div>
        何マスでゲームする？
        <select className={styles.number} value={gridSize} onChange={handleSizeChange}>
          {!gridSize && <option value={0}>選択してね</option>}
          {/* i、min、maxは何の変数かわからないので、誰がみてもわかる変数名をつける */}
          {[...Array(maxBoardSize - minBoardSize + 1)].map((_, index) => (
            <option key={index} value={index + minBoardSize}>
              {index + minBoardSize} x {index + minBoardSize}
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

type SquareProps = {
  value: CellValue;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  // const [value, setValue] = useState<string | null>(null);

  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function SquareInline({ value, onSquareClick }: SquareProps) {
  // const [value, setValue] = useState<string | null>(null);

  return (
    <button className={styles.squareInline} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: Squares, gridSize: number): CellValue {
  if (gridSize <= 0 || squares.length === 0 || !squares[0]) {
    return null;
  }

  // 盤面の中をクリックしたときだけこれが呼ばれることを確認してみる

  // 横（各行）、縦（各列）、斜め（2本）のすべてのラインを配列として抽出
  const rows = squares;
  const cols = squares[0].map((_, colIndex) => squares.map((row) => row[colIndex]));
  const mainDiagonal = [squares.map((row, index) => row[index])];
  const antiDiagonal = [squares.map((row, index) => row[gridSize - 1 - index])];

  const allLines = [...rows, ...cols, ...mainDiagonal, ...antiDiagonal];

  // 全マスが同じ値（かつ null ではない）ラインを探す
  const winningLine = allLines.find((line) => line[0] !== null && line.every((cell) => cell === line[0]));

  return winningLine ? winningLine[0] : null;
}

// 最低限の不具合を防ぐために、Typeはしっかりと明示する。string|nullだけではなくて、
// ここではX|O|nullのみを許容するので、そのように定義することで不具合を防ぐことができる
type CreateBoardProps = {
  size: number;
  variableSquare: Squares;
  onSquareClick: (row: number, col: number) => void;
};

// CreateBoardはCreateが動詞なので、他の名詞がよい　Reactコンポーネントなので、処理の意味が伝わらない、差異がある
// Boardとか、GameBoardとかが適切
function Board({ size, variableSquare, onSquareClick }: CreateBoardProps) {
  // Array.from({ length: size * size }).map　ここの書き方は他のArrayと

  // variableSquareを渡してるから、そもそもそれの値を使えばよしで、新しくArrayを作る必要なし

  // 2次元配列になったので、ここもTableにするとか、flexboxとか、gridじゃない方法をみてみる（シンプルにできそう）
  // cssのほうもいろいろありそうなので試してみる

  return (
    <>
      <div className={styles.variableSquare} style={{ '--grid-size': size } as React.CSSProperties}>
        {variableSquare.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onSquareClick={() => onSquareClick(rowIndex, colIndex)}
            />
          )),
        )}
      </div>
      <hr />
      {/* tableを使う方法 */}
      <div>
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
      </div>
      <hr />
      {/* display:flexを使う方法 */}
      <div className={styles.boardFlex}>
        {variableSquare.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.rowFlex}>
            {row.map((cell, colIndex) => (
              <Square key={colIndex} value={cell} onSquareClick={() => onSquareClick(rowIndex, colIndex)} />
            ))}
          </div>
        ))}
      </div>
      {/* inline-blockを使う方法 */}
      <hr />
      <div className={styles.boardInline}>
        {variableSquare.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.rowInline}>
            {row.map((cell, colIndex) => (
              <SquareInline key={colIndex} value={cell} onSquareClick={() => onSquareClick(rowIndex, colIndex)} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
