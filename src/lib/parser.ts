import { Token } from './token';
import { ParserError } from './errors';
import { ParserNode, SingleNode, BinaryNode, ParenNode } from './parser-node';

type ParseMode = 'normal' | 'paren';

export interface ParserOptions {
    startIndex?: number;
    mode?: ParseMode;
}
export class Parser {
    private _tokens: Token[];
    private _currentIndex: number;
    private _mode: ParseMode;

    public constructor(tokens: Token[], options?: ParserOptions) {
        this._tokens = tokens;
        this._mode = options?.mode ?? 'normal';
        this._currentIndex = options?.startIndex ?? 0;
    }

    public parse(): ParserNode {
        let isFist = true;
        let rootNode: ParserNode | undefined = undefined;
        while (this._isNotEnd()) {
            const { operatorToken, node } = this._readNextOperatorAndNode(isFist);
            if (isFist) {
                isFist = false;
            }
            rootNode = BinaryNode.connectTwoNodes(rootNode, node, operatorToken);
        }
        if (rootNode === undefined) {
            throw new ParserError('operator-must-be-expected');
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
            return this._currentIndex < this._tokens.length - 1;
        } else {
            return (
                this._currentIndex < this._tokens.length - 1 &&
                this._safeReadTokenAt(this._currentIndex).type !== 'rightParen'
            );
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
        if (
            this.currentToken.type === 'number' ||
            (this.currentToken.type === 'operator' && this.currentToken.value === '-')
        ) {
            node = this._readAsSingleNode();
        } else if (this.currentToken.type === 'leftParen') {
            const childParser = new Parser(this._tokens, {
                startIndex: this._currentIndex + 1,
                mode: 'paren',
            });
            const childRoot = childParser.parse();
            node = new ParenNode(childRoot);
            this._currentIndex = childParser._currentIndex + 1;
        } else {
            throw new ParserError('unknown-character');
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
        if (this.currentToken.type === 'number') {
            node = new SingleNode(this.currentToken.value);
            this._currentIndex++;
        } else if (
            this.currentToken.type === 'operator' &&
            this.currentToken.value === '-' &&
            this.nextToken.type === 'number'
        ) {
            node = new SingleNode(this.nextToken.value, true);
            this._currentIndex += 2;
        } else {
            throw new ParserError('unexpected-token');
        }
        return node;
    }
    private _safeReadTokenAt(index: number): Token {
        if (index < this._tokens.length) {
            return this._tokens[index];
        } else {
            throw new ParserError('unknown-character');
        }
    }
}
