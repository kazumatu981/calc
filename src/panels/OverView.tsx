import { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { tokenizeAsync } from '../lib/tokenizer';
import { parseAsync } from '../lib/parser';
import { resolveAsync, ResolveEventHandler, OperateEventArg } from '../lib/resolver';
import { ResultPanel, ResultPanelProps } from '../panels/Result/ResultPanel';

async function calculate(expression: string): Promise<ResultPanelProps> {
    const process: string[] = [];
    const onProcess: ResolveEventHandler = (event, arg) => {
        if (event === 'operate') {
            const operateEventArg = arg as OperateEventArg;
            process.push(
                `${operateEventArg.operator}(${operateEventArg.left}, ${operateEventArg.right}) = ${operateEventArg.result}`,
            );
        }
    };
    const tokens = await tokenizeAsync(expression);
    const parsedNode = await parseAsync(tokens);
    const result = await resolveAsync(parsedNode, onProcess);
    return { expression, tokens, parsedNode, result, process };
}

export function OverView(): JSX.Element {
    const [expression, setExpression] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    const [result, setResult] = useState<ResultPanelProps | undefined>(undefined);

    useEffect(() => {
        setErrorString('');
        setResult(undefined);
        parseAsync(expression).catch((e) => {
            setErrorString(e.message);
        });
    }, [expression]);

    const onExecute = () => {
        setResult(undefined);

        calculate(expression)
            .then((result) => {
                setResult(result);
            })
            .catch((e) => {
                setErrorString(e.message);
            });
    };

    return (
        <div>
            <h2>処理概要</h2>
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
                {result !== undefined ? (
                    <ResultPanel
                        expression={result.expression}
                        tokens={result.tokens}
                        parsedNode={result.parsedNode}
                        result={result.result}
                        process={result.process}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
