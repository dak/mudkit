export const COMMANDS = {
    IAC     : 255, // Interpret as command
    DONT    : 254, // You are not to use option
    DO      : 253, // Please use option
    WONT    : 252, // I won't use option
    WILL    : 251, // I will use option
    SB      : 250, // Sub-negotiation
    GA      : 249, // Go-ahead
    EL      : 248, // Erase line
    EC      : 247, // Erase character
    AYT     : 246, // Are you there?
    AO      : 245, // Abort output (but let prog finish)
    IP      : 244, // Interrupt (permanently)
    BREAK   : 243, // Break
    DM      : 242, // Data mark
    NOP     : 241, // No operation
    SE      : 240, // End sub-negotiation
    EOR     : 239, // End of record (transparent mode)
    ABORT   : 238, // Abort process
    SUSP    : 237, // Suspend process
    EOF     : 236 // End of file
};

export const COMMAND_NAMES = Object.keys(COMMANDS).reduce((out, key) => {
    const value = COMMANDS[key];
    out[value] = key.toUpperCase();
    return out;
}, {});
