import { SingleNode, ParenNode, BinaryNode, ParserNode } from '../parser';
import { ResolveEventHandler } from './resolve-event-handler';
import { stringToNum } from './string-to-num';

export function resolveNode(rootNode: ParserNode, eventHandler?: ResolveEventHandler): number {
    if (rootNode.nodeType === 'single') {
        return resolveSingleNode(rootNode as SingleNode, eventHandler);
    } else if (rootNode.nodeType === 'binary') {
        return resolveBinaryNode(rootNode as BinaryNode as BinaryNode, eventHandler);
    } else {
        return resolveParenNode(rootNode as ParenNode, eventHandler);
    }
}

function resolveSingleNode(node: SingleNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    let value = stringToNum(node.value);
    if (node.isNegative) {
        value *= -1;
    }

    eventHandler('read_num', {
        node: node,
        result: value,
    });
    return value;
}

function resolveBinaryNode(node: BinaryNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    const left = resolveNode(node.left, eventHandler);
    const right = resolveNode(node.right, eventHandler);
    let calculate = (number1: number, number2: number) => number1 + number2;
    switch (node.operator) {
        case '+':
            calculate = (number1: number, number2: number) => number1 + number2;
            break;
        case '-':
            calculate = (number1: number, number2: number) => number1 - number2;
            break;
        case '*':
            calculate = (number1: number, number2: number) => number1 * number2;
            break;
        case '/':
            calculate = (number1: number, number2: number) => number1 / number2;
            break;
    }

    const result = calculate(left, right);
    eventHandler!('operate', {
        node: node,
        operator: node.operator,
        left,
        right,
        result,
    });

    return result;
}

function resolveParenNode(node: ParenNode, eventHandler?: ResolveEventHandler): number {
    eventHandler = eventHandler || (() => {});
    const result = resolveNode(node.childRoot, eventHandler);
    eventHandler!('execute_paren', {
        node: node,
        result,
    });
    return result;
}
