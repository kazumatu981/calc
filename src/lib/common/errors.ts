type ModuleName = 'tokenizer' | 'parser';
type ErrorCodes =
    | 'unknown-character'
    | 'operator-must-be-expected'
    | 'operator-must-not-be-last'
    | 'unexpected-token'
    | 'unknown-error';
const MessageDictionary: Record<ErrorCodes, string> = {
    // tokenizer errors
    'unknown-character': '不明なを検出しました',
    // parser errors
    'operator-must-be-expected': '演算子が期待されますが、演算子が見つかりません。',
    'operator-must-not-be-last': '演算子は最後に来てはいけません',
    'unexpected-token': '予期せぬトークンを検出しました',
    'unknown-error': '不明なエラー',
};

class CalcErrorBase extends Error {
    public constructor(moduleName: ModuleName, code: ErrorCodes, appendixMessage?: string) {
        const message: string = MessageDictionary[code] ?? MessageDictionary['unknown-error'];
        super(`[${moduleName}][${code}]: ${message}${appendixMessage ? `(${appendixMessage})` : ''}`);
    }
}

export class TokenizerError extends CalcErrorBase {
    public constructor(code: ErrorCodes, appendixMessage?: string) {
        super('tokenizer', code, appendixMessage);
    }
}

export class ParserError extends CalcErrorBase {
    public constructor(code: ErrorCodes, appendixMessage?: string) {
        super('parser', code, appendixMessage);
    }
}
