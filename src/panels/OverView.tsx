import { useState, useEffect } from 'react';

import { tokenizeAsync } from '../lib/tokenizer';
import { parseAsync } from '../lib/parser';
import { resolveAsync, ResolveEventHandler, OperateEventArg } from '../lib/resolver';
import { ResultPanel, ResultPanelProps } from '../panels/Result/ResultPanel';
import { ExpressionInput } from '../components/ExpressionInput';

async function calculate(expression: string): Promise<ResultPanelProps> {
    const process: string[] = [];
    const onProcess: ResolveEventHandler = (event, arg) => {
        if (event === 'operate') {
            const operateEventArg = arg as OperateEventArg;
            process.push(
                `${operateEventArg.left} ${operateEventArg.operator} ${operateEventArg.right} = ${operateEventArg.result}`,
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

    const onValidate = (_expression: string) => {
        return new Promise<void>((_resolve, _reject) => {
            parseAsync(_expression)
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
            calculate(_expression)
                .then((result) => {
                    setExpression(_expression);
                    setResult(result);
                })
                .catch((e) => {
                    setErrorString(e.message);
                })
                .finally(() => {
                    _resolve();
                });
        });
    };
    return (
        <div>
            <h2>処理概要</h2>
            <>
                <ExpressionInput validate={onValidate} execute={onExecute} showPositionIndex={true} />
            </>
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
