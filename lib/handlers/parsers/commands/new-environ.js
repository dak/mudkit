import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {
    TELNET_OPTIONS,
    TELNET_OPTION_NAMES,
    NEW_ENVIRON_OPTIONS
} from '../../../helpers/telnet-options.js';
import {charCode} from '../../../helpers/strings.js';

export default function newEnvironHandler(command, telnetClient) {
    if (command.toString() === 'IAC DO NEW-ENVIRON') {
        telnetClient.send(['IAC', 'WILL', 'NEW-ENVIRON']);
        return;
    }

    // TODO: Support responding to specific variable requests
    if (command.isSubCommand) {
        // Assume for now request was for all vars

        // IAC   SB NEW-ENVIRON IS   VAR "CLIENT_NAME" VAL "TINTIN++" IS   VAR "CHARSET" VAL "UTF-8" IAC SE

        telnetClient.send([
            'IAC',
            'SB',
            'NEW-ENVIRON',
            NEW_ENVIRON_OPTIONS['IS'],
            NEW_ENVIRON_OPTIONS['VAR'],
            charCode('CHARSET'),
            NEW_ENVIRON_OPTIONS['VAL'],
            charCode('UTF-8'),

            NEW_ENVIRON_OPTIONS['IS'],
            NEW_ENVIRON_OPTIONS['VAR'],
            charCode('CLIENT_NAME'),
            NEW_ENVIRON_OPTIONS['VAL'],
            charCode('MUDKIT'),

            NEW_ENVIRON_OPTIONS['IS'],
            NEW_ENVIRON_OPTIONS['VAR'],
            charCode('CLIENT_VERSION'),
            NEW_ENVIRON_OPTIONS['VAL'],
            charCode('0.0.1-SNAPSHOT'), // TODO: Load from package.json or Mudkit object

            // NEW_ENVIRON_OPTIONS['IS'],
            // NEW_ENVIRON_OPTIONS['VAR'],
            // charCode('IPADDRESS'),
            // NEW_ENVIRON_OPTIONS['VAL'],
            // charCode('127.0.0.1'),

            NEW_ENVIRON_OPTIONS['IS'],
            NEW_ENVIRON_OPTIONS['VAR'],
            charCode('MTTS'),
            NEW_ENVIRON_OPTIONS['VAL'],
            813,

            NEW_ENVIRON_OPTIONS['IS'],
            NEW_ENVIRON_OPTIONS['VAR'],
            charCode('TERMINAL_TYPE'),
            NEW_ENVIRON_OPTIONS['VAL'],
            charCode('ANSI-TRUECOLOR'),

            'IAC',
            'SE'
        ].flat());

        return;
    }

    console.log('Unhandled: ', command.option, command.bytes);
}
