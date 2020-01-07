import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function compressHandler(command, telnetClient) {
    if (command.toString() === 'IAC WILL COMPRESS') {
        telnetClient.send(['IAC', 'DONT', 'COMPRESS']);
        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
