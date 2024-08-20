import { ParserError } from './errors';
import { Token } from './token';

export type NodeType = 'single' | 'binary' | 'paren';

export class ParserNode {
    nodeType: NodeType;
    constructor(nodeType: NodeType) {
        this.nodeType = nodeType;
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
    public static connectTwoNodes(
        node1: ParserNode | undefined,
        node2: ParserNode,
        operatorToken: Token | undefined,
    ): ParserNode {
        if (node1 === undefined) {
            return node2;
        }
        if (operatorToken === undefined) {
            throw new ParserError('operator-must-be-expected');
        }

        if (node1.nodeType !== 'binary') {
            return new BinaryNode(node1, node2, operatorToken.value);
        } else {
            const rootBinaryNode = node1 as BinaryNode;
            if (operatorToken.value === '+' || operatorToken.value === '-') {
                return new BinaryNode(node1, node2, operatorToken.value);
            } else {
                // 右側ノードに新しいノードを付け加える
                return rootBinaryNode.appendToRight(operatorToken.value, node2);
            }
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
