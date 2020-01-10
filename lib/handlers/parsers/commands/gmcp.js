import {COMMANDS, COMMAND_NAMES} from '../../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../../helpers/telnet-options.js';
import {charCode} from '../../../helpers/strings.js';

export default function gcmpHandler(command, telnetClient) {
    if (command.toString() === 'IAC WILL GMCP') {
        telnetClient.send(['IAC', 'DO', 'GMCP']);
        telnetClient.send([
            'IAC',
            'SB',
            'GMCP',
            charCode('core.hello {"client": "MUDKIT", "version": "0.0.1-SNAPSHOT"}'),
            'IAC',
            'SE'
        ].flat());
        telnetClient.send([
            'IAC',
            'SB',
            'GMCP',
            charCode('core.supports.set ["char.login", "char.info", "char.vitals", "room.info", "room.map", "room.writtenmap"]'),
            'IAC',
            'SE'
        ].flat());
        return;
    }

    if (command.toString() === 'IAC WONT GMCP') {
        // Dump all state and wait for next WILL GMCP
        return;
    }

    if (command.isSubCommand) {
        let sigBytes = command.bytes.slice(3, -2);

        sigBytes = String.fromCharCode(...sigBytes);

        let match = sigBytes.split(/ (.*)/);
        let packageCommand = match[0];
        let packageData = JSON.parse(match[1]);

        telnetClient.terminal.state.gmcp[packageCommand] = packageData;

        return;
    }

    // TODO: Dump all state on reconnect

    console.log('Unhandled: ', command.option, command.bytes);
}
