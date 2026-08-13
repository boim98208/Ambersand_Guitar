 Synth.deferCallbacks(false);
 //for some reason global releases wont turn off mid-script so I'm keeping it off for now
 Globals.g_emulatedReleasesOn = true;
 
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
 
 const var OPENSTRINGNOTES = [OPENSTRING1NOTE, OPENSTRING2NOTE, OPENSTRING3NOTE, OPENSTRING4NOTE, OPENSTRING5NOTE, OPENSTRING6NOTE];
 
 OPENSTRINGNOTES.push(OPENSTRINGNONOTE);

var legatoKeySwitchPlaying = false;
 
 namespace Stringtype
 {
 
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
 
 inline function isBetweenIncl(num, lowBound, highBound){
 	 return num >= lowBound && num <= highBound;
 }
 
 
 namespace FrettingEngine
 {
	//make sure this lines up with the item list from the combo box

 	const var NATURAL = 1;
 	const var MELODY = 2;
 }
 
 namespace PerformanceType
 {
 	const var SUSTAIN = 0;
 	const var LEGATOUP = 1;
 	const var LEGATODOWN = 2;
 }
 
include("KeyswitchConstants.js");
 
 
 var legatoKeySwitchPlaying = false;
 
 
const var SusContainerMute = Synth.getMidiProcessor("SusContainerMute");
const var MuteContainerMute = Synth.getMidiProcessor("MuteContainerMute");
const var HarmonicContainerMute = Synth.getMidiProcessor("HarmonicContainerMute");
const var TremoloContainerMute = Synth.getMidiProcessor("TremoloContainerMute");

//sfxcontainermute has been disabled because I might just have it be constantly available
const var SFXContainerMute = Synth.getMidiProcessor("SFXContainerMute");

const var ContainerMutes = [SusContainerMute, MuteContainerMute, HarmonicContainerMute, TremoloContainerMute];
const var NUMOFKEYSWITCHES = ContainerMutes.length;

 
 inline function setAllContainersMuted(){
	 for(var i = 0; i < ContainerMutes.length; i++){
		 ContainerMutes[i].setAttribute("Bypass", true);
	 }
 }
 
 inline function detectKeySwitch(notePlayed){
	 
 
	if(!isBetweenIncl(notePlayed, SUSTAINKEYSWITCHNOTE, SUSTAINKEYSWITCHNOTE + NUMOFKEYSWITCHES)){
		//keyswitch was not pressed
		return 0;
	}
	
	
	 setAllContainersMuted();
	 
	 //emulated releases probably only work on sustains so set off by default
	 Globals.g_emulatedReleasesOn = false;
	 
	 if(notePlayed == SUSTAINKEYSWITCHNOTE){
	 
		 SusContainerMute.setAttribute("Bypass", false);
		 Globals.g_emulatedReleasesOn = true;
	 }else if(notePlayed == MUTEKEYSWITCHNOTE){
	 
		 MuteContainerMute.setAttribute("Bypass", false);
	 }else if(notePlayed == HARMONICKEYSWITCHNOTE){
		 
		 HarmonicContainerMute.setAttribute("Bypass", false);
	 }else if(notePlayed == TREMOLOKEYSWITCHNOTE){
		 
		 TremoloContainerMute.setAttribute("Bypass", false);
	 }
	 
 }
 
 
 
 
 
/*
 string6Mute.setAttribute("Bypass", true);
 string5Mute.setAttribute("Bypass", true);
 string4Mute.setAttribute("Bypass", true);
 string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", true);
 string1Mute.setAttribute("Bypass", true);
 */
 
 //variables to correspond with the Fretdisplay
 Globals.g_stringNote1 = NO_NOTE;
 Globals.g_stringNote2 = NO_NOTE;
 Globals.g_stringNote3 = NO_NOTE;
 Globals.g_stringNote4 = NO_NOTE;
 Globals.g_stringNote5 = NO_NOTE;
 Globals.g_stringNote6 = NO_NOTE;
 Globals.g_handPositionFret = 0;

 /*
     stringNotes holds the note played by each string
    on each index. Index 0 holds note played by string 1 
    (the high string) while index 5 holds note played by
    string 5 (the low string)
 */
var stringNote = [];
var stringId = [];

stringNote.reserve(NUMOFSTRINGS);
for(i = 0; i < NUMOFSTRINGS * 2; i++){
	stringNote.push(NO_NOTE);
}


inline function resetNotes(){
	for(var i = 0; i < stringNote.length - 1; i++){
		stringNote[i] = NO_NOTE;
	}
}

//one more push to make up for the "NOSTRING" and not go out of bounds when scanning string notes
stringNote.push(POSINFINITY);




//GUI TO HELP ME DEBUG

inline function onButton1Control(component, value)
{
	Console.print("~~~ NOTES CORRELATING TO THE STRINGS ~~~");

	for(var i = 0; i < NUMOFSTRINGS; i++){
		Console.print("String " + (i + 1) + ": " + stringNote[i] +" | legato: " + stringNote[i + Stringtype.LEGATOOFFSET]);
	}
};

Content.getComponent("Button1").setControlCallback(onButton1Control);




//functions to ensure only one sampler plays a voice at a time
//this should only take the Stringtype enum
inline function playString(theStringType){
	
	//adding 1 because the enum starts on 0 but channels start on 1
	Message.setChannel(theStringType + 1);
}
 

 
 inline function updateGlobals(){
 
 	if(stringNote[Stringtype.STRING1LEG] == NO_NOTE)
		Globals.g_stringNote1 = stringNote[Stringtype.STRING1];
	else
		Globals.g_stringNote1 = stringNote[Stringtype.STRING1LEG];
		
	if(stringNote[Stringtype.STRING2LEG] == NO_NOTE)
		Globals.g_stringNote2 = stringNote[Stringtype.STRING2];
	else
		Globals.g_stringNote2 = stringNote[Stringtype.STRING2LEG];
		
	if(stringNote[Stringtype.STRING3LEG] == NO_NOTE)
		Globals.g_stringNote3 = stringNote[Stringtype.STRING3];
	else
		Globals.g_stringNote3 = stringNote[Stringtype.STRING3LEG];
		
	if(stringNote[Stringtype.STRING4LEG] == NO_NOTE)
		Globals.g_stringNote4 = stringNote[Stringtype.STRING4];
	else{
		Globals.g_stringNote4 = stringNote[Stringtype.STRING4LEG];
		}
		
	if(stringNote[Stringtype.STRING5LEG] == NO_NOTE)
		Globals.g_stringNote5 = stringNote[Stringtype.STRING5];
	else
		Globals.g_stringNote5 = stringNote[Stringtype.STRING5LEG];
		
	if(stringNote[Stringtype.STRING6LEG] == NO_NOTE)
		Globals.g_stringNote6 = stringNote[Stringtype.STRING6];
	else
		Globals.g_stringNote6 = stringNote[Stringtype.STRING6LEG];

 }
 
 inline function isPolyphonyPlaying(){
	 return Synth.getNumPressedKeys() > 1;
 }
 
 inline function sustainKeySwitchPressed(){
	 
 }
 
 //fretting engine designed for going low to high string then going back down
 //use primarily for quick debugging 
 
 inline function primitiveFretting(notePlayed){
 
	 if (stringNote[Stringtype.STRING6] == -1){
	 	playString6();
	 	stringNote[Stringtype.STRING6] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING5] == -1){
	 	playString5();
	 	stringNote[Stringtype.STRING5] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING4] == -1){
	 	playString4();
	 	stringNote[Stringtype.STRING4] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING3] == -1){
	 	playString3();
	 	stringNote[Stringtype.STRING3] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING2] == -1){
	 	playString2();
	 	stringNote[Stringtype.STRING2] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[Stringtype.STRING1] == -1){
	 	playString1();
	 	stringNote[Stringtype.STRING1] = notePlayed;
	 	updateGlobals();
	 	return;
	 }
	 
	 
 }







