import zlib from 'zlib';

import Parser from '../../models/parser.js';

export default class MCCPParser extends Parser {

    constructor(telnetClient) {
        super(telnetClient);

        this.parse = (async function* parseMCCP(chunk) {
            if (this.telnetClient.terminal.state.mccp = true) {
                try {
                    yield zlib.inflateSync(chunk);
                } catch (err) {
                    console.log(err, chunk);
                    yield chunk;
                }
            } else {
                yield chunk;
            }
        }).bind(this);
    }

}


// import {Transform} from 'stream';

// export default new Transform({
//     transform(chunk, encoding, callback) {
//         callback(null, data);
//     }
// });

// Parser extends Transform

// import zlib from 'zlib';
// import {Transform} from 'stream';

// class MCCPTransform extends Parser {

//     constructor(terminalClient) {
//         super(terminalClient);
//     }

//     transform(chunk, encoding, callback) {
//         if (this.terminalClient.terminal.state.mccp = true) {
//             this.push(zlib.inflate(chunk));
//         } else {
//             this.push(chunk);
//         }

//         callback();
//     }

// }
