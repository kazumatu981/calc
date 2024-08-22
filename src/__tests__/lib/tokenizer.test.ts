import { tokenize, Token, tokenizeAsync } from '../../lib/tokenizer';

describe('リグレッションテスト', () => {
    const testCases = [
        '   123',
        '   123   ',
        '   123 123',
        '123   + 456',
        '123   * 456',
        '123   - 456',
        '123   / 456',
        '123   + 456*123',
        '-123   -456',
        '-123--456',
        '-123*(-456+23)',
        '(12+32)*(45-23)',
    ];

    testCases.forEach((testCase) => {
        test(`tokenize ${testCase}`, () => {
            expect(tokenize(testCase)).toMatchSnapshot();
        });
    });
    testCases.forEach((testCase) => {
        test(`tokenizeAsync ${testCase}`, async () => {
            await expect(tokenizeAsync(testCase)).resolves.toMatchSnapshot();
        });
    });
});

describe('通常の単体テスト', () => {
    const testCases: { input: string; expected: any[] }[] = [
        {
            input: '123',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '123',
                },
            ],
        },
        {
            input: '123+456',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '123',
                },
                {
                    position: 3,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 4,
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '123',
                },
                {
                    position: 4,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 5,
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456 ',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '123',
                },
                {
                    position: 4,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 5,
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456 + 789',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '123',
                },
                {
                    position: 4,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 5,
                    type: 'number',
                    value: '456',
                },
                {
                    position: 9,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 11,
                    type: 'number',
                    value: '789',
                },
            ],
        },
        {
            input: '2*(3+4)',
            expected: [
                {
                    position: 0,
                    type: 'number',
                    value: '2',
                },
                {
                    position: 1,
                    type: 'operator',
                    value: '*',
                },
                {
                    position: 2,
                    type: 'leftParen',
                    value: '(',
                },
                {
                    position: 3,
                    type: 'number',
                    value: '3',
                },
                {
                    position: 4,
                    type: 'operator',
                    value: '+',
                },
                {
                    position: 5,
                    type: 'number',
                    value: '4',
                },
                {
                    position: 6,
                    type: 'rightParen',
                    value: ')',
                },
            ],
        },
    ];
    function assertTokens(actual: Token[], expected: Token[]) {
        expect(actual.length).toEqual(expected.length);
        for (let i = 0; i < actual.length; i++) {
            expect(actual[i].type).toEqual(expected[i].type);
            expect(actual[i].value).toEqual(expected[i].value);
            expect(actual[i].position).toEqual(expected[i].position);
        }
    }

    testCases.forEach((testCase) => {
        test(`test case: ${testCase.input}`, () => {
            const actual = tokenize(testCase.input);
            assertTokens(actual, testCase.expected);
        });
    });
});

describe('エラー系のテスト', () => {
    const testCases: { input: string; expected: string }[] = [
        {
            input: '123a',
            expected: 'tokenizer: unknown-character',
        },
    ];
    testCases.forEach((testCase) => {
        test(`test case: ${testCase.input}`, () => {
            expect(() => tokenize(testCase.input)).toThrowErrorMatchingSnapshot();
        });
    });
});
