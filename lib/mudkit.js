// process until GA, which is used to indicate next prompt
// show data prior to GA unmixed with user input

import net from 'net';
import {PassThrough} from 'stream';

import InflateStream from './streams/inflate.js';

import CommandParser from './handlers/parsers/commands.js';
import ControlParser from './handlers/parsers/controls.js';
import OutputParser from './handlers/parsers/output.js';

import {COMMANDS, COMMAND_NAMES} from './helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from './helpers/telnet-options.js';

import {charCode} from './helpers/strings.js';

import Line from './models/line.js';

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
                encoding: 'utf8',
                gmcp: {}
            },
            env: {
                mssp: {},
                rows: [0, 24],
                cols: [0, 80]
            },
            line: new Line(this)
        }

        this.dataStream = new PassThrough();
        this.inflateStream = new InflateStream({}, this, this.dataStream);

        this.setup();

        this.dataStream.on('data', this.onData);
        this.dataStream.on('error', this.onError);
    }

    setup() {
        const commandParser = new CommandParser(this);
        const controlParser = new ControlParser(this);
        // const colorParser = new ColorParser(this);
        // const mxpParser = new MXPParser(this);
        const outputParser = new OutputParser(this);

        this.onData = (data) => {
            let output = data;

            console.log(data);

            output = commandParser.parse(output);
            output = controlParser.parse(output);

            outputParser.parse(output);
        };
    }

    enableMCCP() {
        this.terminal.state.mccp = true;
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

    sendText(text) {
        const bytes = charCode(text);

        console.log(`SEND: ${text}`, bytes);
        this.connection.write(Buffer.from(bytes));
    }

    print(options = {}) {
        if (!this.terminal.line.text) {
            return;
        }

        const line = this.terminal.line.toString();

        this.output(line);

        if (options.newLine) {
            this.terminal.line.next();
        } else {
            this.terminal.line.nextChunk();
        }
    }

    output(chunk) {
        // process.stdout.write(chunk);
        console.log(chunk);
    }

}

export default MUDKit;
