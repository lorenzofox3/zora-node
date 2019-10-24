import {stubFn} from '../util.js';
import {delegate, output} from '../../src/output_stream.js';
import {EOL} from 'os';

export default ({test}) => {
    test(`delegate`, t => {
        const target = {
            foo: stubFn(),
            bar: stubFn(),
            baz: stubFn()
        };
        const object = Object.assign({
            baz() {
            }
        }, delegate('foo', 'bar')(target));
        object.foo('foo', 'foo2');

        t.eq(target.foo.callCount, 1, 'target.foo should have been called');
        t.eq(target.foo.argsFor(), ['foo', 'foo2'], 'should have forwarded the arguments');

        object.bar('bar', 'bar2');

        t.eq(target.bar.callCount, 1, 'target.bar should have been called');
        t.eq(target.bar.argsFor(), ['bar', 'bar2'], 'should have passed the args');

        object.baz('baz');

        t.eq(target.baz.callCount, 0, 'target baz should not have been called');
    });

    test(`output stream factory`, t => {

        t.test(`output stream delegation`, t => {
            const stream = {
                write: stubFn(),
                clearLine: stubFn(),
                cursorTo: stubFn(),
                moveCursor: stubFn(),
                end: stubFn()
            };

            const out = output(stream);

            t.eq(typeof out.write, 'function', 'output stream should have a "write" method');
            t.eq(typeof out.clearLine, 'function', 'output stream should have a "clearLine" method');
            t.eq(typeof out.cursorTo, 'function', 'output stream should have a "cursorTo" method');
            t.eq(typeof out.moveCursor, 'function', 'output stream should have a "moveCursor" method');
            t.eq(typeof out.end, 'function', 'output stream should have a "end" method');

            out.write('foo bar bim');
            out.clearLine(0);
            out.cursorTo(2, 45);
            out.moveCursor(1, 2);
            out.end('foo');
            t.eq(stream.write.callCount, 1, 'stream.write should have been called once');
            t.eq(stream.write.argsFor(), ['foo bar bim'], 'should have forwarded arguments');
            t.eq(stream.clearLine.callCount, 1, 'stream.clearLine should have been called once');
            t.eq(stream.clearLine.argsFor(), [0], 'should have forwarded arguments');
            t.eq(stream.cursorTo.callCount, 1, 'stream.cursorTo should have been called once');
            t.eq(stream.cursorTo.argsFor(), [2, 45], 'should have forwarded arguments');
            t.eq(stream.moveCursor.callCount, 1, 'stream.moveCursor should have been called once');
            t.eq(stream.moveCursor.argsFor(), [1, 2], 'should have forwarded arguments');
            t.eq(stream.end.callCount, 1, 'stream.end should have been called once');
            t.eq(stream.end.argsFor(), ['foo'], 'should have forwarded arguments');
        });

        t.test(`output.writeLine with no padding`, t => {
            const stream = {
                write: stubFn()
            };

            const out = output(stream);

            out.writeLine('hello line');
            t.eq(stream.write.callCount, 1, 'stream.write should have been called');
            t.eq(stream.write.argsFor(), [`hello line${EOL}`], 'should have appended EOL to the message');
        });

        t.test(`output.writeLine with padding`, t => {
            const stream = {
                write: stubFn()
            };

            const out = output(stream);

            out.writeLine('hello line', 4);
            t.eq(stream.write.callCount, 1, 'stream.write should have been called');
            t.eq(stream.write.argsFor(), [`    hello line${EOL}`], 'should have appended EOL to the message and prepended the padding');
        });

        t.test(`output.writeBlock with no padding`, t => {
            const stream = {
                write: stubFn()
            };

            const out = output(stream);

            out.writeBlock('hello world');
            t.eq(stream.write.callCount, 2, 'stream.writeLine should have been called twice');
            t.eq(stream.write.argsFor(), [EOL], 'should have framed the message with EOL');
            t.eq(stream.write.argsFor(1), [`hello world${EOL}`], 'should have framed the message with EOL');
        });

        t.test(`output.writeBlock with padding`, t => {
            const stream = {
                write: stubFn()
            };

            const out = output(stream);

            out.writeBlock('hello world', 4);
            t.eq(stream.write.callCount, 2, 'stream.writeLine should have been called twice');
            t.eq(stream.write.argsFor(), [EOL], 'should have framed the message with EOL');
            t.eq(stream.write.argsFor(1), [`    hello world${EOL}`], 'should have framed the message with EOL');
        });

    });
};

