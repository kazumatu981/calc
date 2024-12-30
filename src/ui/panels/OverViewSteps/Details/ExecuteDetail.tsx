import { JSX } from 'react';
import { ResolveEventArg } from '../../../../lib/resolver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface ProcessDetailProps {
    figure: JSX.Element;
    description: JSX.Element;
}

export function ProcessDetail(args: ProcessDetailProps): JSX.Element {
    return (
        <div className="flex flex-column gap-2">
            <div className="flex-auto flex justify-content-center align-items-center">{args.figure}</div>
            <div>{args.description}</div>
        </div>
    );
}

interface ExecuteDetailProps {
    steps: ResolveEventArg[];
}

function ExecuteSteps(prop: ExecuteDetailProps): JSX.Element {
    return (
        <div className="flex flex-column">
            {prop.steps.map((step, index) => (
                <div className="flex flex-row gap-2">
                    <div className="flex align-items-center justify-content-center w-2rem h-2rem bg-primary font-bold border-circle m-2">
                        {index}
                    </div>
                    <div className="flex align-items-center justify-content-center h-2rem w-3rem p-2 m-2 border-round border-1 bg-gray-300">
                        <FontAwesomeIcon icon={faLocationDot} size="xs" />
                        <>{step.node.tokens[0].position}</>
                    </div>
                    <div className="flex align-items-center justify-content-center h-2rem p-2 m-2">
                        {step.left} {step.operator} {step.right} = {step.result}
                    </div>
                </div>
            ))}
        </div>
    );
}
const description = (
    <>
        <h2>意味解析</h2>

        <ul>
            <li>計算式を解析する最後のステップです。</li>
            <li>構文に従って、計算式の意味を解析しながら実行します。</li>
            <li>例えば、演算子'+'は加算を意味し、演算子'-'は減算を意味するといった具合です。</li>
            <li>演算子や括弧の優先度を考慮するため、ツリー構造の末端から順に解決していきます。</li>
        </ul>
    </>
);

export function ExecuteDetail(prop: ExecuteDetailProps): JSX.Element {
    return <ProcessDetail figure={<ExecuteSteps steps={prop.steps} />} description={description} />;
}
