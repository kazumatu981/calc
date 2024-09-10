import { useState, useEffect } from 'react';

import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';

import { Token } from '../../lib/tokenizer';
import { ParserNode } from '../../lib/parser';

import { TokenizeDetail } from './TokenizeDetail';
import { ParseDetail } from './ParseDetail';
import { ExecuteDetail } from './ExecuteDetail';

export interface ResultPanelProps {
    expression: string;
    tokens: Token[];
    parsedNode: ParserNode;
    result: number | undefined;
    process: string[];
}

export function ResultPanel(args: ResultPanelProps): JSX.Element {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <Stepper activeStep={activeStep}>
            <StepperPanel header="字句解析">
                <div className="flex pt-4 justify-content-end">
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => setActiveStep(1)} />
                </div>
                <TokenizeDetail expression={args.expression} tokens={args.tokens} />
            </StepperPanel>
            <StepperPanel header="構文解析">
                <div className="flex pt-4 justify-content-between">
                    <Button
                        label="Back"
                        severity="secondary"
                        icon="pi pi-arrow-left"
                        onClick={() => setActiveStep(0)}
                    />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => setActiveStep(2)} />
                </div>
                <ParseDetail tokens={args.tokens} parsedNode={args.parsedNode} />
            </StepperPanel>
            <StepperPanel header="意味解析">
                <div className="flex pt-4 justify-content-start">
                    <Button
                        label="Back"
                        severity="secondary"
                        icon="pi pi-arrow-left"
                        onClick={() => setActiveStep(1)}
                    />
                </div>
                <ExecuteDetail parsedNode={args.parsedNode} steps={args.process} />
            </StepperPanel>
        </Stepper>
    );
}
