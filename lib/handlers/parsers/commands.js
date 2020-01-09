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

        this.parse = (async function* parseCommands(chunk) {
            let command = null;

            for await (const byte of chunk) {
                if (!command && byte !== COMMANDS.IAC) {
                    yield byte;
                    continue;
                }

                command = command || new Command();
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
            return;
        case 'COMPRESS':
        case 'COMPRESS2':
        case 'ECHO':
        case 'GCMP':
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
