/**
 * 字句の型
 */
export type TokenType = 'number' | 'operator' | 'leftParen' | 'rightParen';

/**
 * 切り出した字句
 */
export class Token {
    public readonly id: string;
    public readonly type: TokenType;
    public readonly value: string;
    public readonly position: number;
    constructor(type: TokenType, value: string, position: number) {
        this.id = `${type}-${value}-${position}`;
        this.type = type;
        this.value = value;
        this.position = position;
    }

    public get isNumber(): boolean {
        return this.type === 'number';
    }

    public get isOperator(): boolean {
        return this.type === 'operator';
    }

    public get isLeftParen(): boolean {
        return this.type === 'leftParen';
    }

    public get isRightParen(): boolean {
        return this.type === 'rightParen';
    }

    public get isParen(): boolean {
        return this.isLeftParen || this.isRightParen;
    }

    public get isNegativeSign(): boolean {
        return this.type === 'operator' && this.value === '-';
    }

    public get isPrimaryOperator(): boolean {
        return this.type === 'operator' && (this.value === '*' || this.value === '/');
    }

    public get isSecondaryOperator(): boolean {
        return this.type === 'operator' && (this.value === '+' || this.value === '-');
    }
}
