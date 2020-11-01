#!/usr/bin/env node
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {createReadStream, readFileSync} from 'fs';
import arg from 'arg';
import glob from 'fast-glob';
import {createHarness, mochaTapLike, tapeTapLike} from 'zora';
import defaultReporter from './reporters/default_reporter.js';
import logReporter from './reporters/log_reporter.js';
import loadSpec from './loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_FILE_PATTERN = [
    '**/test.js',
    '**/*.spec.js',
    '**/*.test.js',
    '**/test/**/*.js',
    '**/tests/**/*.js',
    '**/__tests__/**/*.js',
    '!**/node_modules',
    '!node_modules'
];

const createReporterStream = value => {
    switch (value) {
        case 'tap':
            return tapeTapLike;
        case 'tap-indent':
            return mochaTapLike;
        case 'log':
            return logReporter();
        default:
            return process.stdout.isTTY ? defaultReporter() : mochaTapLike;
    }
};

(async function () {
    const argSpecs = {
        '--help': Boolean,
        '--only': Boolean,
        '--module-loader': String,
        '--reporter': String,
        '-o': '--only',
        '-r': '--reporter'
    };
    const {
        _: filePatternArg,
        ['--only']: runOnly = false,
        ['--module-loader']: loader = 'es',
        ['--reporter']: reporter = 'default',
        ['--help']: help
    } = arg(argSpecs, {
        permissive: false,
        argv: process.argv.slice(2)
    });
    
    const filePattern = filePatternArg.length > 0 ? filePatternArg : DEFAULT_FILE_PATTERN;
    const reporterStream = createReporterStream(reporter);
    
    // create a custom test harness
    const testHarness = createHarness({
        runOnly
    });
    
    if (help) {
        createReadStream(resolve(__dirname, './usage.txt')).pipe(process.stdout);
        return;
    }
    
    let uncaughtError = null;
    
    try {
        const files = await glob(filePattern);
        for (const file of files) {
            const spec = await loadSpec({path: file, loader});
            
            function zora_spec_fn(assert) {
                return spec(assert);
            }
            
            if (runOnly) {
                testHarness.only(file, zora_spec_fn);
            } else {
                testHarness.test(file, zora_spec_fn);
            }
        }
        await testHarness.report(reporterStream);
    } catch (e) {
        console.error(e);
        uncaughtError = e;
    } finally {
        process.exitCode = !testHarness.pass || uncaughtError ? 1 : 0;
    }
})();
