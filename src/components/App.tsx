import React from 'react';
import './App.css';
import { TokenItems } from './TokenItems';
import { type Token, tokenize } from '../lib/tokenizer';
import { Parser, type Node } from '../lib/parser';
import { ParsedTree } from './ParsedTree';

function App() {
    const [expression, setExpression] = React.useState('');
    const [tokens, setTokens] = React.useState<Token[]>([]);
    const [parsedNode, setParsedNode] = React.useState<Node>();
    const [error, setError] = React.useState<string>('');
    function onExpressionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setError('');
        setExpression(e.target.value);
    }
    React.useEffect(() => {
        try {
            setError('');
            setTokens(tokenize(expression));
        } catch (e: any) {
            setError(e.message);
        }
    }, [expression]);
    React.useEffect(() => {
        try {
            setError('');
            const parser = new Parser(tokens);
            setParsedNode(parser.parse());
        } catch (e: any) {
            setError(e.message);
        }
    }, [tokens, expression]);
    return (
        <div className="App">
            <p>
                <input
                    id="expression"
                    type="text"
                    placeholder="数式を入れてください。"
                    value={expression}
                    onChange={onExpressionChange}
                />
            </p>
            <>{error}</>

            <h2>字句解析</h2>
            <p>
                <TokenItems tokens={tokens} />
            </p>
            <h2>構文解析</h2>
            <p>
                <ParsedTree node={parsedNode} />
            </p>
        </div>
    );
}

export default App;
