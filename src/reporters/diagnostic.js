import {diffChars, diffJson} from 'diff';
import {EOL} from 'os';

export const valToTypeString = val => {
    const type = typeof val;
    switch (type) {
        case 'object': {
            if (val === null) {
                return null;
            }
            
            if (Array.isArray(val)) {
                return 'array';
            }
            
            return 'object';
        }
        default:
            return type;
    }
};

export const truthyDiagnostic = diag => ({
    report(out) {
        let val = diag.actual;
        
        if (val === '') {
            val = '""';
        }
        
        if (val === undefined) {
            val = 'undefined';
        }
        
        out.writeBlock(`expected a ${out.operator('TRUTHY')} value but got ${out.error(val)}`, 4);
    }
});

export const falsyDiagnostic = diag => ({
    report(out) {
        out.writeBlock(`expected a ${out.operator('FALSY')} value but got ${out.error(JSON.stringify(diag.actual))}`, 4);
    }
});

export const notEqualDiagnostic = () => ({
    report(out) {
        out.writeBlock(`expected values ${out.operator('NOT TO BE EQUIVALENT')} but they are`, 4);
    }
});

export const unknownOperatorDiagnostic = diag => ({
    report(out) {
        out.writeBlock(`(unknown operator: ${diag.operator})`, 4);
    }
});

export const isDiagnostic = () => ({
    report(out) {
        out.writeBlock(`expected values to point the ${out.operator('SAME REFERENCE')} but they don't`, 4);
    }
});

export const isNotDiagnostic = () => ({
    report(out) {
        out.writeBlock(`expected values to point ${out.operator('DIFFERENT REFERENCES')} but they point the same`, 4);
    }
});

export const countPadding = string => {
    let counter = 0;
    let i = 0;
    
    if (typeof string !== 'string') {
        return 0;
    }
    
    for (i; i < string.length; i++) {
        if (string[i] !== ' ') {
            return counter;
        }
        counter++;
    }
    return counter;
};

const writeNumberDifference = (out, actual, expected) => {
    out.writeBlock(`expected ${out.emphasis('number')} to be ${out.operator(expected)} but got ${out.error(actual)}`, 4);
};

const writeStringDifference = (out, actual, expected) => {
    const charDiffs = diffChars(actual, expected);
    const toRemove = charDiffs
        .filter(diff => !diff.added)
        .map(d => d.removed ? out.diffRemove(d.value) : out.diffSame(d.value))
        .join('');
    const toAdd = charDiffs
        .filter(diff => !diff.removed)
        .map(d => d.added ? out.diffAdd(d.value) : out.diffSame(d.value))
        .join('');
    
    out.writeBlock(`expected ${out.emphasis('string')} to be ${out.operator(expected)} but got the following differences:`, 4);
    out.writeBlock(`${out.error('-')} ${toRemove}`, 4);
    out.writeLine(`${out.success('+')} ${toAdd}`, 4);
};

const writeBooleanDifference = (out, actual, expected) => {
    out.writeBlock(`expected ${out.emphasis('boolean')} to be ${out.operator(expected)} but got ${out.error(actual)}`, 4);
};

export const expandNewLines = (val, curr) => {
    const {value} = curr;
    const flatten = value
        .split(EOL)
        .filter(v => v !== '')
        .map(p => Object.assign({}, curr, {
            value: p.trim(),
            padding: countPadding(p)
        }));
    
    val.push(...flatten);
    return val;
};

const writeObjectLikeDifference = type => (out, actual, expected) => {
    const diff = diffJson(actual, expected);
    const printDiffLines = diff => {
        if (diff.added) {
            return `${out.success('+')} ${' '.repeat(diff.padding)}${out.diffAdd(diff.value)}`;
        }
        if (diff.removed) {
            return `${out.error('-')} ${' '.repeat(diff.padding)}${out.diffRemove(diff.value)}`;
        }
        return `  ${' '.repeat(diff.padding)}${out.diffSame(diff.value)}`;
    };
    const lineDiffs = diff
        .reduce(expandNewLines, [])
        .map(printDiffLines);
    
    out.writeBlock(`expected ${out.emphasis(type)} to be ${out.operator('EQUIVALENT')} but got the following differences:`, 4);
    out.writeLine();
    for (const l of lineDiffs) {
        out.writeLine(l, 2);
    }
    
};
const writeObjectDifference = writeObjectLikeDifference('objects');
const writeArrayDifference = writeObjectLikeDifference('arrays');

export const equalDiagnostic = diag => {
    const {actual, expected} = diag;
    const expectedType = valToTypeString(expected);
    const actualType = valToTypeString(actual);
    const isSameType = actualType === expectedType;
    return {
        report(out) {
            if (isSameType === false) {
                out.writeBlock(`expected ${out.operator(`${expectedType} (${expected})`)} but got ${out.error(actualType)}`, 4);
            } else {
                switch (expectedType) {
                    case 'number':
                        writeNumberDifference(out, actual, expected);
                        break;
                    case 'string':
                        writeStringDifference(out, actual, expected);
                        break;
                    case 'boolean':
                        writeBooleanDifference(out, actual, expected);
                        break;
                    case 'object':
                        writeObjectDifference(out, actual, expected);
                        break;
                    case 'array':
                        writeArrayDifference(out, actual, expected);
                        break;
                    default:
                        out.writeBlock(`expected ${out.emphasis(expectedType)} to be ${out.operator('EQUIVALENT')} but they are not`, 4);
                }
            }
            
        }
    };
};

export const getDiagnosticReporter = diag => {
    switch (diag.operator) {
        case 'ok':
            return truthyDiagnostic(diag);
        case 'notOk':
            return falsyDiagnostic(diag);
        case 'notEqual':
            return notEqualDiagnostic();
        case 'is':
            return isDiagnostic();
        case 'isNot':
            return isNotDiagnostic();
        case 'equal':
            return equalDiagnostic(diag);
        default:
            return unknownOperatorDiagnostic(diag);
    }
};
