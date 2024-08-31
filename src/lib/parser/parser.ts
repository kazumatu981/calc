import { Token } from '../tokenizer/token';
import { ParserError } from '../common/errors';
import { ParserNode, SingleNode, ParenNode } from './parser-node';

type ParseMode = 'normal' | 'paren';

export interface ParserOptions {
    startIndex?: number;
    mode?: ParseMode;
}
export class Parser {
    private _startIndex: number;
    private _tokens: Token[];
    private _currentIndex: number;
    private _mode: ParseMode;

    public constructor(tokens: Token[], options?: ParserOptions) {
        this._tokens = tokens;
        this._mode = options?.mode ?? 'normal';
        this._startIndex = options?.startIndex ?? 0;
        this._currentIndex = this._startIndex;
    }

    public parse(): ParserNode {
        this._currentIndex = this._startIndex;
        let isFist = true;
        let rootNode: ParserNode | undefined = undefined;
        while (this._isNotEnd()) {
            const { operatorToken, node } = this._readNextOperatorAndNode(isFist);
            if (isFist) {
                isFist = false;
            }
            rootNode = ParserNode.connectTwoNodes(rootNode, node, operatorToken);
        }
        if (rootNode === undefined) {
            throw new ParserError('no-token');
        }
        if (this._mode === 'paren' && !this.currentToken.isRightParen) {
            throw new ParserError('paren-must-be-expected');
        }
        return rootNode;
    }

    public get currentToken(): Token {
        return this._safeReadTokenAt(this._currentIndex);
    }

    public get nextToken(): Token {
        return this._safeReadTokenAt(this._currentIndex + 1);
    }

    private _isNotEnd() {
        if (this._mode !== 'paren') {
            return this._currentIndex < this._tokens.length;
        } else {
            return this._currentIndex < this._tokens.length && !this.currentToken.isRightParen;
        }
    }
    private _readNextOperatorAndNode(isFirst: boolean = false): {
        operatorToken?: Token;
        node: ParserNode;
    } {
        let operatorToken: Token | undefined = undefined;
        let node: ParserNode;
        if (!isFirst) {
            operatorToken = this._readAsOperatorToken();
        }
        if (this.currentToken.isNumber || this.currentToken.isNegativeSign) {
            node = this._readAsSingleNode();
        } else if (this.currentToken.isLeftParen) {
            node = this._readAsParenNode();
        } else {
            throw new ParserError('unexpected-token');
        }

        return { operatorToken, node };
    }
    private _readAsOperatorToken(): Token | undefined {
        let operatorToken: Token | undefined = undefined;
        if (this.currentToken.type === 'operator') {
            operatorToken = this.currentToken;
            this._currentIndex++;
        } else {
            throw new ParserError('operator-must-be-expected');
        }
        return operatorToken;
    }
    private _readAsSingleNode(): SingleNode {
        let node: SingleNode;
        if (this.currentToken.isNumber) {
            node = new SingleNode(this.currentToken.value);
            this._currentIndex++;
        } else if (this.currentToken.isNegativeSign && this.nextToken.isNumber) {
            node = new SingleNode(this.nextToken.value, true);
            this._currentIndex += 2;
        } else {
            throw new ParserError('unexpected-token');
        }
        return node;
    }

    private _readAsParenNode(): ParenNode {
        const childParser = new Parser(this._tokens, {
            startIndex: this._currentIndex + 1,
            mode: 'paren',
        });
        const childRoot = childParser.parse();
        this._currentIndex = childParser._currentIndex + 1;
        return new ParenNode(childRoot);
    }
    private _safeReadTokenAt(index: number): Token {
        if (index < this._tokens.length) {
            return this._tokens[index];
        } else {
            console.error('index out of range');
            throw new ParserError('no-token');
        }
    }
}
