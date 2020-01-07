// RFC 930, 1091

import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

const SEND = 1;
const IS = 0;

function charCode(str) {
    for (var arr = str.split(''), i = str.length - 1; i >= 0; i--) {
        arr[i] = arr[i].charCodeAt(0);
    }

    return arr;
};

export default function ttypeHandler(command, telnetClient) {
    switch (command.toString()) {
    case 'IAC DO TTYPE':
        telnetClient.send(['IAC', 'WILL', 'TTYPE']);
        return;
    case 'IAC SB TTYPE SEND IAC SE':
        telnetClient.send(['IAC', 'SB', 'TTYPE', IS, charCode('MTTS 815'), 'IAC', 'SE'].flat());
        return;
    default:
        console.log('Unhandled: ', command.option, command.bytes);
    }
}
