import {StringDecoder} from 'string_decoder';

import Parser from '../../models/parser.js';

export default class OutputParser extends Parser {

    constructor(client) {
        super(client);

        this.decoder = new StringDecoder('utf8');
    }

    async parse(chunk) {
        for await (const byte of chunk) {
            process.stdout.write(this.decoder.write(Buffer.from([byte])));
        }
    }

}
