import { ProcessDetail } from './ProcessDetail';
import { Token } from '../../../../lib/tokenizer';

import { TokensViewer } from '../../../components/TokensViewer';

interface TokenizeDetailProps {
    tokens: Token[];
}

const description = (
    <>
        <h2>字句解析</h2>

        <ul>
            <li>字句解析は文字列を、字句(トークン)に分割するプロセスです。</li>
            <li>数式の意味のある構成要素に分解します。</li>
            <li>
                字句は、<strong>数値</strong>、<strong>演算子</strong>、<strong>括弧</strong>
                があります。
            </li>
            <li>与えられた文字列を一文字ずつ取り出し、字句の区切りを探しながら、文字列を順に切り出します。</li>
        </ul>
    </>
);

export function TokenizeDetail(prop: TokenizeDetailProps): JSX.Element {
    return <ProcessDetail figure={<TokensViewer tokens={prop.tokens} />} description={description} />;
}
