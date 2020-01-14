import {StringDecoder} from 'string_decoder';

import Parser from '../../models/parser.js';

export default class OutputParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);

        this.decoder = new StringDecoder('utf8');
    }

    async parse(chunk) {
        for await (const byte of chunk) {
            const char = this.decoder.write(Buffer.from([byte]));

            this.telnetClient.terminal.line.append(char);

            if (char === '\n') {
                this.telnetClient.print(this.line, {newLine: true});
            }
        }
    }

}
