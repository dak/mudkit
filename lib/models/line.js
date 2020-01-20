function isEquivalent(a, b) {
    for (const [key, value] of Object.entries(a)) {
        if (value) { // Falsy values are equivalent
            if (typeof value === 'object') {
                if (!isEquivalent(value, b[key])) {
                    return false;
                }
            } else {
                if (!b || value !== b[key]) {
                    return false;
                }
            }
        }
    }

    return true;
}

export default class Line {

    #text = '';
    #chunk = '';
    #number = 1;
    #mxp = {};
    #sgr = {};

    constructor(telnetClient) {
        this.telnetClient = telnetClient;
    }

    append(str) {
        this.#text += str;
        this.#chunk += str;
    }

    next() {
        this.#text = '';
        this.#chunk = '';
        this.#number++;
    }

    nextChunk() {
        this.#chunk = '';
    }

    toString() {
        return JSON.stringify({
            text: this.#text,
            chunk: this.#chunk,
            number: this.#number,
            mxp: this.#mxp,
            sgr: this.#sgr
        })
    }

    setSGR(sgr) {
        if (isEquivalent(sgr, this.#sgr)) {
            return;
        }

        this.#sgr = {...this.#sgr, ...sgr};
        this.telnetClient.print();
    }

    get text() {
        return this.#text;
    }

}
