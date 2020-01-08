// process until GA, which is used to indicate next prompt
// show data prior to GA unmixed with user input

import net from 'net';
import {PassThrough} from 'stream';

import InflateStream from './streams/inflate.js';

import CommandParser from './handlers/parsers/commands.js';
import MCCPParser from './handlers/parsers/mccp.js';
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
        this.terminal = {
            support: {
                ansi: 1,
                utf8: 4,
                colors256: 8,
                oscColorPalette: 32,
                trueColor: 256,
                mnes: 512
            },
            state: {
                mtts: 813,
                mccp: false,
                encoding: 'utf8'
            },
            env: {
                color: 'normal',
                rows: [0, 24],
                cols: [0, 80]
            }
        }

        this.dataStream = new PassThrough();
        this.inflateStream = new InflateStream({}, this, this.dataStream);

        this.setup();

        this.dataStream.on('data', this.onData);
        this.dataStream.on('error', this.onError);
    }

    setup() {
        // const mccpParser = new MCCPParser(this);
        // const lineParser = new LineParser(this);
        const commandParser = new CommandParser(this);
        // const colorParser = new ColorParser(this);
        // const mxpParser = new MXPParser(this);
        const outputParser = new OutputParser(this);

        this.onData = (data) => {
            let output = data;

            // output = mccpParser.parse(output);
            // output = lineParser.parse(output);
            output = commandParser.parse(output);

            outputParser.parse(output);

            // goal, use stream transforms to get:
            // this.connection
            //     .pipe(mccpParser)
            //     .pipe(lineParser)
            //     .pipe(commandParser)
            //     .pipe(outputParser)
        };
    }

    enableMCCP() {
        this.terminal.state.mccp = true;

        // this.inflate = zlib.createInflate();

        // this.inflate.on('data', function (chunk) {
        //     mudkit.processChunk(chunk);
        // });
    }

    connect() {
        this.connection = net.connect({
            host: DISCWORLD.host, // TODO: or host flag
            port: DISCWORLD.port // TODO: or port flag
        }, this.onConnect);

        this.connection.pipe(this.inflateStream);
        this.connection.on('error', this.onError);

        process.stdin.on('data', (data) => { this.connection.write(data) });
    }

    onConnect() {
        console.log('connected...');
    }

    onError(err) {
        console.log(err);
    }

    send(command) {
        const bytes = command.map((byte) => COMMANDS[byte] || TELNET_OPTIONS[byte] || byte);

        console.log(`SEND: ${command.join(' ')}`, bytes);
        this.connection.write(Buffer.from(bytes));
    }

}

const mudkit = new MUDKit();

mudkit.connect();
