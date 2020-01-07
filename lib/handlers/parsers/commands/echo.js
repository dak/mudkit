import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function echoHandler(command, telnetClient) {
    if (command.toString() === 'IAC WILL ECHO') {
        telnetClient.send(['IAC', 'DONT', 'ECHO']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
