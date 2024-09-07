import { resolve } from '../../lib/resolver';
interface TestCase {
    testCase: string;
    expected: number;
}
describe('通常の単体テスト', () => {
    const testCases: TestCase[] = [
        { testCase: '   123', expected: 123 },
        { testCase: '123   ', expected: 123 },
        { testCase: '   123   ', expected: 123 },
        { testCase: '   12 + 3   ', expected: 15 },
        { testCase: '   -12 + 3   ', expected: -9 },
        { testCase: '   15 -- 3   ', expected: 18 },
        { testCase: '   12 * 3   ', expected: 36 },
        { testCase: '   1 + 2 * 3   ', expected: 7 },
        { testCase: '   (1 + 2) * 3   ', expected: 9 },
        { testCase: '   (1 + 2) / 3   ', expected: 1 },
        { testCase: '   (1 ) / 2   ', expected: 0.5 },
        { testCase: '0', expected: 0 },
        { testCase: '1 / 0', expected: Infinity }, // Division by zero
        { testCase: '0 / 1', expected: 0 },
        { testCase: '2 + 3 * 4 - 5 / 5', expected: 13 },
        { testCase: '((2 + 3) * 4) - 5', expected: 15 },
        { testCase: '2 + (3 * (4 - 5))', expected: -1 },
        { testCase: '   12 / 4   ', expected: 3 },
        { testCase: '   12 - 4   ', expected: 8 },
        { testCase: '   12 + 4   ', expected: 16 },
        { testCase: '   12 * 4   ', expected: 48 },
        { testCase: '   3 + 4 * 2 / ( 1 - 5 )', expected: 1 }, // 括弧と優先順位
        { testCase: '   3 + 4 * 2 / 1 - 5', expected: 6 }, // 優先順位
        { testCase: '   3 + 4 * ( 2 - 1 )', expected: 7 }, // 括弧
    ];

    for (const testCase of testCases) {
        test(`test case: ${testCase.testCase}`, () => {
            // 計算をする
            const result = resolve(testCase.testCase);

            // 期待通りかテストする
            expect(result).toBe(testCase.expected);
        });
    }
});
