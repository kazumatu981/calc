import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export interface ExpressionInputProps {
    validate?: (expression: string) => Promise<void>;
    execute?: (expression: string) => void;
}
export function ExpressionInput(prop: ExpressionInputProps): JSX.Element {
    const [expression, setExpression] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    const [validating, setValidating] = useState<boolean>(false);

    useEffect(() => {
        setErrorString('');
        if (prop && prop.validate) {
            setValidating(true);
            prop.validate(expression)
                .catch((e) => {
                    setErrorString(e.message);
                })
                .finally(() => {
                    setValidating(false);
                });
        }
    }, [expression, prop]);

    return (
        <div className="flex flex-row">
            <div className=" flex-grow-1 m-2">
                <div className="flex flex-column">
                    <InputText value={expression} onChange={(e) => setExpression(e.target.value)} />
                    <small className="p-error">{errorString}</small>
                </div>
            </div>
            <div>
                {prop.execute ? (
                    <Button
                        className="m-2"
                        label="実行"
                        onClick={() => prop.execute!(expression)}
                        disabled={errorString !== ''}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
