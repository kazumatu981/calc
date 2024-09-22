import { ParserNode } from './parser-node';
import { Token } from '../../tokenizer';

/**
 * 単項ノード
 */
export class SingleNode extends ParserNode {
    isNegative: boolean;
    value: string;

    /**
     * @param value 単項の値
     * @param isNegative 単項が負の符号であるかどうか
     * @param tokens このノードに属するトークン
     */
    constructor(value: string, isNegative: boolean, tokens: Token[]) {
        super('single', tokens);
        this.value = value;
        this.isNegative = isNegative;
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
