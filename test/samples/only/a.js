export default t => {
    t.only('should run', t => {

        t.test('should not run', t => {
            t.fail('should not have run');
        });

        t.only('should run nested', t => {
            t.ok(true);
        });
    });

    t.test('should not run', t => {
        t.fail('should not have run');
    });
}