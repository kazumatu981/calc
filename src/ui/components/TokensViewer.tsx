import { Token } from '../../lib/tokenizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

function TokenItem({ token }: { token: Token }) {
    const classNames = [
        'flex',
        'flex-column',
        'gap-1',
        'border-1',
        'p-2',
        'border-round-md',
        'align-items-center',
        'justify-content-center',
        'shadow-7',
    ];
    if (token.isOperator) {
        classNames.push('bg-teal-100');
    }
    if (token.isParen) {
        classNames.push('bg-orange-100');
    }
    return (
        <div className={classNames.join(' ')}>
            <div>
                <big>{token.value}</big>
            </div>
            <div>
                <small>{token.type}</small>
            </div>
            <div>
                <small>
                    <FontAwesomeIcon icon={faLocationDot} size="xs" />
                    {token.position}
                </small>
            </div>
        </div>
    );
}

export function TokensViewer({ tokens }: { tokens: Token[] }) {
    return tokens.length === 0 ? (
        <></>
    ) : (
        <div className="flex flex-row gap-3 overflow-auto">
            {tokens.map((token) => (
                <TokenItem key={token.id} token={token} />
            ))}
        </div>
    );
}
