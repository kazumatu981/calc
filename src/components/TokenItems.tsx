import { type Token } from '../lib/token';
import { TokenItem } from './TokenItem';
import './Token.css';

export function TokenItems({ tokens }: { tokens: Token[] }) {
    return (
        <div className="tokenItems-container">
            {tokens.map((token) => (
                <TokenItem key={token.value} token={token} />
            ))}
        </div>
    );
}
