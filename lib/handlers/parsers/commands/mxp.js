import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function mxpHandler(command, telnetClient) {
    if (command.toString() === 'IAC DO MXP') {
        telnetClient.send(['IAC', 'WONT', 'MXP']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
