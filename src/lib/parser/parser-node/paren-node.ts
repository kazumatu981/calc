import { ParserNode } from './parser-node';
import { Token } from '../../tokenizer';

/**
 * 括弧のノード
 */
export class ParenNode extends ParserNode {
    public childRoot: ParserNode;
    /**
     * @param tokens字句の配列
     * @param childRoot 中身のノード
     */
    constructor(tokens: Token[], childRoot: ParserNode) {
        super('paren', tokens);
        this.childRoot = childRoot;
    }

    /**
     * ノードの文字列表現を取得する
     * @returns ノードの文字列表現
     */
    public toString(): string {
        return `(${this.childRoot.toString()})`;
    }
}
