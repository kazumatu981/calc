import { Token } from '../tokenizer/token';
import { ParserError } from '../common/errors';
import { ParserNode, SingleNode, ParenNode } from './parser-node';

/**
 * 解析モード
 */
type ParseMode = 'normal' | 'paren';

export interface ParserOptions {
    /**
     * 解析開始位置
     */
    startIndex?: number;
    /**
     * 解析モード
     */
    mode?: ParseMode;
}

/**
 * 構文解析エンジン
 */
export class Parser {
    private _startIndex: number;
    private _tokens: Token[];
    private _currentIndex: number;
    private _mode: ParseMode;

    /**
     * @param tokens 字句配列
     * @param options オプション
     * @param options.startIndex 解析開始位置
     * @param options.mode 解析モード
     */
    public constructor(tokens: Token[], options?: ParserOptions) {
        this._tokens = tokens;
        this._mode = options?.mode ?? 'normal';
        this._startIndex = options?.startIndex ?? 0;
        this._currentIndex = this._startIndex;
    }

    /**
     * 字句配列を構文木に変換する
     * @returns 構文木
     */
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
        if (this._mode === 'paren' && !this.endWithRightParen) {
            throw new ParserError('paren-must-be-expected');
        }
        return rootNode;
    }

    /**
     * 現在の位置にある字句を取得する
     * @returns 現在の位置にある字句
     */
    public get currentToken(): Token | undefined {
        return this._safeReadTokenAt(this._currentIndex);
    }

    /**
     * 次の位置にある字句を取得する
     * @returns 次の位置にある字句
     */
    public get nextToken(): Token | undefined {
        return this._safeReadTokenAt(this._currentIndex + 1);
    }

    /**
     * 現在の位置が末尾かどうかを判定する
     * @returns 末尾かどうかを表す真偽値
     */
    private _isNotEnd() {
        if (this._mode !== 'paren') {
            return this.currentToken !== undefined;
        } else {
            if (this.currentToken === undefined) {
                // 末尾に到達
                return false;
            }
            return this._currentIndex < this._tokens.length && !this.endWithRightParen;
        }
    }

    /**
     * 現在の位置が右括弧で終わってるかどうか
     * @returns 右括弧で終わってるかどうかを表す真偽値
     */
    private get endWithRightParen(): boolean {
        return this.currentToken?.isRightParen === true;
    }

    /**
     * 次の位置にある演算子と数式を取得する
     * @param isFirst 最初の呼び出しかどうか
     * @returns 次の位置にある演算子と数式
     */
    private _readNextOperatorAndNode(isFirst: boolean = false): {
        operatorToken?: Token;
        node: ParserNode;
    } {
        let operatorToken: Token | undefined = undefined;
        let node: ParserNode;
        if (!isFirst) {
            operatorToken = this._readAsOperatorToken();
        }

        if (this.currentToken === undefined) {
            throw new ParserError('operator-must-not-be-last');
        } else if (this.currentToken.isNumber || this.currentToken.isNegativeSign) {
            node = this._readAsSingleNode();
        } else if (this.currentToken.isLeftParen) {
            node = this._readAsParenNode();
        } else {
            throw new ParserError('unexpected-token');
        }

        return { operatorToken, node };
    }

    /**
     * 現在の位置にある字句が演算子である場合、取得する
     * @returns 取得した演算子字句
     * @throws {ParserError} 現在の位置にある字句が演算子でない場合
     */
    private _readAsOperatorToken(): Token | undefined {
        let operatorToken: Token | undefined = undefined;
        if (this.currentToken?.type === 'operator') {
            operatorToken = this.currentToken;
            this._currentIndex++;
        } else {
            throw new ParserError('operator-must-be-expected');
        }
        return operatorToken;
    }

    /**
     * 現在の位置にある字句が単一の数字かマイナス記号かどうかを判定し、
     * その値をSingleNodeに変換して返す
     * @returns 取得したSingleNode
     * @throws {ParserError} 現在の位置にある字句がマイナス記号か数字でない場合
     */
    private _readAsSingleNode(): SingleNode {
        let node: SingleNode;
        if (this.currentToken === undefined) {
            throw new ParserError('no-token');
        }
        if (this.currentToken.isNumber) {
            node = new SingleNode([this.currentToken]);
            this._currentIndex++;
        } else if (this.currentToken.isNegativeSign) {
            // 現在の一が負の符号だった場合
            if (this.nextToken === undefined) {
                // 末端まで行ってしまった
                throw new ParserError('no-token');
            }
            if (this.nextToken.isNumber) {
                // 次の一が数字である場合
                node = new SingleNode([this.currentToken, this.nextToken]);
            } else {
                throw new ParserError('unexpected-token');
            }
            this._currentIndex += 2;
        } else {
            throw new ParserError('unexpected-token');
        }
        return node;
    }

    /**
     * 現在の位置にある字句が左括弧である場合、パースする
     * @returns パースしたParenNode
     * @throws {ParserError} 現在の位置にある字句が左括弧でない場合
     */
    private _readAsParenNode(): ParenNode {
        const parenStartToken = this.currentToken as Token;
        const childParser = new Parser(this._tokens, {
            startIndex: this._currentIndex + 1,
            mode: 'paren',
        });
        const childRoot = childParser.parse();
        const parenEndToken = childParser.currentToken as Token;
        this._currentIndex = childParser._currentIndex + 1;

        return new ParenNode([parenStartToken, parenEndToken], childRoot);
    }

    /**
     * 安全に字句を取得する
     * @param index 取得する字句のインデックス
     * @returns 取得した字句 or undefined
     */
    private _safeReadTokenAt(index: number): Token | undefined {
        if (index < this._tokens.length) {
            return this._tokens[index];
        }
    }
}
