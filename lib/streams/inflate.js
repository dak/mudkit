import {Transform} from 'stream';
import zlib from 'zlib';

export default class InflateStream extends Transform {

    #inflate = zlib.createInflate();

    constructor(options, telnetClient, dataStream) {
        super(options);

        this.telnetClient = telnetClient;
        this.dataStream = dataStream;

        this.#inflate.pipe(dataStream);
    }

    _transform(chunk, encoding, callback) {
        if (this.telnetClient.terminal.state.mccp) {
            try {
                this.#inflate.write(chunk);
            } catch {
                this.dataStream.write(chunk);
            }
        } else {
            this.dataStream.write(chunk);
        }

        callback(null);
    }

}