/* 
The main logic for the "Natural" fretting mode in polyphony
*/
inline function stringWithClosestNote(notePlayed, currentHandPos){
	
	local currString = Stringtype.NOSTRING;
	//arbitrary big number to replace later
	local currDist = POSINFINITY;
	local distToCompare;
	
	for(i = NUMOFSTRINGS - 1; i > -1; i--){
		if(stringNote[i] == -1 && isBetweenIncl(notePlayed, OPENSTRINGNOTES[i], OPENSTRINGNOTES[i] + NOTESPERSTRING)){
		
		
		// the - 2 fixes it for some reason. It seems that without it the system just straight up misses notes
		
		distToCompare = Math.abs((notePlayed - OPENSTRINGNOTES[i] - 2) - currentHandPos);
		
			if(Math.min(currDist, distToCompare) == distToCompare)
			{
				currString = i;
				currDist = distToCompare;
			}
		}
	}
	
	return currString;
	
	
}

/* 
The main logic for the "Melody" fretting mode
*/
inline function stringWithMelodyNote(notePlayed, currentHandPos)
{
	
	
	local currString = Stringtype.NOSTRING;
	//arbitrary big number to replace later
	local currDist = POSINFINITY;
	local distToCompare;
	
	for(i = NUMOFSTRINGS - 1; i > -1; i--)
	{
		if(stringNote[i] == -1 && isBetweenIncl(notePlayed, OPENSTRINGNOTES[i], OPENSTRINGNOTES[i] + NOTESPERSTRING)){
		
		
		// the - 2 fixes it for some reason. It seems that without it the system just straight up misses notes
		distToCompare = Math.abs((notePlayed - OPENSTRINGNOTES[i] - 2) - currentHandPos);
	
		
		
			if(Math.min(currDist - (i* 2), distToCompare) == distToCompare){
				currString = i;
				currDist = distToCompare;
			}
		}
	}
	
	return currString;
}


