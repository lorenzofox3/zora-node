const {execFile} = require('child_process');
const {promisify} = require('util');
const exec = promisify(execFile);
const node = process.execPath;
const bin = 'src/cli.js';

const run = (...args) => exec(node, [bin, ...args], {
    cwd: process.cwd()
});

run('test/unit/*.js')
    .then(std => {
        console.log(std);
    })
    .catch(e => {
        console.log(e);
    });

// export default t => {
//     t.test(`only mode should only run test with only flag`, async t => {
//         const r = await run('test/sample/only/*.js');
//         t.ok(r);
//     });
// };