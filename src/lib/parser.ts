import { type Token } from './token';
import { ParserError } from './errors';
import { ParserNode, SingleNode, BinaryNode, ParenNode } from './parser-node';

type ParseMode = 'normal' | 'paren';

export class Parser {
    private _tokens: Token[];
    private _currentIndex: number;
    private _mode: ParseMode;

    public constructor(tokens: Token[], currentIndex: number = 0, mode: ParseMode = 'normal') {
        this._tokens = tokens;
        this._mode = mode;
        this._currentIndex = currentIndex;
    }

    public parse(): ParserNode {
        let isFist = true;
        let rootNode: ParserNode | undefined = undefined;
        while (this._isNotEnd()) {
            const { operatorToken, node } = this._readNextNode(isFist);
            if (isFist) {
                isFist = false;
            }
            rootNode = this._connectTwoNodes(rootNode, node, operatorToken);
        }
        if (rootNode === undefined) {
            throw new ParserError('operator-must-be-expected');
        }
        return rootNode;
    }

    public get currentToken(): Token {
        return this._safeReadToken(this._currentIndex);
    }

    public get nextToken(): Token {
        return this._safeReadToken(this._currentIndex + 1);
    }

    private _isNotEnd() {
        if (this._mode !== 'paren') {
            return this._currentIndex < this._tokens.length - 1;
        } else {
            return (
                this._currentIndex < this._tokens.length - 1 &&
                this._safeReadToken(this._currentIndex).type !== 'rightParen'
            );
        }
    }

    private _connectTwoNodes(node1: ParserNode | undefined, node2: ParserNode, operatorToken: Token | undefined) {
        if (node1 === undefined) {
            return node2;
        }
        if (operatorToken === undefined) {
            throw new ParserError('operator-must-be-expected');
        }

        if (operatorToken.value === '+' || operatorToken.value === '-') {
            return new BinaryNode(node1, node2, operatorToken.value);
        }
        if (node1.nodeType !== 'binary') {
            return new BinaryNode(node1, node2, operatorToken.value);
        }

        const rootBinaryNode = node1 as BinaryNode;
        const rightNode = rootBinaryNode.right;
        const newNode = new BinaryNode(rightNode, node2, operatorToken.value);
        rootBinaryNode.right = newNode;
        return rootBinaryNode;
    }

    private _readNextNode(isFirst: boolean = false): {
        operatorToken?: Token;
        node: ParserNode;
    } {
        let operatorToken: Token | undefined = undefined;
        let node: ParserNode;
        if (!isFirst) {
            if (this.currentToken.type === 'operator') {
                operatorToken = this.currentToken;
            } else {
                // 演算子がない場合
                throw new ParserError('unknown-character');
            }
            this._currentIndex++;
        }
        if (this.currentToken.type === 'number') {
            node = new SingleNode(this.currentToken.value);
            this._currentIndex++;
        } else if (this.currentToken.type === 'operator' && this.currentToken.value === '-') {
            node = new SingleNode(this.currentToken.value, true);
            this._currentIndex += 2;
        } else if (this.currentToken.type === 'leftParen') {
            const childParser = new Parser(this._tokens, this._currentIndex + 1, 'paren');
            const childRoot = childParser.parse();
            node = new ParenNode(childRoot);
            this._currentIndex = childParser._currentIndex + 1;
        } else {
            throw new ParserError('unknown-character');
        }

        return { operatorToken, node };
    }
    private _safeReadToken(index: number): Token {
        if (index < this._tokens.length) {
            return this._tokens[index];
        } else {
            throw new ParserError('unknown-character');
        }
    }
}
