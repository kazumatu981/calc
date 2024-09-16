import { useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { parseAsync } from '../../lib/parser';
import { resolveAsync } from '../../lib/resolver';
import { ExpressionInput } from '../components/ExpressionInput';

export function Home(): JSX.Element {
    const [result, setResult] = useState<string>('');

    const onValidate = (expression: string) => {
        return new Promise<void>((_resolve, _reject) => {
            parseAsync(expression)
                .then(() => {
                    _resolve();
                })
                .catch((e) => {
                    _reject(e);
                });
        });
    };
    const onExecute = (_expression: string) => {
        return new Promise<void>((_resolve, _reject) => {
            resolveAsync(_expression)
                .then((result) => {
                    setResult(`${_expression} = ${result}`);
                    _resolve();
                })
                .catch((e) => {
                    setResult(e.message);
                });
        });
    };

    return (
        <div>
            <h2>数式解析プログラム</h2>
            <p>このプログラムは数式を解析して、実行することができます。</p>
            <Fieldset legend="数式のオキテ" toggleable={true}>
                <ul>
                    <li>数式内の空白文字は無視されます。</li>
                    <li>数式には整数の数値(0から9の数字の列)が利用できます。</li>
                    <li>数式には演算子として '+', '-', '*', '/' の4つが利用できます。</li>
                    <li>数式には括弧 '(', ')' が利用できます。</li>
                    <li>計算は、通常の四則演算の優先度が適用されます。</li>
                </ul>
            </Fieldset>

            <ExpressionInput validate={onValidate} execute={onExecute} />
            <div>
                <big>{result}</big>
            </div>
        </div>
    );
}
