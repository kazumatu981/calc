import { ParserNode, BinaryNode, SingleNode, ParenNode, type NodeType } from '../parser';

type nodeToMermaidFunc = (node: ParserNode, seed: string[], nodeId: string) => string[];

export interface ParseTreeRendererOptions {}
export function drawTree(rootNode: ParserNode, options?: ParseTreeRendererOptions) {
    return new ParseTreeRenderer(options).render(rootNode);
}

class ParseTreeRenderer {
    private readonly options?: ParseTreeRendererOptions;
    private readonly nodeToMermaidMap: Record<NodeType, nodeToMermaidFunc>;
    constructor(options?: ParseTreeRendererOptions) {
        this.options = options;
        this.nodeToMermaidMap = {
            single: this.renderSingleNode.bind(this),
            binary: this.renderBinaryNode.bind(this),
            paren: this.renderParenNode.bind(this),
        };
    }

    public render(rootNode: ParserNode) {
        return [...this.renderHeader(), ...this.renderBody(rootNode)].join('\n');
    }
    private renderHeader() {
        return ['flowchart TD'];
    }
    private renderBody(rootNode: ParserNode, seed: string[] = [], nodeId: string = 'root'): string[] {
        const nodeToMermaidImpl = this.nodeToMermaidMap[rootNode.nodeType];
        if (nodeToMermaidImpl === undefined) {
            throw new Error('not implemented');
        }
        return nodeToMermaidImpl(rootNode, seed, nodeId);
    }

    private renderSingleNode(node: ParserNode, seed: string[], nodeId: string): string[] {
        const singleNode = node as SingleNode;

        // 自身のノードを追加する
        seed.push(`${nodeId}("${singleNode.value}")`);

        return seed;
    }

    private renderBinaryNode(node: ParserNode, seed: string[], nodeId: string): string[] {
        const binaryNode = node as BinaryNode;

        // 自身のノードを追加する
        seed.push(`${nodeId}(("${binaryNode.operator}"))`);

        // 子ノードを追加する
        seed = this.renderBody(binaryNode.left, seed, `${nodeId}L`);
        seed = this.renderBody(binaryNode.right, seed, `${nodeId}R`);

        // ノードの関係性を表す線を追加する
        seed.push(`${nodeId} --> ${nodeId}L`);
        seed.push(`${nodeId} --> ${nodeId}R`);

        return seed;
    }

    private renderParenNode(node: ParserNode, seed: string[], nodeId: string): string[] {
        const parenNode = node as ParenNode;

        // 自身のノードを追加する
        seed.push(`${nodeId}{{Paren}}`);

        // 子ノードを追加する
        seed = this.renderBody(parenNode.childRoot, seed, `${nodeId}P`);

        // ノードの関係性を表す線を追加する
        seed.push(`${nodeId} -.-> ${nodeId}P`);

        return seed;
    }
}
