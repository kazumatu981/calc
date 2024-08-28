type ModuleName = 'tokenizer' | 'parser';
type ErrorCodes =
    | 'unknown-character'
    | 'no-token'
    | 'paren-must-be-expected'
    | 'operator-must-be-expected'
    | 'operator-must-not-be-last'
    | 'unexpected-token'
    | 'unknown-error';
const MessageDictionary: Record<ErrorCodes, string> = {
    // tokenizer errors
    'unknown-character': '不明な文字を検出しました',
    // parser errors
    'no-token': 'トークンがありません',
    'paren-must-be-expected': '括弧が期待されますが、括弧が見つかりません',
    'operator-must-be-expected': '演算子が期待されますが、演算子が見つかりません。',
    'operator-must-not-be-last': '演算子は最後に来てはいけません',
    'unexpected-token': '予期せぬトークンを検出しました',
    'unknown-error': '不明なエラー',
};

class CalcErrorBase extends Error {
    public readonly moduleName: ModuleName;
    public readonly code: ErrorCodes;
    public readonly appendixMessage?: string;
    public constructor(moduleName: ModuleName, code: ErrorCodes, appendixMessage?: string) {
        const message: string = MessageDictionary[code] ?? MessageDictionary['unknown-error'];
        super(message);
        this.moduleName = moduleName;
        this.code = code;
        this.appendixMessage = appendixMessage;
    }
}

export class TokenizerError extends CalcErrorBase {
    public readonly position: number;
    public constructor(code: ErrorCodes, position: number, appendixMessage?: string) {
        super('tokenizer', code, appendixMessage);
        this.position = position;
    }
}

export class ParserError extends CalcErrorBase {
    public constructor(code: ErrorCodes, appendixMessage?: string) {
        super('parser', code, appendixMessage);
    }
}
