import Parser from '../../models/parser.js';
import Command from '../../models/command.js';

import {COMMANDS, COMMAND_NAMES} from '../../helpers/commands.js';
import {
    TELNET_OPTIONS,
    TELNET_OPTION_NAMES,
    TTYPE_OPTIONS,
    TTYPE_OPTION_NAMES
} from '../../helpers/telnet-options.js';

export default class CommandParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);

        let command = null;

        this.parse = (async function* parseCommands(chunk) {
            for await (const byte of chunk) {
                if (!command && byte !== COMMANDS.IAC) {
                    yield byte;
                    continue;
                }

                if (!command) {
                    command = new Command();
                }

                command.add(byte);

                if (command.isComplete) {
                    await this.routeCommand(command);
                    command = null;
                }
            }
        }).bind(this);
    }

    async routeCommand(command) {
        console.log(command.toString());

        switch (command.option) {
        case 'GA':
            console.log('GA');
            return;
        case 'COMPRESS':
        case 'COMPRESS2':
        case 'ECHO':
        case 'GMCP':
        case 'MSSP':
        case 'MXP':
        case 'NAWS':
        case 'NEW-ENVIRON':
        case 'TTYPE':
        case 'ZMP':
            const handler = (await import(`./commands/${command.option.toLowerCase()}.js`)).default;

            handler(command, this.telnetClient);
            break;
        default:
            console.log('** MISSING OPTION: ', command.option, command.bytes)
        }
    }

}
