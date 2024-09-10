import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

export interface ExpressionInputProps {
    expression: string;
    validate: (expression: string) => Promise<void>;
    execute: (expression: string) => Promise<void>;
}
export function ExpressionInput(): JSX.Element {
    const [expression, setExpression] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    useEffect(() => {
        setErrorString('');
    }, [expression]);
    return <InputText value={expression} onChange={(e) => setExpression(e.target.value)} />;
}
