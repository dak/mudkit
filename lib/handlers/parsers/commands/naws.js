import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function nawsHandler(command, telnetClient) {
    if (command.toString() === 'IAC DO NAWS') {
        telnetClient.send(['IAC', 'WILL', 'NAWS']);
        telnetClient.send(['IAC', 'SB', 'NAWS', 0, 80, 0, 24, 'IAC', 'SE']); // TODO: Use Mudkit variables
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
