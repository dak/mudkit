import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function newEnvironHandler(command, telnetClient) {
    if (command.toString() === 'IAC DO NEW_ENVIRON') {
        telnetClient.send(['IAC', 'WONT', 'NEW_ENVIRON']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
