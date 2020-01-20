import Parser from '../../models/parser.js';
import {sgrMatch} from '../../helpers/sgr.js';

export default class SGRParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);
    }

    async parse(bytes) {
        this.telnetClient.terminal.line.setSGR(sgrMatch(bytes));
    }

}
