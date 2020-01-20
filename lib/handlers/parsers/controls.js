import Parser from '../../models/parser.js';
import Control from '../../models/control.js';
import SGRParser from './sgr.js';

import {
    CONTROLS,
    CONTROL_NAMES
} from '../../helpers/controls.js';

export default class ControlParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);

        this.sgrParser = new SGRParser(telnetClient);

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
            return control.bytes;
        case 'SGR':
            return this.sgrParser.parse(match.groups.sequence);
        default:
            console.log('** MISSING CONTROL: ', control.bytes);
        }
    }

}
