module.exports = t => {
    t.test('ok operator', t => {
        t.ok('');
    });

    t.test('notOk operator', t => {
        t.notOk(true);
    });

    t.test('is operator', t => {
        t.is({}, {});
    });

    t.test('isNot operator', t => {
        const r = {};
        t.isNot(r, r);
    });

    t.only('eq operator', t => {
        t.only(`string difference`, t => {
            t.eq(4, 'bar', 'different type');
            t.eq('bar', 'blah');

            t.eq(`hello
            world`,`hello
            monde`, 'multiline');

        });

        t.test('number difference', t => {
            t.eq(null, 4);
            t.eq(4, 2);
        });

        t.test('boolean difference', t => {
            t.eq(undefined, true);
            t.eq(false, true);
        });

        t.only('object difference', t => {
            t.eq([], {});
            t.eq({foo: 'bar', age: 6, nested: {cool: 'blah', baz: 4}}, {
                foo: 'bar',
                age: 6,
                nested: {cool: 'blah', baz: 'woot'}
            }, 'object diff');
        });

        t.test('array difference', t => {

            t.eq(function () {
            }, [1, 2, 3, 4]);

            t.eq([{foo: 'bar', id: 1}, {foo: 'blah', id: 2}], [{foo: 'bar', id: 3}, {foo: 'woot', id: 6}, {
                foo: 'blah',
                id: 2
            }]);
        });
    });

    t.test('notEq operator', t => {
        t.notEq('foo', 'foo');
    });
};