import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function gcmpHandler(command, telnetClient) {
    if (command.toString() === 'IAC WILL GCMP') {
        telnetClient.send(['IAC', 'DONT', 'GCMP']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
