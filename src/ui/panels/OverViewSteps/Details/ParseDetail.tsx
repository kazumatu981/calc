import { ProcessDetail } from './ProcessDetail';
import { ParserNode } from '../../../../lib/parser';

import { ParserNodesViewer } from '../../../components/ParserNodesViewer';

interface ParseDetailProps {
    parsedNode: ParserNode;
}

const description = (
    <>
        <h2>構文解析</h2>

        <ul>
            <li>構文解析は、文法に従って、数式の構造を解析するプロセスです。</li>
            <li>
                字句解析で得られた<strong>字句の関係性</strong>を解析します。
            </li>
            <li>
                ここでは、字句の<strong>演算子</strong>、<strong>数値</strong>、<strong>括弧</strong>
                が木構造になるように整理します。
            </li>
            <li>
                このツリー構造の<strong>末端のほうが演算の優先度が高くなる</strong>ように整理していきます。
            </li>
        </ul>
    </>
);

export function ParseDetail(prop: ParseDetailProps): JSX.Element {
    return <ProcessDetail figure={<ParserNodesViewer parsedNode={prop.parsedNode} />} description={description} />;
}
