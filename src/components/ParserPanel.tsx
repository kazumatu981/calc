import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { BinaryNode, ParenNode, type ParserNode, SingleNode } from '../lib/parser/parser-node';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { drawTree } from '../lib/util/node-to-mermaid';
import { sha256Hash } from '../lib/util/sha256hash';

function parserNodeToTreeNode(parserNode: ParserNode): TreeNode {
    if (parserNode.nodeType === 'paren') {
        const node = parserNode as ParenNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: '()',
            data: node,
            children: [parserNodeToTreeNode(node.childRoot)],
        };
    } else if (parserNode.nodeType === 'binary') {
        const node = parserNode as BinaryNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: node.operator,
            data: node,
            children: [parserNodeToTreeNode(node.left), parserNodeToTreeNode(node.right)],
        };
    } else if (parserNode.nodeType === 'single') {
        const node = parserNode as SingleNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: node.isNegative ? `-${node.value}` : node.value,
            data: node,
        };
    }
    throw new Error('not implemented');
}

function nodeTemplate(node: TreeNode): JSX.Element {
    const classNames = [
        'flex',
        'flex-row',
        'gap-1',
        'border-1',
        'p-2',
        'border-round-md',
        'align-items-center',
        'justify-content-center',
        'shadow-7',
    ];
    if ((node.data as ParserNode).nodeType === 'binary') {
        classNames.push('bg-teal-100');
    }
    if ((node.data as ParserNode).nodeType === 'paren') {
        classNames.push('bg-orange-100');
    }
    return (
        <div className={classNames.join(' ')}>
            <div className="text-xl">{node.label}</div>
            <div className="ml-3">
                <small>
                    <i className="pi pi-map-marker text-xs"></i>
                    {(node.data as ParserNode).tokens[0].position}
                </small>
            </div>
        </div>
    );
}

export function ParserPanel({ parsedNode }: { parsedNode: ParserNode | undefined }) {
    return parsedNode ? <Tree value={[parserNodeToTreeNode(parsedNode)]} nodeTemplate={nodeTemplate} /> : <></>;
}
