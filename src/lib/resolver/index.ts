import { parse, ParserNode } from '../parser';
import { tokenize, type Token } from '../tokenizer';
import { resolveNode } from './node-resolver';
import { type ResolveEventHandler } from './resolve-event-handler';

export function resolve(expression: string, eventHandler?: ResolveEventHandler): number;
export function resolve(tokens: Token[], eventHandler?: ResolveEventHandler): number;
export function resolve(node: ParserNode, eventHandler?: ResolveEventHandler): number;
export function resolve(args: string | Token[] | ParserNode, eventHandler?: ResolveEventHandler): number {
    if (typeof args === 'string') {
        return resolveNode(parse(tokenize(args)), eventHandler);
    } else if (Array.isArray(args)) {
        return resolveNode(parse(args), eventHandler);
    } else {
        return resolveNode(args, eventHandler);
    }
}

export function resolveAsync(expression: string, eventHandler?: ResolveEventHandler): Promise<number>;
export function resolveAsync(tokens: Token[], eventHandler?: ResolveEventHandler): Promise<number>;
export function resolveAsync(node: ParserNode, eventHandler?: ResolveEventHandler): Promise<number>;
export function resolveAsync(args: string | Token[] | ParserNode, eventHandler?: ResolveEventHandler): Promise<number> {
    return new Promise<number>((_resolve, _reject) => {
        try {
            if (typeof args === 'string') {
                _resolve(resolve(args, eventHandler));
            } else if (Array.isArray(args)) {
                _resolve(resolve(args, eventHandler));
            } else {
                _resolve(resolve(args, eventHandler));
            }
        } catch (e) {
            _reject(e);
        }
    });
}

export {
    type ResolveEvent,
    type ReadNumEventArg,
    type OperateEventArg,
    type ExecuteParenEventArg,
    type ResolveEventHandler,
} from './resolve-event-handler';
