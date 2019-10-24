export default ({test,skip, ok}) => {

    // ok(false, 'hey hey');

    test('some test', t => {
        t.eq(3, 3);
        t.eq(4, 4);
    });

    test(`failing`, t => {
        t.test(`very nested`, t => {
            t.eq({foo: 'bar'}, {foo: 'baz'}, 'does not match, does it?');
        });
    });
}