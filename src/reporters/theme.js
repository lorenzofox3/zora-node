import kleur from 'kleur';

export const theme = ({
                          bgGreen,
                          bgRed,
                          bgYellow,
                          green,
                          red,
                          cyan,
                          gray,
                          yellow,
                          bold,
                          underline
                      } = kleur) => ({
    emphasis(message) {
        return underline().bold(message);
    },
    successBadge(message) {
        return bgGreen().black().bold(message);
    },
    failureBadge(message) {
        return bgRed().black().bold(message);
    },
    skipBadge(m) {
        return bgYellow().black().bold(m);
    },
    path(message) {
        const [first, ...rest] = message.split('/').reverse();
        return underline(gray(rest.reverse().join('/')) + '/' + first);
    },
    operator(operator) {
        return yellow(`${gray('[')} ${operator} ${gray(']')}`);
    },
    adornment(symbol) {
        return gray(symbol);
    },
    stackTrace(stack) {
        return cyan().underline(stack.trim());
    },
    summaryPass(count) {
        return green(`${bold('✔ PASS')}: ${count}`);
    },
    summarySkip(count) {
        return yellow(`${bold('⚠ SKIP')}: ${count}`);
    },
    summaryFail(count) {
        return red(`${bold('✔ FAIL')}: ${count}`);
    },
    error(value) {
        return red(value);
    },
    success(value) {
        return green(value);
    },
    diffSame(val) {
        return gray(val);
    },
    diffRemove(val) {
        return bgRed().black(val);
    },
    diffAdd(val) {
        return bgGreen().black(val);
    }
});

export const paint = theme();
