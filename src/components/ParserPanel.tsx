import { BinaryNode, ParenNode, type ParserNode, SingleNode } from '../lib/parser/parser-node';
import { OrganizationChart, OrganizationChartNodeData } from 'primereact/organizationchart';
import './ParserPanel.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

library.add(faLocationDot);

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
            <div className="text-xl">{node.label}</div>
            <div className="ml-3">
                <small>
                    <FontAwesomeIcon icon={faLocationDot} size="xs" />
                    {data.tokens[0].position}
                </small>
            </div>
        </div>
    );
}

export function ParserPanel({ parsedNode }: { parsedNode: ParserNode | undefined }) {
    return parsedNode ? (
        <OrganizationChart value={[parserNodeToTreeNode(parsedNode)]} nodeTemplate={nodeTemplate} />
    ) : (
        <></>
    );
}
