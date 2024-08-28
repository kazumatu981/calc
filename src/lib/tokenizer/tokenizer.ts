import { TokenizerError } from '../common/errors';
import { Token, TokenType } from './token';
import { CharUtil } from './char-util';

export class Tokenizer {
    private expression: string;
    private currentIndex = 0;
    constructor(expression: string) {
        this.expression = expression;
    }

    /**
     * 入力文字列を字句に分割する
     * @returns 切り出した字句
     */
    public tokenize(): Token[] {
        this.currentIndex = 0;
        const tokens: Token[] = [];
        while (this.currentIndex < this.expression.length) {
            // 字句を切り出す
            const token = this._readNextToken();
            if (token === undefined) {
                // 切り出せなかった場合そのまま終了
                // (末尾がスペースだった場合)
                break;
            }
            // 切り出した結果を配列に追加
            tokens.push(token);
        }
        return tokens;
    }
    /**
     * inputのstartIndexから始まる字句を切り出す。
     * @param input 入力文字列
     * @param startIndex 開始位置
     * @returns 切り切り出した字句と次の開始位置
     */
    private _readNextToken(): Token | undefined {
        this._skipSpaces();

        if (this.currentIndex >= this.expression.length) {
            // 空白文字のまま末尾まで行ったらトークンは何もなかったとみなす。
            return undefined;
        } else if (CharUtil.isDigit(this.expression, this.currentIndex)) {
            // 数字を切り出す
            return this._readNumberToken();
        } else if (CharUtil.isOperator(this.expression, this.currentIndex)) {
            // 演算子を切り出す
            return this._readOperatorToken();
        } else if (CharUtil.isLeftParen(this.expression, this.currentIndex)) {
            // 左括弧
            return this._readParanToken('leftParen');
        } else if (CharUtil.isRightParen(this.expression, this.currentIndex)) {
            // 右括弧
            return this._readParanToken('rightParen');
        } else {
            // 予期せぬ文字を検出した
            throw new TokenizerError('unknown-character', this.currentIndex);
        }
    }

    private _skipSpaces(): void {
        while (
            this.currentIndex < this.expression.length &&
            CharUtil.isWhiteSpace(this.expression, this.currentIndex)
        ) {
            this.currentIndex++;
        }
    }

    private _readNumberToken(): Token {
        let value = '';
        const startIndex = this.currentIndex;
        while (this.currentIndex < this.expression.length && CharUtil.isDigit(this.expression, this.currentIndex)) {
            value += this.expression.charAt(this.currentIndex);
            this.currentIndex++;
        }
        return new Token('number', value, startIndex);
    }

    private _readOperatorToken(): Token {
        const startIndex = this.currentIndex;
        this.currentIndex++;
        return new Token('operator', this.expression.charAt(startIndex), startIndex);
    }

    private _readParanToken(startEnd: 'leftParen' | 'rightParen'): Token {
        const startIndex = this.currentIndex;
        this.currentIndex++;
        return new Token(startEnd as TokenType, this.expression.charAt(startIndex), startIndex);
    }
}
