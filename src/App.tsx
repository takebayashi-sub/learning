import styles from './app.module.scss';
import React, {useState} from "react";

export default function App() {
    const min = 3;
    const max = 9;
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    //const [VariableSquares, setVariableSquares] = useState(Array(max-min+1).fill(null));
    const [gridSize, setGridSize] = useState(0);

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

    function handleSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newSize = Number(event.target.value);
        setGridSize(newSize);
    }

    return (
        <>
            <h1>まるばつゲーム</h1>
            <div>何マスでゲームする？
                <select className={styles.number}
                        value={gridSize}
                        onChange={handleSizeChange}
                >
                    <option value={0}>選択してね</option>
                    {[...Array(max - min + 1)].map((_, i) => (
                        <option key={i} value={i + min}>
                            {i + min} x {i + min}
                        </option>
                    ))}
                </select>
            </div>
            <hr/>
            <div className={styles.player}>{player}
                <button onClick={handleRestart}>Restart</button>
            </div>
            <div className={styles.boardRow}>
                {/* 忘れそうなのでメモ。
        onSquareClick={handleClick(0)}  -->これだと、クリックされた時ではなく今この瞬間に実行される
        onSquareClick={() => handleClick(0)}  -->これは、クリックしたタイミングで実行してねという関数を渡している*/}
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className={styles.boardRow}>
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className={styles.boardRow}>
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
            <hr/>
            <CreateBoard size={gridSize} onSquareClick={() => handleClick(1)}/>
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

function Square({value, onSquareClick}: SquareProps) {
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

type CreateBoardProps = {
    size: number;
    onSquareClick: () => void;
};

function CreateBoard({size, onSquareClick}: CreateBoardProps) {
    console.log('CreateBoard', size);
    const board = Array(size * size).fill(null);
    console.log('board', board);
    return (
        <div
            className={styles.variableSquare}
            style={{'--grid-size': size}  as React.CSSProperties}
        >
            {Array(size * size).fill(null).map((value, index) => (
                <button key={index} className={styles.square} onClick={onSquareClick}>
            {value}
        </button>
            ))}
        </div>
    )
}