import {COMMANDS} from '../helpers/commands.js';
import {TELNET_OPTIONS} from '../helpers/telnet-options.js';

export default class Parser {

    constructor(telnetClient) {
        this.telnetClient = telnetClient;
    }

    send(command) {
        const bytes = command.map((byte) => COMMANDS[byte] || TELNET_OPTIONS[byte] || byte);

        console.log(`SEND: ${command.join(' ')} (${bytes})`);
        this.telnetClient.connection.write(Buffer.from(bytes));
    }

}
