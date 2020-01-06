import {COMMANDS, COMMAND_NAMES} from '../helpers/commands.js';
import {TELNET_OPTIONS, TELNET_OPTION_NAMES} from '../helpers/telnet-options.js';

export default class Parser {

    constructor(telnetClient) {
        this.telnetClient = telnetClient;
    }

    send(command) {
        command.map((byte) => COMMANDS[byte] || TELNET_OPTIONS[byte]);
        console.log(`SEND: ${command.join(' ')}`);
        this.telnetClient.connection.write(Buffer.from(command));
    }

}
