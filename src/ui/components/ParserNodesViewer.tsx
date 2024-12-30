import { JSX } from 'react';
import { BinaryNode, ParenNode, type ParserNode, SingleNode } from '../../lib/parser/parser-node';
import { OrganizationChart, OrganizationChartNodeData } from 'primereact/organizationchart';
import './ParserNodesViewer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface ParsedChardNodeData extends OrganizationChartNodeData {
    id: string;
    key: string;
    data: ParserNode;
}

function parserNodeToTreeNode(parserNode: ParserNode): ParsedChardNodeData {
    if (parserNode.nodeType === 'paren') {
        const node = parserNode as ParenNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: '()',
            data: node,
            children: [parserNodeToTreeNode(node.childRoot)],
            expanded: true,
        };
    } else if (parserNode.nodeType === 'binary') {
        const node = parserNode as BinaryNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: node.operator,
            data: node,
            children: [parserNodeToTreeNode(node.left), parserNodeToTreeNode(node.right)],
            expanded: true,
        };
    } else if (parserNode.nodeType === 'single') {
        const node = parserNode as SingleNode;
        return {
            id: node.tokens[0].id,
            key: node.tokens[0].id,
            label: node.isNegative ? `-${node.value}` : node.value,
            data: node,
            expanded: true,
        };
    }
    throw new Error('not implemented');
}

function nodeTemplate(node: OrganizationChartNodeData): JSX.Element {
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
    const data = (node as ParsedChardNodeData).data as ParserNode;
    if (data.nodeType === 'binary') {
        classNames.push('bg-teal-100');
    }
    if (data.nodeType === 'paren') {
        classNames.push('bg-orange-100');
    }
    return (
        <div className={classNames.join(' ')}>
            <div>
                <div className="flex flex-row justify-content-center">
                    <div className="text-2xl">{node.label}</div>
                </div>
                <div className="flex flex-row text-xs">
                    <div className="mr-2 bg-primary border-round p-1">
                        <FontAwesomeIcon icon={faLocationDot} />
                        {data.tokens[0].position}
                    </div>
                    <div className="p-1">{data.toString()}</div>
                </div>
            </div>
        </div>
    );
}

export function ParserNodesViewer({ parsedNode }: { parsedNode: ParserNode | undefined }) {
    return parsedNode ? (
        <OrganizationChart value={[parserNodeToTreeNode(parsedNode)]} nodeTemplate={nodeTemplate} />
    ) : (
        <></>
    );
}
