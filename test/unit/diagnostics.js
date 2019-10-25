import {countPadding, expandNewLines, getDiagnosticReporter, valToTypeString} from '../../src/reporters/diagnostic.js';
import {stubFn} from '../util.js';
import {EOL} from 'os';

const theme = [
    'emphasis',
    'successBadge',
    'failureBadge',
    'skipBadge',
    'path',
    'operator',
    'adornment',
    'stackTrace',
    'summaryPass',
    'summarySkip',
    'summaryFail',
    'error',
    'success',
    'diffSame',
    'diffRemove',
    'diffAdd'
];

const fakeOut = target => {
    for (const k of theme) {
        target[k] = m => `<${k}>${m}</${k}>`;
    }
    return target;
};

export default t => {
    t.test('valToTypeString', t => {
        t.eq(valToTypeString(null), null); // not a string but gets "pretty print"
        t.eq(valToTypeString([]), 'array');
        t.eq(valToTypeString({}), 'object');
        t.eq(valToTypeString(void 0), 'undefined');
        t.eq(valToTypeString(true), 'boolean');
        t.eq(valToTypeString(4), 'number');
        t.eq(valToTypeString(''), 'string');
        t.eq(valToTypeString(() => {
        }), 'function');
    });

    t.test(`truthy diagnostic with empty string`, t => {
        const diag = getDiagnosticReporter({operator: 'ok', actual: ''});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected a <operator>TRUTHY</operator> value but got <error>""</error>`,
            4
        ]);
    });

    t.test(`truthy diagnostic with undefined`, t => {
        const diag = getDiagnosticReporter({operator: 'ok', actual: undefined});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected a <operator>TRUTHY</operator> value but got <error>undefined</error>`,
            4
        ]);
    });

    t.test(`truthy diagnostic with null`, t => {
        const diag = getDiagnosticReporter({operator: 'ok', actual: null});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected a <operator>TRUTHY</operator> value but got <error>null</error>`,
            4
        ]);
    });

    t.test(`truthy diagnostic with false`, t => {
        const diag = getDiagnosticReporter({operator: 'ok', actual: false});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected a <operator>TRUTHY</operator> value but got <error>false</error>`,
            4
        ]);
    });

    t.test(`falsy diagnostic with a truthy value`, t => {
        const diag = getDiagnosticReporter({operator: 'notOk', actual: true});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected a <operator>FALSY</operator> value but got <error>true</error>`,
            4
        ]);
    });

    t.test(`notEq diagnostic`, t => {
        const diag = getDiagnosticReporter({operator: 'notEqual'});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected values <operator>NOT TO BE EQUIVALENT</operator> but they are`,
            4
        ]);
    });

    t.test(`unknown operator diagnostic`, t => {
        const diag = getDiagnosticReporter({operator: 'foo'});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `(unknown operator: foo)`,
            4
        ]);
    });

    t.test(`is diagnostic`, t => {
        const diag = getDiagnosticReporter({operator: 'is'});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected values to point the <operator>SAME REFERENCE</operator> but they don't`,
            4
        ]);
    });

    t.test(`isNot diagnostic`, t => {
        const diag = getDiagnosticReporter({operator: 'isNot'});
        const writeBlock = stubFn();
        const out = fakeOut({
            writeBlock
        });
        diag.report(out);
        t.eq(writeBlock.callCount, 1);
        t.eq(writeBlock.argsFor(), [
            `expected values to point <operator>DIFFERENT REFERENCES</operator> but they point the same`,
            4
        ]);
    });

    t.test(`count padding`, t => {
        t.eq(countPadding(null), 0, `0 for a non string`);
        t.eq(countPadding('foo'), 0, `0 for a string with no padding`);
        t.eq(countPadding('     foo'), 5, `number of white space otherwise`);
    });

    t.test(`expand diffs with new lines`, t => {
        const diffs = [{
            value: '{' + EOL,
            whatever: true
        }, {
            value: `${EOL}   with padding${EOL}${EOL} some other`,
            whatever: 'bar'
        }, {
            value: `value`,
            whatever: 4
        }];

        t.eq(diffs.reduce(expandNewLines, []), [{
                'value': '{',
                'whatever': true,
                'padding': 0
            }, {
                'value': 'with padding',
                'whatever': 'bar',
                'padding': 3
            }, {
                'value': 'some other',
                'whatever': 'bar',
                'padding': 1
            }, {
                'value':
                    'value',
                'whatever': 4,
                'padding': 0
            }]
        );
    });

    t.test(`eq diagnostic`, t => {
        t.test(`when values types different`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: 'foo', actual: 4});
            const writeBlock = stubFn();
            const out = fakeOut({
                writeBlock
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <operator>string (foo)</operator> but got <error>number</error>`,
                4
            ]);
        });

        t.test(`with number difference`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: 3, actual: 4});
            const writeBlock = stubFn();
            const out = fakeOut({
                writeBlock
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>number</emphasis> to be <operator>3</operator> but got <error>4</error>`,
                4
            ]);
        });

        t.test(`with boolean difference`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: true, actual: false});
            const writeBlock = stubFn();
            const out = fakeOut({
                writeBlock
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>boolean</emphasis> to be <operator>true</operator> but got <error>false</error>`,
                4
            ]);
        });

        t.test(`with unsupported type`, t => {
            const diag = getDiagnosticReporter({
                operator: 'equal', expected: function () {
                }, actual: function () {
                }
            });
            const writeBlock = stubFn();
            const out = fakeOut({
                writeBlock
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>function</emphasis> to be <operator>EQUIVALENT</operator> but they are not`,
                4
            ]);
        });

        t.test(`with string difference`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: 'foo', actual: 'fob'});
            const writeBlock = stubFn();
            const writeLine = stubFn();
            const out = fakeOut({
                writeBlock,
                writeLine
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 2);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>string</emphasis> to be <operator>foo</operator> but got the following differences:`,
                4
            ]);
            t.eq(writeBlock.argsFor(1), [
                `<error>-</error> <diffSame>fo</diffSame><diffRemove>b</diffRemove>`,
                4
            ]);
            t.eq(writeLine.callCount, 1);
            t.eq(writeLine.argsFor(), [`<success>+</success> <diffSame>fo</diffSame><diffAdd>o</diffAdd>`, 4]);
        });

        t.test(`with object difference`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: {foo: 'bar'}, actual: {foo: 'baz'}});
            const writeBlock = stubFn();
            const writeLine = stubFn();
            const out = fakeOut({
                writeBlock,
                writeLine
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>objects</emphasis> to be <operator>EQUIVALENT</operator> but got the following differences:`,
                4
            ]);
            t.eq(writeLine.callCount, 5);
            t.eq(writeLine.argsFor(), []);
            t.eq(writeLine.argsFor(1), [`  <diffSame>{</diffSame>`, 2]);
            t.eq(writeLine.argsFor(2), [`<error>-</error>   <diffRemove>"foo": "baz"</diffRemove>`, 2]);
            t.eq(writeLine.argsFor(3), [`<success>+</success>   <diffAdd>"foo": "bar"</diffAdd>`, 2]);
            t.eq(writeLine.argsFor(4), [`  <diffSame>}</diffSame>`, 2]);
        });

        t.test(`with array difference`, t => {
            const diag = getDiagnosticReporter({operator: 'equal', expected: [{foo: 'bar'}], actual: [{foo: 'baz'}]});
            const writeBlock = stubFn();
            const writeLine = stubFn();
            const out = fakeOut({
                writeBlock,
                writeLine
            });
            diag.report(out);
            t.eq(writeBlock.callCount, 1);
            t.eq(writeBlock.argsFor(), [
                `expected <emphasis>arrays</emphasis> to be <operator>EQUIVALENT</operator> but got the following differences:`,
                4
            ]);
            t.eq(writeLine.callCount, 7);
            t.eq(writeLine.argsFor(), []);
            t.eq(writeLine.argsFor(1), [`  <diffSame>[</diffSame>`, 2]);
            t.eq(writeLine.argsFor(2), [`    <diffSame>{</diffSame>`, 2]);
            t.eq(writeLine.argsFor(3), [`<error>-</error>     <diffRemove>"foo": "baz"</diffRemove>`, 2]);
            t.eq(writeLine.argsFor(4), [`<success>+</success>     <diffAdd>"foo": "bar"</diffAdd>`, 2]);
            t.eq(writeLine.argsFor(5), [`    <diffSame>}</diffSame>`, 2]);
            t.eq(writeLine.argsFor(6), [`  <diffSame>]</diffSame>`, 2]);
        });
    });
};