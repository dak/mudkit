// http://www.zuggsoft.com/zmud/mcp.htm

import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';

export default function compress2Handler(command, telnetClient) {
    switch (command.toString()) {
    case 'IAC WILL COMPRESS2':
        telnetClient.send(['IAC', 'DO', 'COMPRESS2']);
        return;
    case 'IAC SB COMPRESS2 IAC SE':
        telnetClient.enableMCCP();
        return;
    default:
        console.log('Unhandled: ', command.option, command.bytes);
    }
}
