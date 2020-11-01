const TestFilePrototype = {
    [Symbol.iterator]() {
        return this.failureList[Symbol.iterator]();
    },
    incrementSuccess() {
        this.success++;
    },
    incrementFailure() {
        this.failure++;
    },
    incrementSkip() {
        this.skip++;
    },
    writeLine() {
        this.out.clearLine(0);
        this.out.cursorTo(0);
        
        const statusSymbol = (this.failure > 0 ? ' ✖' : (this.skip > 0 ? ' ⚠' : ' ✔'));
        const style = (this.failure > 0 ? 'failureBadge' : (this.skip > 0 ? 'skipBadge' : 'successBadge'));
        
        let summaryString = `${this.success}/${this.total} `;
        
        summaryString = `${statusSymbol}${summaryString.padStart(8)}`;
        
        this.out.writeLine(`${this.out[style](summaryString)} ${this.out.path(this.file)}`, 1);
    },
    goIn(path) {
        this.path.push(path);
    },
    goOut() {
        this.path.pop();
    },
    addFailure(data) {
        const path = [...this.path];
        this.failureList.push({path, data});
    }
};

export const testFile = (file, out) => {
    let success = 0;
    let failure = 0;
    let skip = 0;
    const path = [file];
    const failureList = [];
    
    return Object.create(TestFilePrototype, {
        file: {
            value: file
        },
        out: {
            value: out
        },
        total: {
            get() {
                return success + failure + skip;
            }
        },
        success: {
            get() {
                return success;
            },
            set(val) {
                success = val;
            }
        },
        failure: {
            get() {
                return failure;
            },
            set(val) {
                failure = val;
            }
        },
        skip: {
            get() {
                return skip;
            },
            set(val) {
                skip = val;
            }
        },
        path: {value: path},
        failureList: {value: failureList}
    });
};
