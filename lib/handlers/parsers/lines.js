import Parser from '../../models/parser.js';

export default class LineParser extends Parser {

    constructor(client) {
        super(client);

        this.parse = (async function* parseLines(chunk) {
            let previous = '';

            for await (const byte of chunk) {
                previous += byte;

                while (true) {
                    const eolIndex = previous.indexOf('\n');

                    if (eolIndex < 0) break;

                    // line includes the EOL
                    const line = previous.slice(0, eolIndex + 1);

                    yield line;

                    previous = previous.slice(eolIndex + 1);
                }
            }

            if (previous.length > 0) {
                yield previous;
            }
        }).bind(this);
    }

}
