import {regexify} from './regex.js';

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

const CSI = [CONTROLS.ESC, '[']; // Control Sequence Introducer
const SEQUENCE = new RegExp(`(?<sequence>.*)`);

export const CONTROL_SEQUENCE_REGEXES = regexify({
    // Control Codes
    Bel: [CONTROLS.BEL], // Ring the terminal bell
    BS:  [CONTROLS.BS],  // Backspace
    HT:  [CONTROLS.HT],  // Tab
    LF:  [CONTROLS.LF],  // Linefeed
    CR:  [CONTROLS.CR],  // Carriage return

    MXP: [CSI, SEQUENCE, 'z'], // MXP Tag

    // SGR Sequence
    SGR: [CSI, SEQUENCE, 'm'],

    // Escape Sequences
    RIS:    [CONTROLS.ESC, 'c'], // Reset terminal to initial state
    DECSC:  [CONTROLS.ESC, 7],   // Save cursor position
    DECRC:  [CONTROLS.ESC, 8],   // Restore cursor position
    DECPNM: [CONTROLS.ESC, '>'], // Set numeric keypad mode
    DECPAM: [CONTROLS.ESC, '='],  // Set application keypad mode

    // ECMA-48 CSI Sequences
    ICH:     [CSI, SEQUENCE, '@'], // Insert Pn blank characters
    CUU:     [CSI, SEQUENCE, 'A'], // Move cursor up Pn rows
    CUD:     [CSI, SEQUENCE, 'B'], // Move cursor down Pn rows
    CUF:     [CSI, SEQUENCE, 'C'], // Move cursor forward Pn columns
    CUB:     [CSI, SEQUENCE, 'D'], // Move cursor backward Pn columns
    CNL:     [CSI, SEQUENCE, 'E'], // Move cursor down Pn rows, to column 1
    CPL:     [CSI, SEQUENCE, 'F'], // Move cursor up Pn rows, to column 1
    CHA:     [CSI, SEQUENCE, 'G'], // Move cursor to column Pn
    CUP:     [CSI, SEQUENCE, 'H'], // Move cursor to row Pn1, and column Pn2
    ED:      [CSI, SEQUENCE, 'J'], // 0 erase from cursor to end of display, 1 erase from start of display to cursor, 2 erase display
    EL:      [CSI, SEQUENCE, 'K'], // 0 erase from cursor to end of line, 1 erase from start of line to cursor, 2 erase line
    IL:      [CSI, SEQUENCE, 'L'], // Insert Pn blank lines
    DL:      [CSI, SEQUENCE, 'M'], // Delete Pn lines
    DCH:     [CSI, SEQUENCE, 'P'], // Delete Pn characters
    ECH:     [CSI, SEQUENCE, 'X'], // Erase Pn characters
    DECSTBM: [CSI, SEQUENCE, 'r']  // Set scrolling region between top row Pn1 and bottom row Pn2
}, {charCode: true});
