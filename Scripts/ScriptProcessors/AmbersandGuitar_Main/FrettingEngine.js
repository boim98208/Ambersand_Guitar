 const var NUMOFSTRINGS = Globals.NUMOFSTRINGS;
 const var LOWESTNOTE = 52;
 const var HIGHESTNOTE = 88;


 
 namespace Stringtype
 {
 
     const var STRING1 = 0;
     const var STRING2 = 1;
     const var STRING3 = 2;
     const var STRING4 = 3;
     const var STRING5 = 4;
     const var STRING6 = 5;
 
 }
 
 
 const var string6Mute = Synth.getMidiProcessor("Container0String6Mute");
 const var string5Mute = Synth.getMidiProcessor("Container0String5Mute");
 const var string4Mute = Synth.getMidiProcessor("Container0String4Mute");
 const var string3Mute = Synth.getMidiProcessor("Container0String3Mute");
 const var string2Mute = Synth.getMidiProcessor("Container0String2Mute");
 const var string1Mute = Synth.getMidiProcessor("Container0String1Mute");
 
 //variables to correspond with the Fretdisplay
 Globals.stringNote1 = -1;
 Globals.stringNote2 = -1;
 Globals.stringNote3 = -1;
 Globals.stringNote4 = -1;
 Globals.stringNote5 = -1;
 Globals.stringNote6 = -1;

 /*
     stringNotes holds the note played by each string
    on each index. Index 0 holds note played by string 1 
    (the high string) while index 5 holds note played by
    string 5 (the low string)
 */
var stringNote = [];
stringNote.reserve(NUMOFSTRINGS);
for(var i = 0; i < NUMOFSTRINGS; i++){
	stringNote.push(-1);
}


//ensure only one sampler plays a voice at a time

 inline function playString6(){
    string6Mute.setAttribute("Bypass", false);
    string5Mute.setAttribute("Bypass", true);
    string4Mute.setAttribute("Bypass", true);
    string3Mute.setAttribute("Bypass", true);
    string2Mute.setAttribute("Bypass", true);
    string1Mute.setAttribute("Bypass", true);
 }

 inline function playString5(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", false);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
		string2Mute.setAttribute("Bypass", true);
	string1Mute.setAttribute("Bypass", true);
 }

 inline function playString4(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", false);
     string3Mute.setAttribute("Bypass", true);
string2Mute.setAttribute("Bypass", true);
string1Mute.setAttribute("Bypass", true);
 }

 inline function playString3(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", false);
string2Mute.setAttribute("Bypass", true);
string1Mute.setAttribute("Bypass", true);
 }
 
 inline function playString2(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", false);
 string1Mute.setAttribute("Bypass", true);
 }
 
 inline function playString1(){
     string6Mute.setAttribute("Bypass", true);
     string5Mute.setAttribute("Bypass", true);
     string4Mute.setAttribute("Bypass", true);
     string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", true);
 string1Mute.setAttribute("Bypass", false);
 }
 
 
 inline function updateGlobals(){
	 Globals.stringNote1 = stringNote[Stringtype.STRING1];
	 Globals.stringNote2 = stringNote[Stringtype.STRING2];
	 Globals.stringNote3 = stringNote[Stringtype.STRING3];
	 Globals.stringNote4 = stringNote[Stringtype.STRING4];
	 Globals.stringNote5 = stringNote[Stringtype.STRING5];
	 Globals.stringNote6 = stringNote[Stringtype.STRING6];
 }
 
 
 
 inline function isEventStillPlaying(eventId)
 {
     for (var i = 0; i < 128; i++)
     {
         if (activeIds.getValue(i) == eventId)
             return true;
     }
     return false;
 }
 
 
 
 
 
 function onNoteOn()
{
	local notePlayed = Message.getNoteNumber();



	if (stringNote[Stringtype.STRING6] == -1){
		Console.print("playing string 6");
		playString6();
		stringNote[Stringtype.STRING6] = notePlayed;
		updateGlobals();
		return;
	}else if (stringNote[Stringtype.STRING5] == -1){
		Console.print("playing string 5");
		playString5();
		stringNote[Stringtype.STRING5] = notePlayed;
		updateGlobals();
		return;
	}else if (stringNote[Stringtype.STRING4] == -1){
		Console.print("playing string 4");
		playString4();
		stringNote[Stringtype.STRING4] = notePlayed;
		updateGlobals();
		return;
	}else if (stringNote[Stringtype.STRING3] == -1){
		Console.print("playing string 3");
		playString3();
		stringNote[Stringtype.STRING3] = notePlayed;
		updateGlobals();
		return;
	}else if (stringNote[Stringtype.STRING2] == -1){
		Console.print("playing string 2");
		playString2();
		stringNote[Stringtype.STRING2] = notePlayed;
		updateGlobals();
		return;
	}else if (stringNote[Stringtype.STRING1] == -1){
		Console.print("playing string 1");
		playString1();
		stringNote[Stringtype.STRING1] = notePlayed;
		updateGlobals();
		return;
	}
	

	
}
 function onNoteOff()
{
	local releasedNote = Message.getNoteNumber();
	
	if(stringNote[Stringtype.STRING6] == releasedNote){
		stringNote[Stringtype.STRING6] = -1;
	}else if(stringNote[Stringtype.STRING5] == releasedNote){
		stringNote[Stringtype.STRING5] = -1;
	}else if(stringNote[Stringtype.STRING4] == releasedNote){
		stringNote[Stringtype.STRING4] = -1;
	}else if(stringNote[Stringtype.STRING3] == releasedNote){
		stringNote[Stringtype.STRING3] = -1;
	}else if(stringNote[Stringtype.STRING2] == releasedNote){
		stringNote[Stringtype.STRING2] = -1;
	}else if(stringNote[Stringtype.STRING1] == releasedNote){
		stringNote[Stringtype.STRING1] = -1;
	}
	
	updateGlobals();
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 