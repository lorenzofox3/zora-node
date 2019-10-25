const {execFile} = require('child_process');
const {promisify} = require('util');
const {readFileSync} = require('fs');
const {resolve} = require('path');

const exec = promisify(execFile);
const node = process.execPath;
const bin = 'src/cli.js';

const run = (...args) => exec(node, [bin, ...args], {
    cwd: process.cwd()
});

const loadFileContent = path => readFileSync(resolve(process.cwd(), path)).toString();

export default t => {
    t.test(`only mode should only run test with only flag`, async t => {
        try {
            const {stderr, stdout} = await run('test/samples/only/*.js', '--only');
            t.ok(stdout);
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test(`no only mode should throw when testing program uses "only"`, async t => {
        try {
            await run('test/samples/only/*.js');
            t.fail('should not pass');
        } catch (e) {
            t.eq(e.code, 1, 'exit code should be 1');
            t.ok(e.stderr.startsWith(`Error: Can not use "only" method when not in run only mode`));
        }
    });

    t.test(`errored test suite should exit the process with code 1`, async t => {
        try {
            await run('test/samples/errored/*.js');
            t.fail('should not pass');
        } catch (e) {
            t.eq(e.code, 1, 'exit code should be 1');
            t.ok(e.stderr.startsWith(`Error: some error`));
        }
    });

    t.test(`failing test suite should exit the process with code 1`, async t => {
        try {
            await run('test/samples/failing/*.js');
            t.fail('should not pass');
        } catch (e) {
            t.eq(e.code, 1, 'exit code should be 1');
        }
    });

    t.test(`"skip" test should be skipped and build marked as passed`, async t => {
        try {
            const {stderr, stdout} = await run('test/samples/skip/*.js');
            t.ok(stdout);
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test('--help should output the help content', async t => {
        try {
            const {stderr, stdout} = await run('--help');
            t.eq(stdout, loadFileContent('./src/usage.txt').toString());
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test('use tap reporter', async t => {
        try {
            const {stderr, stdout} = await run('test/samples/dummy/*.js', '-r', 'tap');
            t.eq(stdout, loadFileContent('test/samples/dummy/tap.txt'));
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test('use tap indent reporter', async t => {
        try {
            const {stderr, stdout} = await run('test/samples/dummy/*.js', '-r', 'tap-indent');
            t.eq(stdout.replace(/\d+ms/g, '{TIME}'), loadFileContent('test/samples/dummy/tap-indent.txt'));
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test('use log reporter', async t => {
        try {
            const {stderr, stdout} = await run('test/samples/dummy/*.js', '-r', 'log');
            t.eq(stdout.replace(/"executionTime":\d+,/g, '"executionTime":{TIME},'), loadFileContent('test/samples/dummy/log.txt'));
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });

    t.test(`no esm flag should understand cjs files`, async t => {
        try {
            const {stderr, stdout} = await run('test/samples/cjs/*.js', '--no-esm');
            t.ok(stdout);
            t.notOk(stderr);
        } catch (e) {
            t.fail(`should not have any error`);
        }
    });
};