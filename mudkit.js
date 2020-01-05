// process until GA, which is used to indicate next prompt
// show data prior to GA unmixed with user input

import net from 'net';
import {StringDecoder} from 'string_decoder';

import {COMMANDS, COMMAND_NAMES} from './helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from './helpers/telnet-options.js';

const CLIENT = 'MUDKIT';

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
    }

    setup() {
        this.register([
            processLines,
            processCommand,
            processColor,
            processMXP,
            writeOutput
        ]);
    }

    connect() {
        this.connection = net.connect({
            host: DISCWORLD.host,
            port: DISCWORLD.port
        }, this.onConnect);

        const mudkit = this;

        async function *processChunk(chunk) {
            let command = null;

            for await (const byte of chunk) {
                if (command) {
                    command.push(COMMAND_NAMES[byte] || TELNET_OPTION_NAMES[byte]);

                    switch (byte) {
                    case COMMANDS.IAC:
                        command = null;
                        continue;
                    case COMMANDS.WILL:
                    case COMMANDS.WONT:
                    case COMMANDS.DO:
                    case COMMANDS.DONT:
                        continue;
                    default:
                        mudkit.processCommand(command);
                        command = null;
                        continue;
                    }
                } else if (byte === COMMANDS.IAC) {
                    command = ['IAC'];
                    continue;
                } else {
                    yield byte;
                }

                // handle color by wrapping output in object with color metadata
            }
        }

        const decoder = new StringDecoder('utf8');

        async function writeOutput(output) {
            for await (const byte of output) {
                process.stdout.write(decoder.write(Buffer.from([byte])));
            }
        }

        this.connection.on('data', (data) => writeOutput(processChunk(data)));
        this.connection.on('error', this.onError);
    }

    onConnect() {
        console.log('connected...');
    }

    onData(data) {
        // something like this, and move handlers to different files
        processLines(data)
        .then((byte) => processCommand(byte))
        .then((byte) => processColor(byte))
        .then((byte) => writeOutput(byte));
    }

    onError(err) {
        console.log(err);
    }

    processCommand(command) {
        console.log(command.join(' '));
    }

}

const mudkit = new MUDKit();

mudkit.connect();
