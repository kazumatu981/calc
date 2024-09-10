import { ProcessDetail } from './ProcessDetail';
import { ParserNode } from '../../lib/parser';
import { ParserPanel } from '../../components/ParserPanel';

interface ExecuteDetailProps {
    steps: string[];
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
    const executeSteps = prop.steps.map((step, index) => <li key={index}>{step}</li>);
    return <ProcessDetail figure={<ol>{executeSteps}</ol>} description={description} />;
}
