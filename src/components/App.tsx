import React from 'react';
import './App.css';
import { TokenizePanel } from './TokenizePanel';
import { tokenizeAsync, Token } from '../lib/tokenizer';
import { parseAsync } from '../lib/parser';
import { ParserNode } from '../lib/parser/parser-node';
import { ParserPanel } from './ParserPanel';

function App() {
    const [expression, setExpression] = React.useState('');
    const [tokens, setTokens] = React.useState<Token[]>([]);
    const [parsedNode, setParsedNode] = React.useState<ParserNode | undefined>(undefined);
    const [error, setError] = React.useState<string>('');

    function initialise() {
        setTokens([]);
        setParsedNode(undefined);
        setError('');
    }
    React.useEffect(() => {
        // ステートを初期化する
        initialise();

        // input expressionの読み取り専用にする
        document.getElementById('expression')?.setAttribute('readonly', 'readonly');
        if (expression === '') {
            // input expressionの読み取り専用を解除する
            document.getElementById('expression')?.removeAttribute('readonly');
        } else {
            tokenizeAsync(expression)
                .then((tokens) => {
                    // 字句解析の結果をセットする
                    setTokens(tokens);
                    return parseAsync(tokens);
                })
                .then((parsedNode) => {
                    // 構文解析の結果をセットする
                    setParsedNode(parsedNode);
                    // input expressionの読み取り専用を解除する
                    document.getElementById('expression')?.removeAttribute('readonly');
                })
                .catch((error) => {
                    // エラーの場合はエラーメッセージをセットする
                    setError(error.message);
                    // input expressionの読み取り専用を解除する
                    document.getElementById('expression')?.removeAttribute('readonly');
                });
        }
    }, [expression]);
    return (
        <div className="App">
            <p>
                <input
                    id="expression"
                    type="text"
                    placeholder="数式を入れてください。"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                />
            </p>
            <>{error}</>

            <h2>字句解析</h2>
            {tokens.length === 0 ? <></> : <TokenizePanel tokens={tokens} />}
            <h2>構文解析</h2>
            <ParserPanel node={parsedNode} />
        </div>
    );
}

export default App;
