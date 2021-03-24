import {theme} from '../../src/reporters/theme.js';
import {fakeKleur} from '../util.js';

export default t => {
    t.test(`theme.emphasis: bold && underline`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.emphasis('hello');
        t.eq(kleur.string, 'hello');
        t.eq(kleur.style, ['bold', 'underline']);
    });

    t.test(`theme.successBadge: bgGreen && black && bold`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.successBadge('success');
        t.eq(kleur.string, 'success');
        t.eq(kleur.style, ['black', 'bgGreen', 'bold']);
    });

    t.test(`theme.failureBadge: bgRed && black && bold`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.failureBadge('failure');
        t.eq(kleur.string, 'failure');
        t.eq(kleur.style, ['black', 'bgRed', 'bold']);
    });

    t.test(`theme.skipBadge: bgYello && black && bold`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.skipBadge('skip');
        t.eq(kleur.string, 'skip');
        t.eq(kleur.style, ['black', 'bgYellow', 'bold']);
    });

    t.test(`theme.adornment`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.adornment('beh');
        t.eq(kleur.string, 'beh');
        t.eq(kleur.style, ['gray']);
    });

    t.test(`theme.stacktrace`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.stackTrace(' stackwithpadding   ');
        t.eq(kleur.string, 'stackwithpadding');
        t.eq(kleur.style, ['cyan', 'underline']);
    });

    t.test(`theme.error`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.error('woot woot');
        t.eq(kleur.string, 'woot woot');
        t.eq(kleur.style, ['red']);
    });

    t.test(`theme.success`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.success('woot');
        t.eq(kleur.string, 'woot');
        t.eq(kleur.style, ['green']);
    });

    t.test(`theme.diffSame`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.diffSame('blah');
        t.eq(kleur.string, 'blah');
        t.eq(kleur.style, ['gray']);
    });

    t.test(`theme.diffRemove`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.diffRemove('blah');
        t.eq(kleur.string, 'blah');
        t.eq(kleur.style, ['black', 'bgRed']);
    });

    t.test(`theme.diffAdd`, t => {
        t.ok(true);
        const kleur = fakeKleur();
        const c = theme(kleur);
        c.diffAdd('blah');
        t.eq(kleur.string, 'blah');
        t.eq(kleur.style, ['black', 'bgGreen']);
    });

}
