import { useState } from 'react';

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

interface PagingButtonProps {
    onPrevious?: () => void;
    onNext?: () => void;
}
function PagingButton(props: PagingButtonProps): JSX.Element {
    let containerClassName;
    if (props.onNext && props.onPrevious) {
        containerClassName = 'flex pt-4 justify-content-between';
    } else if (props.onPrevious) {
        containerClassName = 'flex pt-4 justify-content-start';
    } else if (props.onNext) {
        containerClassName = 'flex pt-4 justify-content-end';
    }
    return (
        <div className={containerClassName}>
            {props.onPrevious && (
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={props.onPrevious} />
            )}
            {props.onNext && <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={props.onNext} />}
        </div>
    );
}

export function ResultPanel(args: ResultPanelProps): JSX.Element {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <Stepper activeStep={activeStep}>
            <StepperPanel header="字句解析">
                <div className="flex flex-column gap-3">
                    <PagingButton onNext={() => setActiveStep(1)} />
                    <TokenizeDetail tokens={args.tokens} />
                </div>
            </StepperPanel>
            <StepperPanel header="構文解析">
                <div className="flex flex-column gap-3">
                    <PagingButton onPrevious={() => setActiveStep(0)} onNext={() => setActiveStep(2)} />
                    <ParseDetail parsedNode={args.parsedNode} />
                </div>
            </StepperPanel>
            <StepperPanel header="意味解析">
                <div className="flex flex-column gap-3">
                    <PagingButton onPrevious={() => setActiveStep(1)} />
                    <ExecuteDetail steps={args.process} />
                </div>
            </StepperPanel>
        </Stepper>
    );
}