inline function forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange)
{


	local newFretFromForceString;
	local distanceBetweenForceAndAutoFret;

	if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.g_forcedString], OPENSTRINGNOTES[Globals.g_forcedString] + (NOTESPERSTRING - 1)) && stringNote[Globals.g_forcedString] == -1)
	{
	
	
	
	stringNote[Globals.g_forcedString] = notePlayed; 
	
	updateGlobals(); 
	playString(Globals.g_forcedString);
	Globals.g_stringPerformance[Globals.g_forcedString] = PerformanceType.SUSTAIN;
	
	newFretFromForceString = notePlayed - OPENSTRINGNOTES[Globals.g_forcedString];
	distanceBetweenForceAndAutoFret = Math.abs(newFretFromForceString - currentHandPos);
	
	//changes fret position if forceString's frets go a certain distance
	if(distanceBetweenForceAndAutoFret < fretSpaceToChange)
		{
		return currentHandPos;
		}
	else
		{
		if(newFretFromForceString > 17)
			return 17;
		else
			return newFretFromForceString;
		}
		
	}
	
}




/* 
fretting choice to be as close as possible to the fret position. 
Designed for leads interspersed with chords or simple voicings in the "Natural" fretting mode
Will change fret position if polyphony leads to a really far fret
*/

// the function returns the next fret for the algorithm
inline function naturalFretting2_2_1(notePlayed, currentHandPos)
{
	

	local distBetweenNewFretAndAutoFret = 0;
	local newFretFromPolyphony;
	local fretSpaceToChange = 2;
	local stringToPlay;
	
	if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
	    return currentHandPos;
	}
	
	
	//Going to force string mode
	if(Globals.g_forcedString != -1)
	{

		if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.g_forcedString], OPENSTRINGNOTES[Globals.g_forcedString] + NOTESPERSTRING - 1) && stringNote[Globals.g_forcedString] == -1)
		{
		
			return forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange);
			
		}
	}
	
	
	//no forced string and therefore just goes as normal
	
	
	stringToPlay = stringWithClosestNote(notePlayed, currentHandPos);
	stringNote[stringToPlay] = notePlayed;
	Globals.g_stringPerformance[stringToPlay] = PerformanceType.SUSTAIN;
	playString(stringToPlay);
	
	
	updateGlobals();
	
	
	//when there's polyphony, virtual guitarist moves hand to wherever the biggest change in pos is
	if(Synth.getNumPressedKeys() >= 2 && stringToPlay != Stringtype.NOSTRING){
	//change fret position to suit the chord fingering more.
	
	newFretFromPolyphony = stringNote[stringToPlay] - OPENSTRINGNOTES[stringToPlay];
	distBetweenNewFretAndAutoFret = Math.abs(newFretFromPolyphony - currentHandPos);
	}else{
	
	
	
		if(stringToPlay == Stringtype.STRING1){
			if(notePlayed - currentHandPos < OPENSTRING1NOTE + 5)
	            return currentHandPos;
	        else
	            return notePlayed - OPENSTRING1NOTE - 4;
		}
		
		if(stringToPlay == Stringtype.STRING6){
			if(notePlayed < currentHandPos + OPENSTRING6NOTE)
			            return notePlayed - OPENSTRING6NOTE;
		}
	
	}
	
	//I dont really understand why, but + 2 seems like a number that makes this work
	
	if(distBetweenNewFretAndAutoFret < fretSpaceToChange + 2)
	{

		return currentHandPos;
	}else
	{

			return cap(notePlayed - OPENSTRINGNOTES[stringToPlay], NOTESPERSTRING - 5);
		
	}

	
}


