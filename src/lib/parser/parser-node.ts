import { ParserError } from '../common/errors';
import { Token } from '../tokenizer/token';

export type NodeType = 'single' | 'binary' | 'paren';

export abstract class ParserNode {
    nodeType: NodeType;
    constructor(nodeType: NodeType) {
        this.nodeType = nodeType;
    }
    public connectToTail(operatorToken: Token, nodeTobeConnected: ParserNode): BinaryNode {
        return new BinaryNode(this, nodeTobeConnected, operatorToken.value);
    }

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
}

export class SingleNode extends ParserNode {
    isNegative: boolean;
    value: string;
    constructor(value: string, isNegative: boolean | undefined = false) {
        super('single');
        this.value = value;
        this.isNegative = isNegative;
    }
}

export class BinaryNode extends ParserNode {
    public left: ParserNode;
    public right: ParserNode;
    operator: string;
    constructor(left: ParserNode, right: ParserNode, operator: string) {
        super('binary');
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    public appendToRight(operator: string, nodeTobeAppended: ParserNode): this {
        this.right = new BinaryNode(this.right, nodeTobeAppended, operator);
        return this;
    }

    public connectToTail(operatorToken: Token, nodeTobeConnected: ParserNode): BinaryNode {
        if (operatorToken.isSecondaryOperator) {
            return new BinaryNode(this, nodeTobeConnected, operatorToken.value);
        } else {
            // 掛け算や割り算の場合は右の子に接続する
            return this.appendToRight(operatorToken.value, nodeTobeConnected);
        }
    }
}

export class ParenNode extends ParserNode {
    public childRoot: ParserNode;
    constructor(childRoot: ParserNode) {
        super('paren');
        this.childRoot = childRoot;
    }
}
