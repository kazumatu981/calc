import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { parseAsync } from '../lib/parser';
import { resolveAsync } from '../lib/resolver';

export function Home(): JSX.Element {
    const [expression, setExpression] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    const [result, setResult] = useState<string>('');
    useEffect(() => {
        setErrorString('');
        setResult('');
        parseAsync(expression).catch((e) => {
            setErrorString(e.message);
        });
    }, [expression]);

    const onExecute = () => {
        resolveAsync(expression)
            .then((result) => {
                setResult(`${expression} = ${result}`);
            })
            .catch((e) => {
                setErrorString(e.message);
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
            <div className="flex flex-column gap-2">
                <InputText
                    id="expression"
                    aria-describedby="expression-help"
                    className="p-inputtext-lg"
                    placeholder="数式を入力してください"
                    onChange={(e) => setExpression(e.target.value)}
                    value={expression}
                />
                <small id="expression-help" className="p-error">
                    {errorString}
                </small>
            </div>
            <div>
                {errorString === '' ? (
                    <Button id="execute" label="計算の実行" icon="pi pi-calculator" onClick={onExecute} />
                ) : (
                    <></>
                )}
            </div>
            <div>
                {result !== '' ? (
                    <InputText type="text" className="p-inputtext-lg" placeholder="計算結果" readOnly value={result} />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
