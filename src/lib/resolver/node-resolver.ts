import { SingleNode, ParenNode, BinaryNode, ParserNode } from '../parser';
import { stringToNum } from './string-to-num';

export type ResolveEvent = 'operate' | 'read_num' | 'execute_paren';
export interface OperateEventArg {
    operator: string;
    left: number;
    right: number;
    result: number;
}
export interface ReadNumEventArg {
    result: number;
}

export interface ExecuteParenEventArg {
    result: number;
}

export type ResolveEventHandler = (
    event: ResolveEvent,
    arg: OperateEventArg | ReadNumEventArg | ExecuteParenEventArg,
) => void;

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
    let value = stringToNum(node.value);
    if (node.isNegative) {
        value *= -1;
    }

    eventHandler!('read_num', { result: value });
    return value;
}

function resolveBinaryNode(node: BinaryNode, eventHandler?: ResolveEventHandler): number {
    const left = resolveNode(node.left);
    const right = resolveNode(node.right);
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
        operator: node.operator,
        left,
        right,
        result,
    });

    return result;
}

function resolveParenNode(node: ParenNode, eventHandler?: ResolveEventHandler): number {
    const result = resolveNode(node.childRoot);
    eventHandler!('execute_paren', { result });
    return resolveNode(node.childRoot);
}
