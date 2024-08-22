import { Token, TokenType } from './token';
import { Tokenizer } from './tokenizer';

export { Token };
export type { TokenType };

/**
 * 入力文字列を字句に分割する(非同期版)
 * @param input 入力文字列
 * @returns 切り出した字句
 */
export async function tokenizeAsync(input: string): Promise<Token[]> {
    return new Promise((resolve, reject) => {
        try {
            resolve(tokenize(input));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * 入力文字列を字句に分割する
 * @param input 入力文字列
 * @returns 切り出した字句
 */
export function tokenize(input: string): Token[] {
    return new Tokenizer(input).tokenize();
}
