import { Token } from '../lib/tokenizer';
import './Token.css';

function TokenItem({ token }: { token: Token }) {
    const classNames = ['tokenItem-container'];
    if (token.isOperator) {
        classNames.push('operator-container');
    }
    if (token.isParen) {
        classNames.push('paren-container');
    }
    return (
        <div className={classNames.join(' ')}>
            <div>{token.value}</div>
            <div className="tokenItem-type">{token.type}</div>
        </div>
    );
}

export function TokenizerPanel({ tokens }: { tokens: Token[] }) {
    return tokens.length === 0 ? (
        <></>
    ) : (
        <div className="tokenItems-container">
            {tokens.map((token) => (
                <TokenItem key={token.id} token={token} />
            ))}
        </div>
    );
}
