import {COMMANDS, COMMAND_NAMES} from '../helpers/commands.js';
import {
    TELNET_OPTIONS,
    TELNET_OPTION_NAMES,
    TTYPE_OPTIONS,
    TTYPE_OPTION_NAMES,
    MSSP_OPTIONS,
    MSSP_OPTION_NAMES
} from '../helpers/telnet-options.js';

export default class Command {

    constructor() {
        this.option = null;
        this.bytes = [];
    }

    add(byte) {
        this.bytes.push(byte);

        if (!this.option) {
            switch (byte) {
            case COMMANDS.IAC:
            case COMMANDS.SB:
            case COMMANDS.WILL:
            case COMMANDS.WONT:
            case COMMANDS.DO:
            case COMMANDS.DONT:
                break;
            default:
                this.option = TELNET_OPTION_NAMES[byte] || COMMAND_NAMES[byte];
            }
        }
    }

    toString() {
        if (!this.isSubCommand) {
            return this.bytes.map((byte) => {
                return COMMAND_NAMES[byte] || TELNET_OPTION_NAMES[byte] || byte;
            }).join(' ');
        }

        let sigBytes = this.bytes.slice(3, -2);

        if (this.option === 'TTYPE') {
            sigBytes = sigBytes.map((byte) => TTYPE_OPTION_NAMES[byte]);
        }

        if (this.option === 'MSSP') {
            let newValOrVar = false;

            sigBytes = sigBytes.reduce((acc, byte) => {
                if (MSSP_OPTION_NAMES[byte]) {
                    acc.push(MSSP_OPTION_NAMES[byte]);
                    newValOrVar = true;
                } else if (newValOrVar) {
                    acc.push(String.fromCharCode(byte));
                    newValOrVar = false;
                } else {
                    acc[acc.length - 1] += String.fromCharCode(byte);
                }

                return acc;
            }, []).join(' ');
        }

        const byteWords = ['IAC', 'SB']
            .concat(this.option)
            .concat(sigBytes)
            .concat(['IAC', 'SE']);

        // TODO: Handle SB bytes
        return byteWords.join(' ');
    }

    get isSubCommand() {
        return this.bytes[0] === COMMANDS.IAC && this.bytes[1] === COMMANDS.SB;
    }

    get isComplete() {
        if (this.option && !this.isSubCommand) {
            return true;
        }

        const lastBytes = this.bytes.slice(-2);

        if (this.isSubCommand && lastBytes[0] === COMMANDS.IAC && lastBytes[1] === COMMANDS.SE) {
            return true;
        }

        return false;
    }

}
