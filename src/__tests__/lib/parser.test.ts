import { tokenize } from '../../lib/tokenizer';
import { parse, parseAsync } from '../../lib/parser';

describe('リグレッションテスト', () => {
    const testCases = [
        '   123',
        '   123   ',
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

    describe('parse from string', () => {
        testCases.forEach((testCase) => {
            test(`parse ${testCase}`, () => {
                expect(parse(testCase)).toMatchSnapshot();
            });
        });
    });

    describe('parse from tokens', () => {
        testCases.forEach((testCase) => {
            test(`parse ${testCase}`, () => {
                expect(parse(tokenize(testCase))).toMatchSnapshot();
            });
        });
    });

    describe('parseAsync from string', () => {
        testCases.forEach((testCase) => {
            test(`parseAsync ${testCase}`, async () => {
                await expect(parseAsync(testCase)).resolves.toMatchSnapshot();
            });
        });
    });

    describe('parseAsync from tokens', () => {
        testCases.forEach((testCase) => {
            test(`parseAsync ${testCase}`, async () => {
                await expect(parseAsync(tokenize(testCase))).resolves.toMatchSnapshot();
            });
        });
    });
});
