import { useState } from 'react';

import { tokenizeAsync } from '../../lib/tokenizer';
import { parseAsync } from '../../lib/parser';
import { resolveAsync, ResolveEventHandler, OperateEventArg } from '../../lib/resolver';
import { OverViewSteps, ResultPanelProps } from './OverViewSteps';
import { ExpressionInput } from '../components/ExpressionInput';

async function calculate(expression: string): Promise<ResultPanelProps> {
    const process: OperateEventArg[] = [];
    const onProcess: ResolveEventHandler = (event, arg) => {
        if (event === 'operate') {
            process.push(arg as OperateEventArg);
        }
    };
    const tokens = await tokenizeAsync(expression);
    const parsedNode = await parseAsync(tokens);
    const result = await resolveAsync(parsedNode, onProcess);
    return { expression, tokens, parsedNode, result, process };
}

export function OverViewPanel(): JSX.Element {
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
                <ExpressionInput validate={onValidate} execute={onExecute} showPositionView={true} />
            </>
            <div>
                {result !== undefined ? (
                    <OverViewSteps
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
            <div>
                <>{errorString}</>
            </div>
        </div>
    );
}
