import styles from './app.module.scss';
import React, {useState} from "react";

export default function App() {
    const min = 3;
    const max = 9;
    const [xIsNext, setXIsNext] = useState(true);
    const [gridSize, setGridSize] = useState(0);
    const [squares, setSquares] = useState(Array(gridSize * gridSize).fill(null));

    console.log('gridSize', gridSize);

    function handleClick(i: number) {
        console.log('click');
        // すでに値が入っているのであればreturn ＊これで上書きされない
        // すでに勝敗が決まっているのであれば、return ＊これ以上アイコンをおけない
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        // 配列をコピーする
        const nextSquares = [...squares];
        // 以下の書き方もOK！sliceは、どこからどこまでをコピーするか引数を指定できる。
        // 引数を指定していない場合は、全量をコピーする
        // const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        console.log('clicked', squares);
    }

    const player = calculateWinner(squares) ? `勝者: ${calculateWinner(squares)}` : `次の人: ${xIsNext ? 'X' : 'O'}`;

    function handleSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newSize = Number(event.target.value);
        setGridSize(newSize);
        setSquares(Array(newSize * newSize).fill(null));
        setXIsNext(true);
        console.log('size changed', squares);
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

            <hr/>
            <CreateBoard size={gridSize} variableSquare={squares} onSquareClick={handleClick}/>
        </>
    );

    // リセット
    function handleRestart() {
        setSquares(Array(gridSize * gridSize).fill(null));
        setXIsNext(true);
    }
}

type SquareProps = {
    value: string | null;
    onSquareClick: () => void;
};

function Square({value, onSquareClick}: SquareProps) {
    // const [value, setValue] = useState<string | null>(null);

    /*
    function handleClick() {
      console.log('clicked!');
      setValue('X');
    }
     */
    //console.log('value', value);
    return (
        <button className={styles.square} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function calculateWinner(squares: (string | null)[]): string | null {
    console.log('calculateWinner', squares);
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
    variableSquare: (string | null)[];
    onSquareClick: (index : number) => void;
};

function CreateBoard({size, variableSquare, onSquareClick}: CreateBoardProps) {
    console.log('CreateBoardSize', size);
    console.log('createBoard', variableSquare);
    return (
        <div
            className={styles.variableSquare}
            style={{'--grid-size': size}  as React.CSSProperties}
        >
            {Array.from({ length: size * size }).map((_, index) => (
                <Square
                    key={index}
                    value={variableSquare[index]}
                    onSquareClick={() => onSquareClick(index)}
                />
            ))}
        </div>
    )
}