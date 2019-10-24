import {logReporter} from '../../src/reporters/log_reporter.js';

const fakeOutputStream = () => {
    const buffer = [];
    return {
        write(val) {
            buffer.push(val);
        },
        compare(assert, expected) {
            return assert.eq(buffer.map(i => JSON.parse(i)), expected);
        }
    };
};

export default t => {
    t.test(`dump messages as they enter`, async t => {
        const out = fakeOutputStream();
        const report = logReporter(out);
        const messages = [
            {type: 'TEST_START', data: 1},
            {type: 'TEST_START', data: 2},
            {type: 'ASSERTION', data: 4},
            {type: 'TEST_END', data: 3},
            {type: 'TEST_END', data: -1}
        ];
        await report(messages);

        out.compare(t, messages);
    });

    t.test(`should throw error if bailout message is found`, async t => {
        const out = fakeOutputStream();
        const report = logReporter(out);
        const error = new Error('an error');
        const messages = [
            {type: 'TEST_START', data: 1},
            {type: 'TEST_START', data: 2},
            {type: 'BAIL_OUT', data: error},
            {type: 'TEST_END', data: 3},
            {type: 'TEST_END', data: -1}
        ];
        try {
            await report(messages);
            t.fail(`should not have reached that point`);
        } catch (e) {
            t.is(e, error, 'should have re thrown the error');
        }

        out.compare(t, [
            {type: 'TEST_START', data: 1},
            {type: 'TEST_START', data: 2}]
        );
    });
};