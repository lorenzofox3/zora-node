export default t => {
    t.skip('fail if not skipped', t => {
        t.fail('should not run');
    });

    t.test('run', t => {
        t.skip('fail', t => {
            t.fail('should not run');
        });

        t.ok(true);
    });

    t.ok(true);
};
