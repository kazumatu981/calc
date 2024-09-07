import React from 'react';
import './App.css';
import { TokenizerPanel } from './TokenizerPanel';
import { tokenizeAsync, type Token } from '../lib/tokenizer';
import { parseAsync, type ParserNode } from '../lib/parser';
import { resolveAsync, type ResolveEventHandler, type OperateEventArg } from '../lib/resolver';

import { ParserPanel } from './ParserPanel';

function App() {
    const [expression, setExpression] = React.useState('');
    const [tokens, setTokens] = React.useState<Token[]>([]);
    const [parsedNode, setParsedNode] = React.useState<ParserNode | undefined>(undefined);
    const [result, setResult] = React.useState<number>(0);
    const [resolveProcess, setResolveProcess] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');

    function initialise() {
        setTokens([]);
        setParsedNode(undefined);
        setError('');
        setResolveProcess([]);
    }

    React.useEffect(() => {
        const process: string[] = [];
        // ステートを初期化する
        initialise();

        const resolverEventHandler: ResolveEventHandler = (event, arg) => {
            if (event === 'operate') {
                const operateArg = arg as OperateEventArg;
                const message = `${operateArg.left} ${operateArg.operator} ${operateArg.right} = ${operateArg.result}`;
                console.log(message);
                process.push(message);
            }
        };

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
                    return resolveAsync(parsedNode, resolverEventHandler);
                })
                .then((result) => {
                    // 解決のプロセスをセットする
                    setResolveProcess(process);
                    // 解決の結果をセットする
                    setResult(result);
                })
                .finally(() => {
                    // input expressionの読み取り専用を解除する
                    document.getElementById('expression')?.removeAttribute('readonly');
                })
                .catch((error) => {
                    // エラーの場合はエラーメッセージをセットする
                    setError(error.message);
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
            <div className="resultPanels">
                <div className="tokenizerPanel">
                    <h2>字句解析</h2>
                    <TokenizerPanel tokens={tokens} />
                </div>
                <div className="parserPanel">
                    <h2>構文解析</h2>
                    <ParserPanel node={parsedNode} />
                </div>
                <div className="messagePanel">{error}</div>
                <div className="resultProcess">
                    <h2>計算過程</h2>
                    <div>
                        <ol>
                            {resolveProcess.map((process, index) => (
                                <li key={index}>{process}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className="resultPanel">
                    <h2>計算結果</h2>
                    <div>{result}</div>
                </div>
            </div>
        </div>
    );
}

export default App;
