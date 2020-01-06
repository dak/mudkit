// process until GA, which is used to indicate next prompt
// show data prior to GA unmixed with user input

import net from 'net';

import CommandParser from './handlers/parsers/commands.js';
import LineParser from './handlers/parsers/lines.js';
import OutputParser from './handlers/parsers/output.js';

import {COMMANDS, COMMAND_NAMES} from './helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from './helpers/telnet-options.js';

// https://mudhalla.net/tintin/protocols/mtts/
// ANSI (1), VT100 (2), UTF-8 (4), 256 Colors (8)
// OSC Color Palette (32), True Color (256), MNES (512)
const TERMINAL_TYPE = 'MTTS 815';

const CLIENT_NAME = 'MUDKIT';
const CLIENT_VERSION = '0.1.0'; // read from package.json
const CHARSET = 'UTF-8';
const MTTS = '815';
const IPADDRESS = '127.0.0.1'; // TODO: get ip address

const DISCWORLD = {
    host: 'discworld.starturtle.net',
    port: 4242
};

class MUDKit {

    constructor() {
        this.state = {
            mtts: 0,
            mccp: false,
            color: 'normal'
        };

        this.env = {
            terminal: {
                rows: [0, 24],
                cols: [0, 80]
            }
        };

        this.encoding = 'utf8';

        this.setup();
    }

    setup() {
        const lineParser = new LineParser(this);
        const commandParser = new CommandParser(this);
        // const colorParser = new ColorParser(this);
        // const mxpParser = new MXPParser(this);
        const outputParser = new OutputParser(this);

        this.onData = (data) => {
            let lines = lineParser.parse(data);

            lines = commandParser.parse(data);

            outputParser.parse(lines);
        };
    }

    connect() {
        this.connection = net.connect({
            host: DISCWORLD.host, // TODO: or host flag
            port: DISCWORLD.port // TODO: or port flag
        }, this.onConnect);

        this.connection.on('data', this.onData);
        this.connection.on('error', this.onError);
    }

    onConnect() {
        console.log('connected...');
    }

    onError(err) {
        console.log(err);
    }

}

const mudkit = new MUDKit();

mudkit.connect();
