#!/usr/bin/env node
const {Console} = require('console');
const esm = require('esm');
const arg = require('arg');
const globby = require('globby');
const {createHarness} = require('zora');
const TSR = require('tap-mocha-reporter');
const path = require('path');

const DEFAULT_FILE_PATTERN = [
    '**/test.js',
    '**/test-*.js',
    '**/*.spec.js',
    '**/*.test.js',
    '**/test/**/*.js',
    '**/tests/**/*.js',
    '**/__tests__/**/*.js',
    '!**/node_modules',
    '!node_modules'
];

const HELP_TEXT = `
Usage
    pta [<file> ...]

  Options
    --only, -o              Runs zora in "only mode"
    --no-esm                If true, does not use "esm" module to load test files
    --reporter, -r          One of tap, tap-indent, classic (default), doc, dot, dump, json, jsonstream, landing,
                            list, markdown, min, nyan, progress, silent, spec, xunit 
 
  Examples
    pta
    pta test.js test2.js
    pta ./test/{foo,bar}.spec.js

  If no argument is provided, the CLI will use the following patterns: 
    **/test.js **/test-*.js **/*.spec.js **/*.test.js **/test/**/*.js **/tests/**/*.js **/__tests__/**/*.js
`;

const createReporterStream = (value) => {
    switch (value) {
        case 'tap':
        case 'tap-indent':
            return process.stdout;
        case 'classic':
        case 'doc':
        case 'dot':
        case 'dump':
        case 'json':
        case 'jsonstream':
        case 'landing':
        case 'list':
        case 'markdown':
        case 'min':
        case 'nyan':
        case 'progress':
        case 'silent':
        case 'spec':
        case 'xunit':
            return TSR(value);
        default:
            throw new Error(`unknown reporter ${value}`);
    }
};

(async function () {
    const argSpecs = {
        '--help': Boolean,
        '--only': Boolean,
        '--no-esm': Boolean,
        '--reporter': String,
        '-o': '--only',
        '-r': '--reporter'
    };
    const {
        _: filePatternArg,
        ['--only']: runOnly = false,
        ['--no-esm']: noESM = false,
        ['--reporter']: reporter = 'classic',
        ['--help']: help
    } = arg(argSpecs, {
        permissive: false,
        argv: process.argv.slice(2)
    });

    if (help) {
        console.log(HELP_TEXT);
        process.exit(0);
    }

    const filePattern = filePatternArg.length > 0 ? filePatternArg : DEFAULT_FILE_PATTERN;
    const reporterStream = createReporterStream(reporter);
    console = new Console({
        stdout: reporterStream
    });

    // create a custom test harness
    const testHarness = createHarness({
        indent: reporter !== 'tap',
        runOnly
    });
    try {
        const files = await globby(filePattern);
        const requireFn = noESM === false ? esm(module) : require;
        for (const f of files) {
            const spec = requireFn(path.resolve(process.cwd(), f));
            testHarness.test(f, spec.default ? spec.default : spec);
        }
        // force indented reporting
        await testHarness.report();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        reporterStream.end();
        process.exit(testHarness.pass ? 0 : 1);
    }
})();