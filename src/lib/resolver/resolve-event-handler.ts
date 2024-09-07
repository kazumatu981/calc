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
