import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function compress2Handler(command, telnetClient) {
    if (command.toString() === 'IAC WILL MSSP') {
        telnetClient.send(['IAC', 'DONT', 'MSSP']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}