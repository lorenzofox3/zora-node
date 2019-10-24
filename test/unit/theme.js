import {theme} from '../../src/reporters/theme.js';
import {fakeKleur} from '../util.js';

export default t => {
    t.test(`theme.emphasis: bold && underline`, t => {
        const c = theme(fakeKleur());
        c.emphasis('hello');
        t.fail('not implemented yet');
    });
}