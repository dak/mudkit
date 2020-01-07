import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function zmpHandler(command, telnetClient) {
    if (command.toString() === 'IAC WILL ZMP') {
        telnetClient.send(['IAC', 'DONT', 'ZMP']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
