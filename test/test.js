export default ({test}) => {
    test('some test', t => {
        t.eq(3, 3);
    });

    test(`failing`, t => {
        t.test(`very nested`, t => {
            t.eq({foo: 'bar'}, {foo: 'baz'}, 'does not match, does it?');
        });
    });
}