export const ASCII_CODES = {
    BEL: 7,
    BS:  8,  // Backspace
    HT:  9,  // Horizontal Tab
    LF:  10, // Linefeed
    VT:  11, // Vertical Tab
    FF:  12, // Formfeed (or NP: New page)
    CR:  13, // Carriage return
    ESC: 27, // Escape
    DEL: 127 // Delete
};

export const ASCII_CODE_NAMES = Object.keys(ASCII_CODES).reduce((out, key) => {
    const value = ASCII_CODES[key];
    out[value] = key.toLowerCase();
    return out;
}, {});
