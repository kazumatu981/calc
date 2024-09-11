import { ParserError } from '../common/errors';
import { Token } from '../tokenizer/token';

export type NodeType = 'single' | 'binary' | 'paren';

export abstract class ParserNode {
    nodeType: NodeType;
    tokens: Token[];
    constructor(nodeType: NodeType, tokens: Token[]) {
        this.nodeType = nodeType;
        this.tokens = tokens;
    }
    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        return new BinaryNode(this, nodeToBeConnected, operatorToken);
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
    constructor(value: string, isNegative: boolean, tokens: Token[]) {
        super('single', tokens);
        this.value = value;
        this.isNegative = isNegative;
    }
}

export class BinaryNode extends ParserNode {
    public left: ParserNode;
    public right: ParserNode;
    operator: string;
    constructor(left: ParserNode, right: ParserNode, operatorToken: Token) {
        super('binary', [operatorToken]);
        this.left = left;
        this.right = right;
        this.operator = operatorToken.value;
    }

    public appendToRight(operatorToken: Token, nodeToBeAppended: ParserNode): this {
        this.right = new BinaryNode(this.right, nodeToBeAppended, operatorToken);
        return this;
    }

    public connectToTail(operatorToken: Token, nodeToBeConnected: ParserNode): BinaryNode {
        if (operatorToken.isSecondaryOperator) {
            return new BinaryNode(this, nodeToBeConnected, operatorToken);
        } else {
            // 掛け算や割り算の場合は右の子に接続する
            return this.appendToRight(operatorToken, nodeToBeConnected);
        }
    }
}

export class ParenNode extends ParserNode {
    public childRoot: ParserNode;
    constructor(childRoot: ParserNode, tokens: Token[]) {
        super('paren', tokens);
        this.childRoot = childRoot;
    }
}
