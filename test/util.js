const stubBehavior = {
    addCall(...args) {
        this.callList.push(...args);
    },
    argsFor(call = 0) {
        return this.callList[call];
    }
};

export const stubFn = () => {
    const callList = [];
    const fn = function (...args) {
        fn.addCall(args);
        return fn;
    };

    Object.assign(fn, stubBehavior);

    return Object.defineProperties(fn, {
        callList: {value: callList},
        callCount: {
            get() {
                return callList.length;
            }
        }
    });
};

export const fakeKleur = () => {

};
