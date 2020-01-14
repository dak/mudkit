import {
    CONTROLS,
    CONTROL_NAMES,
    CONTROL_SEQUENCE_REGEXES
} from '../helpers/controls.js';

export default class ControlCode {

    constructor() {
        this.bytes = [];
    }

    add(byte) {
        this.bytes.push(byte);
    }

    toString() {
        return this.bytes.map((byte) => {
            return CONTROL_NAMES[byte] || byte;
        }).join(' ');
    }

    matchSequence() {
        let key = null;
        let groups = null;
        const byteString = this.bytes.join(' ');

        for (const [key, value] of Object.entries(CONTROL_SEQUENCE_REGEXES)) {
            let match = byteString.match(value);

            if (match) {
                return {
                    sequence: key,
                    groups: match.groups
                };
            }
        }

        return null;
    }

    get isEscapeSequence() {
        return this.bytes[0] === CONTROLS.ESC && (
            this.bytes[1] === 'c' || // RIS, Reset terminal to initial state
            this.bytes[1] === '7' || // DECSC, Save cursor position
            this.bytes[1] === '8' || // DECRC, Restore cursor position
            this.bytes[1] === '>' || // DECPNM, Set numeric keypad mode
            this.bytes[1] === '=' || // DECPAM, Set application keypad mode
            this.bytes[1] === '['    // CSI, Control Sequence Introducer
        );
    }

    get isComplete() {
        return !!this.matchSequence();
    }

}
