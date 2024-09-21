import { ParserError } from '../common/errors';
import { Token } from '../tokenizer/token';

export type NodeType = 'single' | 'binary' | 'paren';

/**
 * ノード
 */
export abstract class ParserNode {
    nodeType: NodeType;
    tokens: Token[];

    /**
     * @param nodeType ノードの型
     * @param tokens 使われた字句の配列
     */
    constructor(nodeType: NodeType, tokens: Token[]) {
        this.nodeType = nodeType;
        this.tokens = tokens;
    }

    /**
     * 右の項に nodeToBeConnected を operatorToken でつなげて、新しい BinaryNode を生成する
     * @param operatorToken 演算子
     * @param nodeToBeConnected つなげるノード
     * @returns 生成された新しい BinaryNode
     */
    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        return new BinaryNode(this, nodeToBeConnected, operatorToken);
    }

    /**
     * 2つのノードを operatorToken でつなげて、新しいノードを生成する
     * @param node1 つなげる左のノード
     * @param node2 つなげる右のノード
     * @param operatorToken つなげる演算子
     * @returns 生成された新しいノード
     * @throws {ParserError} operatorToken が undefined の場合
     */
    public static connectTwoNodes(
        node1: ParserNode | undefined,
        node2: ParserNode,
        operatorToken: Token | undefined,
    ): ParserNode {
        if (node1 === undefined) {
            return node2;
        } else {
            if (operatorToken === undefined) {
                throw new ParserError('operator-must-be-expected');
            }

            return node1.connectToTail(operatorToken, node2);
        }
    }
    abstract toString(): string;
}

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

/**
 * 括弧のノード
 */
export class ParenNode extends ParserNode {
    public childRoot: ParserNode;
    /**
     * @param childRoot 中身のノード
     * @param tokens字句の配列
     */
    constructor(childRoot: ParserNode, tokens: Token[]) {
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
