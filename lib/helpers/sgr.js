import {regexify} from './regex.js';

// https://i.stack.imgur.com/9UVnC.png
const COLORS = {
    BLACK:          {FG: 30, BG: 40,  RGB: [ 78,  78,  78]},
    RED:            {FG: 31, BG: 41,  RGB: [255, 108,  96]},
    GREEN:          {FG: 32, BG: 42,  RGB: [168, 255,  96]},
    YELLOW:         {FG: 33, BG: 43,  RGB: [255, 255, 182]},
    BLUE:           {FG: 34, BG: 44,  RGB: [150, 203, 254]},
    MAGENTA:        {FG: 35, BG: 45,  RGB: [255, 115, 253]},
    CYAN:           {FG: 36, BG: 46,  RGB: [198, 197, 254]},
    WHITE:          {FG: 37, BG: 47,  RGB: [238, 238, 238]},

    BRIGHT_BLACK:   {FG: 90, BG: 100, RGB: [124, 124, 124]},
    BRIGHT_RED:     {FG: 91, BG: 101, RGB: [255, 182, 176]},
    BRIGHT_GREEN:   {FG: 92, BG: 102, RGB: [206, 255, 172]},
    BRIGHT_YELLOW:  {FG: 93, BG: 103, RGB: [255, 255, 203]},
    BRIGHT_BLUE:    {FG: 94, BG: 104, RGB: [181, 220, 254]},
    BRIGHT_MAGENTA: {FG: 95, BG: 105, RGB: [255, 156, 254]},
    BRIGHT_CYAN:    {FG: 96, BG: 106, RGB: [223, 223, 254]},
    BRIGHT_WHITE:   {FG: 97, BG: 107, RGB: [255, 255, 255]}
};

const COLORS_BY_CODE = Object.values(COLORS).reduce((acc, val) => {
    acc[val.FG] = acc[val.BG] = {
        r: val.RGB[0],
        g: val.RGB[1],
        b: val.RGB[2]
    };

    return acc;
}, {});

const DEFAULT_FG = {
    r: COLORS.WHITE.RGB[0],
    g: COLORS.WHITE.RGB[1],
    b: COLORS.WHITE.RGB[2]
};
const DEFAULT_BG = {
    r: COLORS.BLACK.RGB[0],
    g: COLORS.BLACK.RGB[1],
    b: COLORS.BLACK.RGB[2]
};

const RGB = new RegExp('(?<r>.*);(?<g>.*);(?<b>.*)');
const CODE = new RegExp('(?<code>.*)');

const FG_4 = new RegExp('(?<fg>(?:3|9)[0-7])');
const BG_4 = new RegExp('(?<bg>(?:4|10)[0-7])');

const SGR_REGEXES = regexify({
    // 24-bit
    FG_24: ['38;2;', RGB],
    BG_24: ['48;2;', RGB],

    // 8-bit
    FG_8:  ['38;5;', CODE],
    BG_8:  ['48;5;', CODE],

    // 4-bit
    FG_BG_4: [`${FG_4};${BG_4}`],
    FG_4:    [FG_4],
    BG_4:    [BG_4],

    // Other SGR
    RESET: ['0'],
    BOLD: ['1'],
    FAINT: ['2'],
    ITALIC: ['3'],
    UNDERLINE: ['4'],
    SLOW_BLINK: ['5'],
    RAPID_BLINK: ['6'],
    INVERSE: ['7'], // Reverse FG and BG
    CONCEAL: ['8'],
    STRIKETHROUGH: ['9'],
    PRIMARY_FONT: ['10'],
    ALTERNATIVE_FONT_1: ['11'],
    ALTERNATIVE_FONT_2: ['12'],
    ALTERNATIVE_FONT_3: ['13'],
    ALTERNATIVE_FONT_4: ['14'],
    ALTERNATIVE_FONT_5: ['15'],
    ALTERNATIVE_FONT_6: ['16'],
    ALTERNATIVE_FONT_7: ['17'],
    ALTERNATIVE_FONT_8: ['18'],
    ALTERNATIVE_FONT_9: ['19'],
    FRAKTUR: ['20'],
    DOUBLE_UNDERLINE: ['21'],
    NORMAL_FONT_WEIGHT: ['22'],
    NO_ITALIC_NO_FRAKTUR: ['23'],
    NO_UNDERLINE: ['24'],
    NO_BLINK: ['25'],
    NO_INVERSE: ['27'],
    NO_CONCEAL: ['28'],
    NO_STRIKETHROUGH: ['29'],
    DEFAULT_FG: ['39'],
    DEFAULT_BG: ['49'],
    FRAMED: ['51'],
    ENCIRCLED: ['52'],
    OVERLINED: ['53'],
    NO_FRAME_NO_ENCIRCLE: ['54'],
    NO_OVERLINE: ['55']
});

export function sgrMatch(bytes) {
    const byteString = String.fromCharCode(...bytes.split(' '));

    let sgr = {};

    findMatch:
    for (const [key, value] of Object.entries(SGR_REGEXES)) {
        let match = byteString.match(value);

        if (match) {
            // TODO: MAP SGR to obj for non-colors to reduce switch code
            switch (key) {
            case 'RESET':
                sgr = {
                    bold: false,
                    faint: false,
                    italic: false,
                    underline: false,
                    slowBlink: false,
                    rapidBlink: false,
                    inverse: false,
                    conceal: false,
                    strikethrough: false,
                    fraktur: false,
                    doubleUnderline: false,
                    framed: false,
                    encircled: false,
                    overlined: false,
                    color: DEFAULT_FG,
                    backgroundColor: DEFAULT_BG
                };
                break findMatch;
            case 'BOLD':
                sgr = {
                    bold: true
                };
                break findMatch;
            case 'FAINT':
                sgr = {
                    faint: true
                };
                break findMatch;
            case 'ITALIC':
                sgr = {
                    italic: true
                };
                break findMatch;
            case 'UNDERLINE':
                sgr = {
                    underline: true
                };
                break findMatch;
            case 'SLOW_BLINK':
                sgr = {
                    slowBlink: true
                };
                break findMatch;
            case 'RAPID_BLINK':
                sgr = {
                    rapidBlink: true
                };
                break findMatch;
            case 'DEFAULT_FG':
                sgr = {
                    color: DEFAULT_FG
                };
                break findMatch;
            case 'DEFAULT_BG':
                sgr = {
                    color: DEFAULT_BG
                };
                break findMatch;
            case 'FG_24':
                sgr = {
                    color: {
                        r: match.groups.r,
                        g: match.groups.g,
                        b: match.groups.b
                    }
                };
                break findMatch;
            case 'BG_24':
                sgr = {
                    backgroundColor: {
                        r: match.groups.r,
                        g: match.groups.g,
                        b: match.groups.b
                    }
                };
                break findMatch;
            case 'FG_8':
                console.log('TODO: FG_8', bytes);
                break findMatch;
            case 'BG_8':
                console.log('TODO: BG_8', bytes);
                break findMatch;
            case 'FG_BG_4':
                sgr = {
                    color: COLORS_BY_CODE[match.groups.fg],
                    backgroundColor: COLORS_BY_CODE[match.groups.bg]
                };
                break findMatch;
            case 'FG_4':
                sgr = {
                    color: COLORS_BY_CODE[match.groups.fg]
                };
                break findMatch;
            case 'BG_4':
                sgr = {
                    backgroundColor: COLORS_BY_CODE[match.groups.bg]
                };
                break findMatch;
            default:
                console.log('** MISSING SGR:', bytes);
                break findMatch;
            }
        }
    }

    return sgr;
}
