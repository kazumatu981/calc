import { TokenizerError } from './errors';
import type { Token } from './token';
import { CharacterTestUtil, TokenizeUtil } from './tokenizer-utils';

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
    const tokens: Token[] = [];
    let currentIndex = 0;
    while (currentIndex < input.length) {
        // 字句を切り出す
        const token = readToken(input, currentIndex);
        if (token === undefined) {
            // 切り出せなかった場合そのまま終了
            // (末尾がスペースだった場合)
            break;
        }
        // 切り出した結果を配列に追加
        tokens.push(token.token);
        currentIndex = token.next;
    }
    return tokens;
}

/**
 * inputのstartIndexから始まる字句を切り出す。
 * @param input 入力文字列
 * @param startIndex 開始位置
 * @returns 切り切り出した字句と次の開始位置
 */
export function readToken(input: string, startIndex: number): { token: Token; next: number } | undefined {
    let currentIndex = TokenizeUtil.skipSpaces(input, startIndex);

    if (currentIndex >= input.length) {
        // 空白文字のまま末尾まで行ったらトークンは何もなかったとみなす。
        return undefined;
    } else if (CharacterTestUtil.isDigit(input, currentIndex)) {
        // 数字を切り出す
        return TokenizeUtil.readNumberToken(input, currentIndex);
    } else if (CharacterTestUtil.isOperator(input, currentIndex)) {
        // 演算子を切り出す
        return TokenizeUtil.readOperatorToken(input, currentIndex);
    } else if (CharacterTestUtil.isLeftParen(input, currentIndex)) {
        // 左括弧
        return TokenizeUtil.readParanToken(input, 'leftParen', currentIndex);
    } else if (CharacterTestUtil.isRightParen(input, currentIndex)) {
        // 右括弧
        return TokenizeUtil.readParanToken(input, 'rightParen', currentIndex);
    } else {
        // 予期せぬ文字を検出した
        throw new TokenizerError('unknown-character', input.charAt(currentIndex));
    }
}
