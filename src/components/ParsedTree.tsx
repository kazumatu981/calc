import { Mermaid } from './Mermaid';
import { type ParserNode, SingleNode, BinaryNode, ParenNode } from '../lib/parser/parser-node';
function generateSrcOfNode(node: ParserNode, seed: string[], nodeId: string): string[] {
    if (node.nodeType === 'single') {
        const singleNode = node as SingleNode;
        seed.push(`${nodeId}(${singleNode.value})`);
    } else if (node.nodeType === 'binary') {
        const binaryNode = node as BinaryNode;
        seed.push(`${nodeId}((${binaryNode.operator}))`);
        seed = generateSrcOfNode(binaryNode.left, seed, `${nodeId}L`);
        seed = generateSrcOfNode(binaryNode.right, seed, `${nodeId}R`);
        seed.push(`${nodeId} --> ${nodeId}L`);
        seed.push(`${nodeId} --> ${nodeId}R`);
    } else if (node.nodeType === 'paren') {
        const parenNode = node as ParenNode;
        seed.push(`${nodeId}{{Paren}}`);
        seed = generateSrcOfNode(parenNode.childRoot, seed, `${nodeId}P`);
        seed.push(`${nodeId} --> ${nodeId}P`);
    }

    return seed;
}
function generateSrcOfTree(rootNode: ParserNode): string {
    return `flowchart TD
${generateSrcOfNode(rootNode, [], 'root').join('\n')}
`;
}

export function ParsedTree({ node }: { node: ParserNode | undefined }) {
    if (node === undefined) {
        return <></>;
    }
    const src = generateSrcOfTree(node);
    return <Mermaid src={src} className="parsedTree-container" />;
}
