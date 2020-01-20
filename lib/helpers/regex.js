import {charCode} from './strings.js';

export function regexify(obj, options = {}) {
    for (const [key, value] of Object.entries(obj)) {
        obj[key] = new RegExp('^' + value.flat().map((entry) => {
            if (options.charCode && typeof entry === 'string') {
                return charCode(entry);
            }

            return entry; // RegExp or Number
        }).flat().reduce((acc, val) => {
            if (!acc) {
                if (val instanceof RegExp) {
                    return val.source;
                }

                return val;
            }

            if (val instanceof RegExp) {
                return `${acc} ${val.source}`;
            }

            return `${acc} ${val}`;
        }, '') + '$');
    }

    return obj;
}
