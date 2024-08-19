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
}

export class ParenNode extends ParserNode {
    public childRoot: ParserNode;
    constructor(childRoot: ParserNode) {
        super('paren');
        this.childRoot = childRoot;
    }
}
