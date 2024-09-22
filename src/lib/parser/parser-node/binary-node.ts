import { ParserNode } from './parser-node';
import { Token } from '../../tokenizer';

/**
 * 二項演算子のノード
 */
export class BinaryNode extends ParserNode {
    public left: ParserNode;
    public right: ParserNode;
    operator: string;

    /**
     * @param left 左の項
     * @param right 右の項
     * @param operatorToken 演算子
     */
    constructor(left: ParserNode, right: ParserNode, operatorToken: Token) {
        super('binary', [operatorToken]);
        this.left = left;
        this.right = right;
        this.operator = operatorToken.value;
    }

    /**
     * 右の項に nodeToBeAppended を operatorToken でつなげて、新しいノードを生成する
     * @param operatorToken 演算子
     * @param nodeToBeAppended つなげるノード
     * @returns 生成された新しい BinaryNode
     */
    public appendToRight(operatorToken: Token, nodeToBeAppended: ParserNode): this {
        this.right = new BinaryNode(this.right, nodeToBeAppended, operatorToken);
        return this;
    }

    /**
     * 右の項に nodeToBeConnected を operatorToken でつなげて、新しいノードを生成する
     * @param operatorToken 演算子
     * @param nodeToBeConnected つなげるノード
     * @returns 生成された新しい BinaryNode
     * @description
     *  operatorToken が二項演算子の場合は this と nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     *  しかし、 operatorToken が掛け算や割り算の場合は this の右の子に nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     */
    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        if (operatorToken.isSecondaryOperator) {
            return new BinaryNode(this, nodeToBeConnected, operatorToken);
        } else {
            // 掛け算や割り算の場合は右の子に接続する
            return this.appendToRight(operatorToken, nodeToBeConnected);
        }
    }

    /**
     * ノードの文字列表現を取得する
     * @returns ノードの文字列表現
     * @description
     *  左の項、演算子、右の項を連結した文字列を取得する
     */
    public toString(): string {
        return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
    }
}
