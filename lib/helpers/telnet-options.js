// https://www.iana.org/assignments/telnet-options/telnet-options.xhtml
export const TELNET_OPTIONS = {
    TRANSMIT_BINARY     : 0, // RFC 856
    ECHO                : 1, // RFC 857
    RECONNECTION        : 2, // RFC 671
    SUPPRESS_GO_AHEAD   : 3, // RFC 858
    AMSN                : 4, // Approx Message Size Negotiation
    STATUS              : 5, // RFC 859
    TIMING_MARK         : 6, // RFC 860
    RCTE                : 7, // RFC 726 (Remote Controlled Trans and Echo)
    OLW                 : 8, // Output Line Width
    OPS                 : 9, // Output Page Size
    NAOCRD              : 10, // RFC 652 (Output Carriage-Return Disposition)
    NAOHTS              : 11, // RFC 653 (Output Horizontal Tab Stops)
    NAOHTD              : 12, // RFC 654 (Output Horizontal Tab Disposition)
    NAOFFD              : 13, // RFC 655 (Output Formfeed Disposition)
    NAOVTS              : 14, // RFC 656 (Output Vertical Tabstops)
    NAOVTD              : 15, // RFC 657 (Output Vertical Tab Disposition)
    NAOLFD              : 16, // RFC 658 (Output Linefeed Disposition)
    EXTEND_ASCII        : 17, // RFC 698
    LOGOUT              : 18, // RFC 727
    BM                  : 19, // RFC 735 (Byte Macro)
    DET                 : 20, // RFC 732, 1043 (Data Entry Terminal)
    SUPDUP              : 21, // RFC 734, 736
    SUPDUP_OUTPUT       : 22, // RFC 749
    SEND_LOCATION       : 23, // RFC 779
    TTYPE               : 24, // RFC 930, 1091, http://tintin.sourceforge.net/mtts/ (Terminal Type)
    EOR                 : 25, // RFC 885 (End of Record)
    TUID                : 26, // RFC 927 (TACACS User Identification)
    OUTMRK              : 27, // RFC 933 (Output Marking)
    TTYLOC              : 28, // RFC 946 (Terminal Location Number)
    '3270_REGIME'       : 29, // RFC 1041 (Telnet 3270 Regime)
    'X.3_PAD'           : 30, // RFC 1053 (X.3 PAD)
    NAWS                : 31, // RFC 1073 (Negotiate About Window Size)
    TERMINAL_SPEED      : 32, // RFC 1079
    REMOTE_FLOW_CONTROL : 33, // RFC 1372
    LINEMODE            : 34, // RFC 1184
    X_DISPLAY_LOCATION  : 35, // RFC 1096
    ENVIRON             : 36, // RFC 1408 (Environment Option)
    AUTHENTICATION      : 37, // RFC 2941
    ENCRYPT             : 38, // RFC 2946
    NEW_ENVIRON         : 39, // RFC 1572
    TN3270E             : 40, // RFC 2355
    XAUTH               : 41,
    CHARSET             : 42, // RFC 2066
    RSP                 : 43, // Telnet Remote Serial Port
    COM_PORT_OPTION     : 44, // RFC 2217 (Com Port Control Option)
    SLE                 : 45, // Telnet Suppress Local Echo
    START_TLS           : 46, // Telnet Start TLS
    KERMIT              : 47, // RFC 2840
    SEND_URL            : 48,
    FORWARD_X           : 49,
    MSDP                : 69,
    MSSP                : 70, // MUD Server Status Protocol
    COMPRESS            : 85, // MUD Client Compression Protocol (version 1)
    COMPRESS2           : 86, // MUD Client Compression Protocol (version 2) http://www.zuggsoft.com/zmud/mcp.htm
    MSP                 : 90, // MUD Sound Protocol http://www.zuggsoft.com/zmud/msp.htm
    MXP                 : 91, // MUD eXtension Protocol http://www.zuggsoft.com/zmud/mxp.htm
    ZMP                 : 93, // Zenith MUD Protocol http://discworld.starturtle.net/external/protocols/zmp.html
    PRAGMA_LOGON        : 138, // TELOPT PRAGMA LOGON
    SSPI_LOGON          : 139, // TELOPT SSPI LOGON
    PRAGMA_HEARTBEAT    : 140, // TELOPT PRAGMA HEARTBEAT
    GCMP                : 201, // Generic Mud Communication Protocol http://www.ironrealms.com/gmcp-doc
    EXOPL               : 255 // RFC 861 (Extended-Options-List)
}

export const TELNET_OPTION_NAMES = Object.keys(TELNET_OPTIONS).reduce((out, key) => {
    const value = TELNET_OPTIONS[key];

    out[value] = key.toUpperCase();

    return out;
}, {});
