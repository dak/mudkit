import {COMMANDS} from '../helpers/commands.js';
import {TELNET_OPTIONS} from '../helpers/telnet-options.js';

export default class Parser {

    constructor(telnetClient) {
        this.telnetClient = telnetClient;
    }

}
