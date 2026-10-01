import styles from './app.module.scss';
import React, {useState} from "react";

type CellValue = 'X' | 'O' | null;

export default function App() {
    const min = 3;
    const max = 9;
    const [xIsNext, setXIsNext] = useState(true);
    const [gridSize, setGridSize] = useState(0);
    // サイズ変換するときに配列を作りなおすので、ここでは配列は空でよい（コストになる）
    const [squares, setSquares] = useState<CellValue[]>(Array(gridSize * gridSize).fill(null));

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


    // これもアロー関数に変えて
    function handleSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // ここに確認ダイアログをいれてもよし　OKならすすむ
        const newSize = Number(event.target.value);
        setGridSize(newSize);
        setSquares(Array(newSize * newSize).fill(null));
        setXIsNext(true);
        console.log('size changed', squares);
    }


    //　関数内でfunctionはやめて、アロー関数で書いた方がよい。それと、使う関数は使う箇所よりも前に定義しておく。

    // リセット
    const handleRestart = () => {
        setSquares(Array(gridSize * gridSize).fill(null));
        setXIsNext(true);
    }

    // gridSizeが存在する１以上のときは、選択するを表示しない処理があるとよい！

    return (
        <>
            <h1>まるばつゲーム</h1>
            <div>何マスでゲームする？
                <select className={styles.number}
                        value={gridSize}
                        onChange={handleSizeChange}
                >
                    <option value={0}>選択してね</option>
                    {/* i、min、maxは何の変数かわからないので、誰がみてもわかる変数名をつける */}
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

}

type SquareProps = {
    value: CellValue;
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

function calculateWinner(squares: CellValue[]): CellValue {
    console.log('calculateWinner', squares);



    // 可変の勝者判定 いったん３を指定してやってみる
    const gridSize =3;
    const lines2:CellValue[][] = [];
    // 横ループ
    for (let i=0; i <= (gridSize * gridSize - gridSize); i += gridSize){
        const line:CellValue[] = [];
        console.log('calculateWinner', gridSize);
        for (let j=0; j < gridSize; j++){
            line.push(squares[i + j]);
            console.log('line', line);
        }
        lines2.push(line);
        console.log('Array lines', lines2);
    }

    // 縦ループ
    for (let i=0; i < gridSize; i++){
        const line:CellValue[] = [];
        for (let j=0; j <= (gridSize * gridSize - gridSize); j += gridSize){
            line.push(squares[j + i]);
            console.log('line', line);
        }
        lines2.push(line);
        console.log('Array lines', lines2);
    }

    // ななめ　左上->右下
    const line3:CellValue[] = [];

    for (let i=0; i <(gridSize * gridSize); i += gridSize+1){
        line3.push(squares[i]);
    }
    lines2.push(line3);
    console.log('Array lines', lines2);

    // letも書き換えることができてしまうので、なるべくつかわない
    // forのかわりにmapやfilterをつかうことでletを定義しなくてよいので、より安全

    // JavaScriptは、forループはなるべく使わないほうがいい
    // 必要なものだけを取り出す方法があるから、調べてみること
    // ここのi、jもrowとか、わかりやすい変数名を
    // const line3 = [];　もanyになっているので、明示的に型を示して。　X|O|null というように、起こりうる値のみを許容する

    // 10x10の中でも、連続で５揃ったら勝ちとか、盤面と勝利条件を別にする　とか
    // 盤面をスクエアだけじゃなくて縦横指定でマスを可変にする　とか
    // calculateWinnerをもっと効率よくスマートに




    return null;
}

// 最低限の不具合を防ぐために、Typeはしっかりと明示する。string|nullだけではなくて、
// ここではX|O|nullのみを許容するので、そのように定義することで不具合を防ぐことができる
type CreateBoardProps = {
    size: number;
    variableSquare: CellValue[];
    onSquareClick: (index : number) => void;
};


// CreateBoardはCreateが動詞なので、他の名詞がよい　Reactコンポーネントなので、処理の意味が伝わらない、差異がある
// Boardとか、GameBoardとかが適切
function CreateBoard({size, variableSquare, onSquareClick}: CreateBoardProps) {
    console.log('CreateBoardSize', size);
    console.log('createBoard', variableSquare);

    // Array.from({ length: size * size }).map　ここの書き方は他のArrayと

    // variableSquareを渡してるから、そもそもそれの値を使えばよしで、新しくArrayを作る必要なし
    return (
        <div
            className={styles.variableSquare}
            style={{'--grid-size': size}  as React.CSSProperties}
        >
            {variableSquare.map((cell, index) => (
                <Square
                    key={index}
                    value={cell}
                    onSquareClick={() => onSquareClick(index)}
                />
            ))}
        </div>
    )
}