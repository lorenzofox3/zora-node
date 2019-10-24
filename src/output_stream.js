const {EOL} = require('os');

const delegate = exports.delegate = (...methods) => target => {
    const output = {};

    for (const m of methods) {
        output[m] = (...args) => target[m](...args);
    }

    return output;
};

const delegateTTY = delegate('write', 'clearLine', 'cursorTo', 'moveCursor', 'end');

exports.output = stream => {
    return Object.assign(delegateTTY(stream), {
        writeLine(message = '', padding = 0) {
            this.write(' '.repeat(padding) + message + EOL);
        },
        writeBlock(message, padding = 0) {
            this.writeLine();
            this.writeLine(message, padding);
        }
    });
};