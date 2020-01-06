// https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences/33206814

/*
0x00-0x07:  standard colors (same as the 4-bit colours)
0x08-0x0F:  high intensity colors
0x10-0xE7:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
0xE8-0xFF:  grayscale from black to white in 24 steps
*/



// https://vt100.net/docs/vt510-rm/SGR.html

/*
0   All attributes off
1   Bold
4   Underline
5   Blinking
7   Negative image
8   Invisible image
10  The ASCII character set is the current 7-bit display character set (default)—SCO Console only.
11  Map Hex 00-7F of the PC character set codes to the current 7-bit display character set—SCO Console only.
12  Map Hex 80-FF of the current character set to the current 7-bit display character set—SCO Console only.
22  Bold off
24  Underline off
25  Blinking off
27  Negative image off
28  Invisible image off
*/

/*
╔══════════╦════════════════════════════════╦═════════════════════════════════════════════════════════════════════════╗
║  Code    ║             Effect             ║                                   Note                                  ║
╠══════════╬════════════════════════════════╬═════════════════════════════════════════════════════════════════════════╣
║ 0        ║  Reset / Normal                ║  all attributes off                                                     ║
║ 1        ║  Bold or increased intensity   ║                                                                         ║
║ 2        ║  Faint (decreased intensity)   ║  Not widely supported.                                                  ║
║ 3        ║  Italic                        ║  Not widely supported. Sometimes treated as inverse.                    ║
║ 4        ║  Underline                     ║                                                                         ║
║ 5        ║  Slow Blink                    ║  less than 150 per minute                                               ║
║ 6        ║  Rapid Blink                   ║  MS-DOS ANSI.SYS; 150+ per minute; not widely supported                 ║
║ 7        ║  [[reverse video]]             ║  swap foreground and background colors                                  ║
║ 8        ║  Conceal                       ║  Not widely supported.                                                  ║
║ 9        ║  Crossed-out                   ║  Characters legible, but marked for deletion.  Not widely supported.    ║
║ 10       ║  Primary(default) font         ║                                                                         ║
║ 11–19    ║  Alternate font                ║  Select alternate font `n-10`                                           ║
║ 20       ║  Fraktur                       ║  hardly ever supported                                                  ║
║ 21       ║  Bold off or Double Underline  ║  Bold off not widely supported; double underline hardly ever supported. ║
║ 22       ║  Normal color or intensity     ║  Neither bold nor faint                                                 ║
║ 23       ║  Not italic, not Fraktur       ║                                                                         ║
║ 24       ║  Underline off                 ║  Not singly or doubly underlined                                        ║
║ 25       ║  Blink off                     ║                                                                         ║
║ 27       ║  Inverse off                   ║                                                                         ║
║ 28       ║  Reveal                        ║  conceal off                                                            ║
║ 29       ║  Not crossed out               ║                                                                         ║
║ 30–37    ║  Set foreground color          ║  See color table below                                                  ║
║ 38       ║  Set foreground color          ║  Next arguments are `5;n` or `2;r;g;b`, see below                       ║
║ 39       ║  Default foreground color      ║  implementation defined (according to standard)                         ║
║ 40–47    ║  Set background color          ║  See color table below                                                  ║
║ 48       ║  Set background color          ║  Next arguments are `5;n` or `2;r;g;b`, see below                       ║
║ 49       ║  Default background color      ║  implementation defined (according to standard)                         ║
║ 51       ║  Framed                        ║                                                                         ║
║ 52       ║  Encircled                     ║                                                                         ║
║ 53       ║  Overlined                     ║                                                                         ║
║ 54       ║  Not framed or encircled       ║                                                                         ║
║ 55       ║  Not overlined                 ║                                                                         ║
║ 60       ║  ideogram underline            ║  hardly ever supported                                                  ║
║ 61       ║  ideogram double underline     ║  hardly ever supported                                                  ║
║ 62       ║  ideogram overline             ║  hardly ever supported                                                  ║
║ 63       ║  ideogram double overline      ║  hardly ever supported                                                  ║
║ 64       ║  ideogram stress marking       ║  hardly ever supported                                                  ║
║ 65       ║  ideogram attributes off       ║  reset the effects of all of 60-64                                      ║
║ 90–97    ║  Set bright foreground color   ║  aixterm (not in standard)                                              ║
║ 100–107  ║  Set bright background color   ║  aixterm (not in standard)                                              ║
╚══════════╩════════════════════════════════╩═════════════════════════════════════════════════════════════════════════╝
*/

// https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences/33206814
// \033[38;5;206m     #That is, \033[38;5;<FG COLOR>m
// \033[48;5;57m      #That is, \033[48;5;<BG COLOR>m
// \033[38;5;206;48;5;57m
// \033[38;2;<r>;<g>;<b>m     #Select RGB foreground color
// \033[48;2;<r>;<g>;<b>m     #Select RGB background color

/*
Set Graphics Rendition:
         ESC[#;#;....;#m Set display attributes where # is
                                       00 for normal display (or just 0)
                                       01 for bold on (or just 1)
                                       02 faint (or just 2)
                                       03 standout (or just 3)
                                       04 underline (or just 4)
                                       05 blink on (or just 5)
                                       07 reverse video on (or just 7)
                                       08 nondisplayed (invisible) (or just 8)
                                       22 normal
                                       23 no-standout
                                       24 no-underline
                                       25 no-blink
                                       27 no-reverse
                                       30 black foreground
                                       31 red foreground
                                       32 green foreground
                                       33 yellow foreground
                                       34 blue foreground
                                       35 magenta foreground
                                       36 cyan foreground
                                       37 white foreground
                                       39 default foreground
                                       40 black background
                                       41 red background
                                       42 green background
                                       43 yellow background
                                       44 blue background
                                       45 magenta background
                                       46 cyan background
                                       47 white background
                                       49 default background

         ESC[=#;7h or Put screen in indicated mode where # is
         ESC[=h or 0 for 40 x 25 black & white
         ESC[=0h or 1 for 40 x 25 color
         ESC[?7h 2 for 80 x 25 b&w
                                    3 for 80 x 25 color
                                    4 for 320 x 200 color graphics
                                    5 for 320 x 200 b & w graphics
                                    6 for 640 x 200 b & w graphics
                                    7 to wrap at end of line

         ESC[=#;7l or ESC[=l or Resets mode # set with above command
         ESC[=0l or ESC[?7l
 */
