import { tokenize, type Token } from '../../lib/tokenizer';

describe('non-degrade tests', () => {
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
    ];

    testCases.forEach((testCase) => {
        test(`tokenize ${testCase}`, () => {
            expect(tokenize(testCase)).toMatchSnapshot();
        });
    });
});

describe('normal tests', () => {
    const testCases: { input: string; expected: Token[] }[] = [
        {
            input: '123',
            expected: [
                {
                    type: 'number',
                    value: '123',
                },
            ],
        },
        {
            input: '123+456',
            expected: [
                {
                    type: 'number',
                    value: '123',
                },
                {
                    type: 'operator',
                    value: '+',
                },
                {
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456',
            expected: [
                {
                    type: 'number',
                    value: '123',
                },
                {
                    type: 'operator',
                    value: '+',
                },
                {
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456 ',
            expected: [
                {
                    type: 'number',
                    value: '123',
                },
                {
                    type: 'operator',
                    value: '+',
                },
                {
                    type: 'number',
                    value: '456',
                },
            ],
        },
        {
            input: '123 +456 + 789',
            expected: [
                {
                    type: 'number',
                    value: '123',
                },
                {
                    type: 'operator',
                    value: '+',
                },
                {
                    type: 'number',
                    value: '456',
                },
                {
                    type: 'operator',
                    value: '+',
                },
                {
                    type: 'number',
                    value: '789',
                },
            ],
        },
    ];
    function assertTokens(actual: Token[], expected: Token[]) {
        expect(actual.length).toEqual(expected.length);
        for (let i = 0; i < actual.length; i++) {
            expect(actual[i].type).toEqual(expected[i].type);
            expect(actual[i].value).toEqual(expected[i].value);
        }
    }

    testCases.forEach((testCase) => {
        test(`test case: ${testCase.input}`, () => {
            const actual = tokenize(testCase.input);
            assertTokens(actual, testCase.expected);
        });
    });
});

describe('error tests', () => {
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
