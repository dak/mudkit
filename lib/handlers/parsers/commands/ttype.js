// RFC 930, 1091

import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {
    TELNET_OPTIONS,
    TELNET_OPTION_NAMES,
    TTYPE_OPTIONS,
    TTYPE_OPTION_NAMES
} from '../../../helpers/telnet-options.js';
import {charCode} from '../../../helpers/strings.js';

export default function ttypeHandler(command, telnetClient) {
    switch (command.toString()) {
    case 'IAC DO TTYPE':
        telnetClient.send(['IAC', 'WILL', 'TTYPE']);
        return;
    case 'IAC SB TTYPE SEND IAC SE':
        telnetClient.send([
            'IAC',
            'SB',
            'TTYPE',
            TTYPE_OPTIONS['IS'],
            charCode('MTTS 815'),
            'IAC',
            'SE'
        ].flat());
        return;
    default:
        console.log('Unhandled: ', command.option, command.bytes);
    }
}
