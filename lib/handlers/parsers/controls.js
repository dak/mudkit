import Parser from '../../models/parser.js';
import Control from '../../models/control.js';

import {
    CONTROLS,
    CONTROL_NAMES
} from '../../helpers/controls.js';

export default class ControlParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);

        let control = null;

        this.parse = (async function* parseControls(chunk) {
            for await (const byte of chunk) {
                if (!control && !Object.values(CONTROLS).includes(byte)) {
                    yield byte;
                    continue;
                }

                if (!control) {
                    control = new Control();
                }

                control.add(byte);

                if (control.isComplete) {
                    const bytes = await this.routeControl(control);

                    if (bytes) {
                        yield bytes;
                    }

                    control = null;
                }
            }
        }).bind(this);
    }

    async routeControl(control) {
        const match = control.matchSequence();

        switch (match.sequence) {
        case 'LF':
            return control.bytes;
        case 'CR':
            break;
        case 'MXP':
            const str = String.fromCharCode(...match.groups.tag.split(' '));

            console.log('MXP TAG NUMBER: ', str);
            break;
        case 'FG_TRUECOLOR':
            // terminal.setColor({
            //     r: match.groups.r,
            //     g: match.groups.g,
            //     b: match.groups.b
            // });
            break;
        case 'BG_TRUECOLOR':
            // terminal.setBackground({
            //     r: match.groups.r,
            //     g: match.groups.g,
            //     b: match.groups.b
            // });
            break;
        default:
            console.log('** MISSING CONTROL: ', control.bytes)
        }
    }

}
