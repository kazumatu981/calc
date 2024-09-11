import { type ParserNode } from '../parser/parser-node';
export type ResolveEvent = 'operate' | 'read_num' | 'execute_paren';
interface EventArgBase {
    node: ParserNode;
}
export interface OperateEventArg extends EventArgBase {
    operator: string;
    left: number;
    right: number;
    result: number;
}
export interface ReadNumEventArg extends EventArgBase {
    result: number;
}

export interface ExecuteParenEventArg extends EventArgBase {
    result: number;
}

export type ResolveEventHandler = (
    event: ResolveEvent,
    arg: OperateEventArg | ReadNumEventArg | ExecuteParenEventArg,
) => void;
