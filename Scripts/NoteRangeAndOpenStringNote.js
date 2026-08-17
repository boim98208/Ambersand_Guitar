 const var POSINFINITY = 1/0;
 
 const var NUMOFSTRINGS = Globals.g_NUMOFSTRINGS;
 const var LOWESTNOTE = 52;
 const var HIGHESTNOTE = 97;
 
 const var OPENSTRING6NOTE = 52;
 const var OPENSTRING5NOTE = 57;
 const var OPENSTRING4NOTE = 62;
 const var OPENSTRING3NOTE = 67;
 const var OPENSTRING2NOTE = 71;
 const var OPENSTRING1NOTE = 76;
 
 const var NO_NOTE = -1;
 
 const var NOTESPERSTRING = 22;
 
 const var OPENSTRINGNONOTE = POSINFINITY;
 
 const var OPENSTRINGNOTES = [OPENSTRING1NOTE, OPENSTRING2NOTE, OPENSTRING3NOTE, OPENSTRING4NOTE, OPENSTRING5NOTE, OPENSTRING6NOTE, OPENSTRINGNONOTE];
 
 const var NOTEPITCHSPREAD = 2;
 
 namespace StringType
 {
 
 // these dictate the midi channel and array index these values come in at
 
     const var STRING1 = 0;
     const var STRING2 = 1;
     const var STRING3 = 2;
     const var STRING4 = 3;
     const var STRING5 = 4;
     const var STRING6 = 5;
     const var LEGATOOFFSET = NUMOFSTRINGS;
     
     const var STRING1LEG = 6;
     const var STRING2LEG = 7;
     const var STRING3LEG = 8;
     const var STRING4LEG = 9;
     const var STRING5LEG = 10;
     const var STRING6LEG = 11;
     const var NOSTRING = 12;
 
 }