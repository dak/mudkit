import Parser from '../../models/parser.js';

import {COMMANDS, COMMAND_NAMES} from '../../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../../helpers/telnet-options.js';

export default class CommandParser extends Parser {

    constructor(client) {
        super(client);

        this.parse = (async function* parseCommands(chunk) {
            let command = null;
            let subnegotiation = false;

            for await (const byte of chunk) {
                if (command) {
                    command.push(COMMAND_NAMES[byte] || TELNET_OPTION_NAMES[byte]);

                    switch (byte) {
                    case COMMANDS.SB:
                        subnegotiation = true;
                    case COMMANDS.WILL:
                    case COMMANDS.WONT:
                    case COMMANDS.DO:
                    case COMMANDS.DONT:
                        continue;
                    case COMMANDS.SE:
                        subnegotiation = false;
                    default:
                        this.routeCommand(command);
                        command = null;
                    }
                } else if (byte === COMMANDS.IAC) {
                    command = ['IAC'];
                } else {
                    yield byte;
                }
            }
        }).bind(this);

        this.parse(Buffer.from([COMMANDS.IAC, COMMANDS.WILL, TELNET_OPTIONS.TTYPE]));
    }

    routeCommand(command) {
        console.log(command.join(' '));

        switch (command[command.length - 1]) {
        case 'COMPRESS2':
            // IAC WILL COMPRESS2
            this.send(['IAC', 'DO', 'COMPRESS2']);
            break;
        case 'GCMP':
            // IAC WILL GCMP
            this.send(['IAC', 'DO', 'GCMP']);
            break;
        case 'MSSP':
            // IAC WILL MSSP
            this.send(['IAC', 'DO', 'MSSP']);
            break;
        case 'MXP':
            // IAC DO MXP
            this.send(['IAC', 'WILL', 'MXP']);
            break;
        case 'NAWS':
            // IAC DO NAWS
            this.send(['IAC', 'WILL', 'NAWS']);
            break;
        case 'NEW_ENVIRON':
            // IAC DO NEW_ENVIRON
            this.send(['IAC', 'WILL', 'NEW_ENVIRON']);
            break;
        case 'TTYPE':
            // IAC DO TTYPE
            this.send(['IAC', 'WILL', 'TTYPE']);
            break;
        case 'ZMP':
            // IAC WILL ZMP
            this.send(['IAC', 'DO', 'ZMP']);
            break;
        default:
            console.log(`MISSING: ${command.join(' ')}`);
            return;
        }
    }

}
