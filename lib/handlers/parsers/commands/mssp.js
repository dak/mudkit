import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {
    TELNET_OPTIONS,
    TELNET_OPTION_NAMES,
    MSSP_OPTIONS,
    MSSP_OPTION_NAMES
} from '../../../helpers/telnet-options.js';

import util from 'util';

export default function compress2Handler(command, telnetClient) {
    if (command.toString() === 'IAC WILL MSSP') {
        telnetClient.send(['IAC', 'DO', 'MSSP']);
        return;
    }

    if (command.isSubCommand) {
        const mssp = {};
        let midBytes = command.bytes.slice(3, -2);
        let current = '';
        let mssp_var = '';
        let mssp_val = '';

        for (const byte of midBytes) {
            if (byte === MSSP_OPTIONS['MSSP_VAR']) {
                if (current === 'mssp_val') {
                    mssp[mssp_var] = mssp_val;
                    mssp_val = '';
                }

                mssp_var = '';
                current = 'mssp_var';
            } else if (byte === MSSP_OPTIONS['MSSP_VAL']) {
                if (current === 'mssp_val') {
                    if (typeof mssp_val === 'string') {
                        mssp_val = [mssp_val, ''];
                    } else if (Array.isArray(mssp_val)) {
                        mssp_val.push('');
                    }
                } else {
                    mssp_val = '';
                    current = 'mssp_val';
                }
            } else {
                if (current === 'mssp_var') {
                    mssp_var += String.fromCharCode(byte);
                } else if (current === 'mssp_val') {
                    if (typeof mssp_val === 'string') {
                        mssp_val += String.fromCharCode(byte);
                    } else if (Array.isArray(mssp_val)) {
                        mssp_val[mssp_val.length - 1] += String.fromCharCode(byte);
                    }
                }
            }
        }

        telnetClient.terminal.env.mssp = mssp;

        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
