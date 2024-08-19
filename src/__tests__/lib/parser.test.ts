import { tokenize } from '../../lib/tokenizer';
import { Parser } from '../../lib/parser';

describe('normal tests', () => {
    test('1+2+3', () => {
        const tokens = tokenize('1+2+3');
        const parser = new Parser(tokens);
        const node = parser.parse();
        expect(node).toMatchSnapshot();
    });
    test('1*2+3', () => {
        const tokens = tokenize('1*2+3');
        const parser = new Parser(tokens);
        const node = parser.parse();
        expect(node).toMatchSnapshot();
    });
    test('1+2*3+ 4', () => {
        const tokens = tokenize('1+2*3+ 4');
        const parser = new Parser(tokens);
        const node = parser.parse();
        expect(node).toMatchSnapshot();
    });
    test('1+(2+3)+ 4', () => {
        const tokens = tokenize('1+(2+3)+ 4');
        const parser = new Parser(tokens);
        const node = parser.parse();
        expect(node).toMatchSnapshot();
    });
});
