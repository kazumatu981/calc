import { FormEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PositionViewer } from './PositionViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

export interface ExpressionInputProps {
    validate?: (expression: string) => Promise<void>;
    execute?: (expression: string) => Promise<void>;
    showPositionView?: boolean;
}
export function ExpressionInput(prop: ExpressionInputProps): JSX.Element {
    const [expression, setExpression] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    const [validating, setValidating] = useState<boolean>(false);
    const [executing, setExecuting] = useState<boolean>(false);

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

    const onInputHandler: FormEventHandler<HTMLInputElement> = (e) => {
        const _expression: string = e.currentTarget.value;
        setExpression(_expression);
        if (prop && prop.validate) {
            setValidating(true);
            prop.validate(_expression)
                .catch((e) => {
                    setErrorString(e.message);
                })
                .finally(() => {
                    setValidating(false);
                });
        }
    };
    const onExecuteHandler: MouseEventHandler = () => {
        if (prop && prop.execute) {
            setExecuting(true);
            prop.execute(expression).finally(() => {
                setExecuting(false);
            });
        }
    };
    return (
        <div className="flex flex-column">
            <div className="flex flex-row">
                <div className=" flex-grow-1 m-2">
                    <div className="flex flex-column">
                        <InputText value={expression} onChange={onInputHandler} readOnly={validating || executing} />
                        <small className="p-error">{errorString}</small>
                    </div>
                </div>
                <div>
                    {prop.execute ? (
                        <Button
                            className="m-2"
                            label="実行"
                            icon={<FontAwesomeIcon icon={faCalculator} style={{ marginRight: '0.5rem' }} />}
                            onClick={onExecuteHandler}
                            disabled={errorString !== '' || validating || executing}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {prop.showPositionView ? <PositionViewer expression={expression} /> : <></>}
        </div>
    );
}
