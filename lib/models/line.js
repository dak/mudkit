export default class Line {

    constructor() {
        this.text = '';
        this.chunk = '';
        this.number = 1;
        this.color = null;
        this.backgroundColor = null;
        this.mxp = {};
    }

    append(str) {
        this.text += str;
        this.chunk += str;
    }

    next() {
        this.text = '';
        this.chunk = '';
        this.number++;
    }

    nextChunk() {
        this.chunk = '';
    }

    toString() {
        return this.text;
    }

}
