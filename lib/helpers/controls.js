import {charCode} from './strings.js';

export const CONTROLS = {
    BEL: 7,  // Bell
    BS:  8,  // Backspace
    HT:  9,  // Horizontal Tab
    LF:  10, // Linefeed
    VT:  11, // Vertical Tab
    FF:  12, // Formfeed (or NP: New page)
    CR:  13, // Carriage return
    ESC: 27, // Escape
    DEL: 127 // Delete
};

export const CONTROL_NAMES = Object.keys(CONTROLS).reduce((out, key) => {
    const value = CONTROLS[key];

    out[value] = key.toLowerCase();

    return out;
}, {});


function regexify(obj) {
    for (const [key, value] of Object.entries(obj)) {
        obj[key] = new RegExp('^' + value.flat().map((entry) => {
            if (typeof entry === 'string') {
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

const CSI = [CONTROLS.ESC, '[']; // Control Sequence Introducer
const BYTE = '(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])';
const RGB = new RegExp(`(?<r>${BYTE}) (?<g>${BYTE}) (?<b>${BYTE})`);
const ANSI_COLOR = new RegExp(`(?<ansi>${BYTE})`);
const Pn = new RegExp(`(?<Pn>${BYTE})`);
const Pn1 = new RegExp(`(?<Pn1>${BYTE})`);
const Pn2 = new RegExp(`(?<Pn2>${BYTE})`);
const MXP_TAG_NUMBER = new RegExp(`(?<tag>${BYTE}(?: ${BYTE})?)`);

export const CONTROL_SEQUENCE_REGEXES = regexify({
    // Control Codes
    Bel: [CONTROLS.BEL], // Ring the terminal bell
    BS:  [CONTROLS.BS],  // Backspace
    HT:  [CONTROLS.HT],  // Tab
    LF:  [CONTROLS.LF],  // Linefeed
    CR:  [CONTROLS.CR],  // Carriage return

    MXP: [CSI, MXP_TAG_NUMBER, 'z'], // MXP Tag

    // CSI Color Sequences
    FG_256:       [CSI, 38, 5, ANSI_COLOR, 'm'],
    BG_256:       [CSI, 48, 5, ANSI_COLOR, 'm'],
    FG_TRUECOLOR: [CSI, 38, 2, RGB, 'm'],
    BG_TRUECOLOR: [CSI, 48, 2, RGB, 'm'],

    // Escape Sequences
    RIS:    [CONTROLS.ESC, 'c'], // Reset terminal to initial state
    DECSC:  [CONTROLS.ESC, 7],   // Save cursor position
    DECRC:  [CONTROLS.ESC, 8],   // Restore cursor position
    DECPNM: [CONTROLS.ESC, '>'], // Set numeric keypad mode
    DECPAM: [CONTROLS.ESC, '='],  // Set application keypad mode

    // ECMA-48 CSI Sequences
    ICH:     [CSI, Pn, '@'], // Insert Pn blank characters
    CUU:     [CSI, Pn, 'A'], // Move cursor up Pn rows
    CUD:     [CSI, Pn, 'B'], // Move cursor down Pn rows
    CUF:     [CSI, Pn, 'C'], // Move cursor forward Pn columns
    CUB:     [CSI, Pn, 'D'], // Move cursor backward Pn columns
    CNL:     [CSI, Pn, 'E'], // Move cursor down Pn rows, to column 1
    CPL:     [CSI, Pn, 'F'], // Move cursor up Pn rows, to column 1
    CHA:     [CSI, Pn, 'G'], // Move cursor to column Pn
    CUP:     [CSI, Pn1, Pn2, 'H'], // Move cursor to row Pn1, and column Pn2
    ED:      [CSI, Pn, 'J'], // 0 erase from cursor to end of display, 1 erase from start of display to cursor, 2 erase display
    EL:      [CSI, Pn, 'K'], // 0 erase from cursor to end of line, 1 erase from start of line to cursor, 2 erase line
    IL:      [CSI, Pn, 'L'], // Insert Pn blank lines
    DL:      [CSI, Pn, 'M'], // Delete Pn lines
    DCH:     [CSI, Pn, 'P'], // Delete Pn characters
    ECH:     [CSI, Pn, 'X'], // Erase Pn characters
    DECSTBM: [CSI, Pn1, Pn2, 'r'] // Set scrolling region between top row Pn1 and bottom row Pn2
});
