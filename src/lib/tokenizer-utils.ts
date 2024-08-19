import type { Token, TokenType } from './token';

export class CharacterTestUtil {
    /**
     * 数字どうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 数字かどうかを表す真偽値
     */
    public static isDigit(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c >= '0' && c <= '9';
    }

    /**
     * 演算子かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 演算子かどうかを表す真偽値
     */
    public static isOperator(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === '+' || c === '-' || c === '*' || c === '/';
    }

    /**
     * 空白文字かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 空白文字かどうかを表す真偽値
     */
    public static isWhiteSpace(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === ' ';
    }

    /**
     * 左括弧かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字の位置
     * @returns 左括弧かどうかを表す真偽値
     */
    public static isLeftParen(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === '(';
    }

    /**
     * 右括弧かどうかを判定する
     * @param s 対象文字列
     * @param pos 対象文字列の位置
     * @returns 右括弧かどうかを表す真偽値
     */
    public static isRightParen(s: string, pos: number): boolean {
        const c = s.charAt(pos);
        return c === ')';
    }
}

export class TokenizeUtil {
    public static skipSpaces(input: string, startIndex: number): number {
        let currentIndex = startIndex;
        while (currentIndex < input.length && CharacterTestUtil.isWhiteSpace(input, currentIndex)) {
            currentIndex++;
        }
        return currentIndex;
    }
    public static readNumberToken(input: string, startIndex: number): { token: Token; next: number } | undefined {
        let currentIndex = startIndex;
        let value = '';
        while (currentIndex < input.length && CharacterTestUtil.isDigit(input, currentIndex)) {
            value += input.charAt(currentIndex);
            currentIndex++;
        }
        return {
            token: {
                type: 'number',
                value: value,
                position: startIndex,
            },
            next: currentIndex,
        };
    }

    public static readOperatorToken(input: string, startIndex: number): { token: Token; next: number } | undefined {
        return {
            token: {
                type: 'operator',
                value: input.charAt(startIndex),
                position: startIndex,
            },
            next: startIndex + 1,
        };
    }

    public static readParanToken(
        input: string,
        startEnd: 'leftParen' | 'rightParen',
        startIndex: number,
    ): { token: Token; next: number } | undefined {
        return {
            token: {
                type: startEnd as TokenType,
                value: input.charAt(startIndex),
                position: startIndex,
            },
            next: startIndex + 1,
        };
    }
}
