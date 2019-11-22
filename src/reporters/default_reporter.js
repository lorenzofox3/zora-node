const {EOL} = require('os');
const {output} = require('../output_stream.js');
const {paint} = require('./theme.js');
const {testFile} = require('./test_file.js');
const {getDiagnosticReporter} = require('./diagnostic.js');

const printHeader = (message, out) => {
    const header = message.toUpperCase();
    out.writeBlock(out.emphasis(header), 1);
};

const printFailures = (tests, out) => {
    const failing = tests
        .filter(t => t.failureList.length)
        .reduce((acc, curr) => acc.concat([...curr]), []);

    if (failing.length === 0) {
        out.writeLine('N/A', 2);
        return;
    }

    failing.forEach((failure, index) => {
        const data = failure.data;
        const [file, ...testPath] = failure.path;
        const header = testPath.concat(out.emphasis(data.description)).join(out.adornment(' > '));
        out.writeBlock((`${paint.adornment(`${index + 1}.`)} ${header} ${out.adornment('<--')} ${out.operator(data.operator)}`));
        out.writeLine(`${paint.adornment('at')} ${paint.stackTrace(data.at)}`, 4);
        getDiagnosticReporter(data).report(out);
        out.writeLine(out.adornment('_'.repeat(out.width)));

    });
};

const printFooter = (tests, out) => {
    const skipped = tests.reduce((acc, curr) => acc + curr.skip, 0);
    const failure = tests.reduce((acc, curr) => acc + curr.failure, 0);
    const success = tests.reduce((acc, curr) => acc + curr.success, 0);

    out.writeLine(paint.summaryPass(success), 1);
    out.writeLine(paint.summarySkip(skipped), 1);
    out.writeLine(paint.summaryFail(failure), 1);

    out.writeLine(`${EOL}`);
};

const isAssertionResult = result => 'operator' in result;

exports.defaultReporter = (theme = paint, stream = process.stdout) => {

    const out = Object.assign(output(stream), theme, {
        width: stream.columns || 80
    });

    return async stream => {
        const tests = [];
        let testLines = 0;
        let pass = true;

        printHeader('tests files', out);
        out.writeLine();

        for await (const message of stream) {
            const current = tests[tests.length - 1];
            const {data, offset, type} = message;

            if (type === 'BAIL_OUT') {
                throw data;
            }

            if (type === 'TEST_END' && offset > 0) {
                current.goOut();
            }

            if (type === `TEST_START`) {
                if (offset === 0) {
                    testLines++;
                    const test = testFile(data.description, out);
                    test.writeLine();
                    tests.push(test);
                } else {
                    current.goIn(data.description);
                }
            }

            if (type === `ASSERTION`) {
                if (isAssertionResult(data) || data.skip) {
                    pass = pass && data.pass;
                    if (data.pass === false) {
                        current.incrementFailure();
                        current.addFailure(data);
                    } else if (data.skip) {
                        current.incrementSkip();
                    } else {
                        current.incrementSuccess();
                    }
                    out.moveCursor(0, -1);
                    out.clearLine(0);
                    tests[tests.length - 1].writeLine();
                }
            }

        }

        printHeader('failures', out);
        printFailures(tests, out);

        printHeader('summary', out);

        out.writeLine();

        printFooter(tests, out);
    };
};