/* 
fretting choice that likes to lean more to being on the same string. 
Designed for timbre jumps in lead or melody playing, especially when monophonic. 

Stiiiiill kinda rough tho. It likes to skip strings a little too much it seems. 
The logic on choosing between strings needs to weigh the closer strings more than the closest fret

todo: make sure it changes fret images to legato if needed
*/

inline function melodyFretting1_0_0(notePlayed, currentHandPos)
{
	
	local distBetweenNewFretAndAutoFret = 0;
	local newFretFromPolyphony;
	local fretSpaceToChange = 5;
	local stringToPlay;
	
	if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
	    return currentHandPos;
	}
	
	
	//Going to force string mode
	if(Globals.g_forcedString != -1)
	{

		if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.g_forcedString], OPENSTRINGNOTES[Globals.g_forcedString] + NOTESPERSTRING - 1) && stringNote[Globals.g_forcedString] == -1)
		{
		
			return forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange);
			
		}
	}
	
	
	//no forced string and therefore just goes as normal
	
	
	stringToPlay = stringWithMelodyNote(notePlayed, currentHandPos);
	stringNote[stringToPlay] = notePlayed;
	playString(stringToPlay);
	
	updateGlobals();
	
	
	//when there's polyphony, virtual guitarist moves hand to wherever the biggest change in pos is
	if(Synth.getNumPressedKeys() >= 2){
	newFretFromPolyphony = stringNote[stringToPlay] - OPENSTRINGNOTES[stringToPlay];
	distBetweenNewFretAndAutoFret = Math.abs(newFretFromPolyphony - currentHandPos);
	}
	

	
	//I dont really understand why, but + 2 seems like a number that makes this work
	
	if(distBetweenNewFretAndAutoFret < fretSpaceToChange + 2)
	{
		return currentHandPos;
	}else
	{
		return newFretFromPolyphony;
	}
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
 
 inline function cap(num, limit)
 {
	 if(num > limit)
	 {
		 return limit;
	 }else{
		 return num;
	 }
 } 
 
 
 inline function playNextNoteLegato(notePlayed, velocityPlayed)
 {
	Console.print("should be legato");


	local isNoteInRange = false;

	//exit early because it should just play the note on a new string
	if(!isPolyphonyPlaying())
	{
		return false;
	}
	
		
 	 for( var i = 0; i < NUMOFSTRINGS && !noteInRange; i++){
 	 
 	 
	 	 if(isBetweenIncl(notePlayed, stringNote[i] - Globals.g_legatoRange, stringNote[i] + Globals.g_legatoRange)){
	 	 	 	 isNoteInRange = true;
	 	 	 	 
	 	 	 	 if(notePlayed > stringNote[i])
	 	 	 	 	Globals.g_stringPerformance[i] = PerformanceType.LEGATOUP;
	 	 	 	 else
	 	 	 	 	Globals.g_stringPerformance[i] = PerformanceType.LEGATODOWN;
	 	 	 	 

	 	 	 	stringNote[i] = notePlayed;
				stringNote[i + Stringtype.LEGATOOFFSET] = notePlayed;
	 	 	 	 playString(i + Stringtype.LEGATOOFFSET);
	 	 	 	 updateGlobals();
	 	 	 	 return isNoteInRange;
	 	  	 }
 	 	
 	 	if(i > NUMOFSTRINGS * 2){
	 	 	Console.print("legato script went for too long");
 	 	
	 	 	return true;
 	 	}
 	 }
 	 //note was not close enough to trigger legato
 	 return isNoteInRange;
  }
 
 
 //interfacing between different fretting engines
 
 inline function playNextNoteOnNewString(notePlayed, velocityPlayed){
	 
 	if(Globals.g_frettingEngine == FrettingEngine.NATURAL)
 			{
 		
 				if(Globals.g_forcedHandPositionFret == -1)
 				{
 		
 					Globals.g_handPositionFret = naturalFretting2_2_1(notePlayed, Globals.g_handPositionFret);
 					
 				}else{
 					
 	
 					Globals.g_handPositionFret = naturalFretting2_2_1(notePlayed, Globals.g_forcedHandPositionFret);
 				}
 			}else if(Globals.g_frettingEngine == FrettingEngine.MELODY)
 			{
 		
 				if(Globals.g_forcedHandPositionFret == -1)
 						{
 							Globals.g_handPositionFret = melodyFretting1_0_0(notePlayed, Globals.g_handPositionFret);
 							
 						}else
 						{
 							Globals.g_handPositionFret = melodyFretting1_0_0(notePlayed, Globals.g_forcedHandPositionFret);
 						}
 			}
 			
 			//Had a bug where handPositionFret became -4 and I have no idea why so I'm normalizing out of caution
 			if(Globals.g_handPositionFret < 0){
 				Globals.g_handPositionFret = 0;
 			}
	 
 }
 
 
 
 function onNoteOn()
{
	local notePlayed = Message.getNoteNumber();
	local velocityPlayed = Message.getVelocity();

	
	//easy way to implement strumming system? Look into later
	//Message.delayEvent((notePlayed - LOWESTNOTE) * 1000);

	detectKeySwitch(notePlayed);
	
	if(Globals.g_resetNotes == true)
		resetNotes();
	
	if(notePlayed == legatoKeySwitchNote)
		legatoKeySwitchPlaying = true;
	
	if(legatoKeySwitchPlaying){
		
		if(!playNextNoteLegato(notePlayed, velocityPlayed)){
	
		playNextNoteOnNewString(notePlayed, velocityPlayed);
		
		}else{
			//Console.print("legato was played");
		}
	
	}else{

	
		playNextNoteOnNewString(notePlayed, velocityPlayed);
	}
	

	
	
}function onNoteOff()
{
    local releasedNote = Message.getNoteNumber();
    local noteFound = false;
    local noteFoundInLegato = false;

	if(releasedNote == legatoKeySwitchNote)
		legatoKeySwitchPlaying = false;

    for (var i = 0; i < NUMOFSTRINGS && !noteFound; i++)
		{
		    if (stringNote[i] == releasedNote)
		    {

		        stringNote[i] = NO_NOTE;
		        playString(i);
		        noteFound = true;
		        
		    }
		}

		
	for (var i = Stringtype.LEGATOOFFSET; i < stringNote.length && !noteFoundInLegato; i++)
			{
			    if (stringNote[i] == releasedNote)
			    {
	
			        stringNote[i] = NO_NOTE;
			        playString(i);
			        noteFoundInLegato = true;
			    }
			}
    
    updateGlobals();
}function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 