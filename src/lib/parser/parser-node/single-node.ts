import { ParserNode } from './parser-node';
import { Token } from '../../tokenizer';

/**
 * 単項ノード
 */
export class SingleNode extends ParserNode {
    public get isNegative(): boolean {
        return this.tokens[0].isNegativeSign;
    }
    public get value(): string {
        return this.tokens.length === 1 ? this.tokens[0].value : this.tokens[1].value;
    }

    /**
     * @param value 単項の値
     * @param isNegative 単項が負の符号であるかどうか
     * @param tokens このノードに属するトークン
     */
    constructor(tokens: Token[]) {
        super('single', tokens);
    }

    /**
     * 単項の文字列表現を取得する
     * @returns 単項の文字列表現
     * @description
     *  単項の値を文字列に変換して返す
     *  負の符号である場合、`-` を付与する
     */
    public toString(): string {
        if (this.isNegative) {
            return `-${this.value}`;
        } else {
            return this.value;
        }
    }
}
