/**
 * 字句の型
 */
export type TokenType = 'number' | 'operator' | 'leftParen' | 'rightParen';

/**
 * 切り出した字句
 */
export interface Token {
    type: TokenType;
    value: string;
    position: number;
}
