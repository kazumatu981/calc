import { type Token } from '../lib/tokenizer';
import './Token.css';

export function TokenItem({ token }: { token: Token }) {
    const classNames = ['tokenItem-container'];
    if (token.type === 'operator') {
        classNames.push('operator-container');
    }
    if (token.type === 'leftParen' || token.type === 'rightParen') {
        classNames.push('paren-container');
    }
    return (
        <div className={classNames.join(' ')}>
            <div>{token.value}</div>
            <div className="tokenItem-type">{token.type}</div>
        </div>
    );
}
