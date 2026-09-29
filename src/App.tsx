import styles from'./app.module.scss';
import {useState} from "react";

type NumberProps = {
  min: number;
  max: number;
};

function App() {
  return (
    <Myapp2 />
  )
}

function Myapp2() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  console.log('1');

  function handleClick(i: number) {
    // すでに値が入っているのであればreturn ＊これで上書きされない
    // すでに勝敗が決まっているのであれば、return ＊これ以上アイコンをおけない
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // 配列をコピーする
    console.log('2');
    const nextSquares = [...squares];
    // 以下の書き方もOK！sliceは、どこからどこまでをコピーするか引数を指定できる。
    // 引数を指定していない場合は、全量をコピーする
    // const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    console.log('3');
    console.log('4');
  }
  console.log('6');

  const player = calculateWinner(squares) ? `勝者: ${calculateWinner(squares)}` : `次の人: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <h1>まるばつゲーム</h1>
      <div>何マスでゲームする？<NumberSelect min={3} max={9} /></div>
      <hr />
      <div className={styles.player}>{player}</div>
      <div className={styles.boardRow}>
        {/* 忘れそうなのでメモ。
        onSquareClick={handleClick(0)}  -->これだと、クリックされた時ではなく今この瞬間に実行される
        onSquareClick={() => handleClick(0)}  -->これは、クリックしたタイミングで実行してねという関数を渡している*/}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className={styles.boardRow}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className={styles.boardRow}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </>
  );

  // リセット
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }
}

type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  // const [value, setValue] = useState<string | null>(null);
  console.log('5');
  /*
  function handleClick() {
    console.log('clicked!');
    setValue('X');
  }
   */

  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;

function NumberSelect({min, max}: NumberProps) {
  const [value, setValue] = useState<number>(min);
  return (
      <select className={styles.number}
      value={value}
      onChange={(e) =>
        setValue(Number(e.currentTarget.value))
      }
      >
        {[...Array(max - min + 1)].map((_, i) => (
          <option key={i} value={i + min}>
            {i + min}
          </option>
        ))}
      </select>
  );
}