module.exports = t => {

    t.eq('bar', 'blah');
    t.ok(false);

    t.test('some test', t => {
        t.ok(true);
    });

    t.test(`failures`, t => {
        t.notEq('foo', 'foo');
        t.ok('');
        t.notOk(true);
        t.is({}, {});
        const ref = {};
        t.isNot(ref, ref);

        t.eq('foo', 4);
        t.eq(4, 2);

        t.eq('baz', 'bar');
        t.eq(() => {
        }, 'bar');

        t.eq(null, true);
        t.eq(false, true);

        t.eq({foo: 'bar', age: 6, nested: {cool: 'blah', baz: 4}}, {
            foo: 'bar',
            age: 6,
            nested: {cool: 'blah', baz: 'woot'}
        }, 'object diff');

        t.eq([{foo: 'bar', id: 1    }, {foo: 'blah', id: 2}], [{foo: 'bar', id: 3}, {foo: 'woot', id: 6}, {
            foo: 'blah',
            id: 2
        }]);
    });
};