 Synth.deferCallbacks(false);
 Synth.setFixNoteOnAfterNoteOff(true);
 
 
 reg i = 0;
 reg rrCounter = 1;
 
 //Emulated releases didn't go as well as planned. But I'll keep it here for now
 Globals.g_emulatedReleasesOn = false;
 
include("NoteRangeAndOpenStringNote.js");

include("KeyswitchConstants.js");


var legatoKeySwitchPlaying = false;
 
 
 inline function isBetweenIncl(num, lowBound, highBound){
 	 return num >= lowBound && num <= highBound;
 }
 
 
 
 
 var legatoKeySwitchPlaying = false;
 
 // setting up keyswitches to mute samplers
 
inline function createAllMutersArray(articulationName){
	local arrayToReturn = [];
	local LeftMuter = Synth.getMidiProcessor("Left" + articulationName + "ContainerMute");
	local RightMuter = Synth.getMidiProcessor("Right" + articulationName + "ContainerMute");
	
	arrayToReturn.reserve(2);
	
	arrayToReturn.push(LeftMuter);
	arrayToReturn.push(RightMuter);

	return arrayToReturn;
}
 
const var susSamplerName = "Sus";

const var legDownSamplerName = "Leg";

const var legUpSamplerName = "Leg";
  
const var muteSamplerName = "Mute";

const var harmonicSamplerName = "Harmonic";
  
const var tremoloSamplerName = "Tremolo";

 
 // skipping SFX samplers for now. Do later if it exists
 
const var AllSusMuters = createAllMutersArray(susSamplerName);
const var AllMuteMuters = createAllMutersArray(muteSamplerName);
const var AllHarmonicMuters = createAllMutersArray(harmonicSamplerName);
const var AllTremoloMuters = createAllMutersArray(tremoloSamplerName);
 
 


//sfxcontainermute has been disabled because I might just have it be constantly available


const var AllContainerMuters = [];
AllContainerMuters.reserve(PerformanceType.NUMOFPERFORMANCES);

for(i = 0; i < PerformanceType.NUMOFPERFORMANCES; i++){
	AllContainerMuters.push(-1);
}

AllContainerMuters[PerformanceType.SUSTAIN] = AllSusMuters;
AllContainerMuters[PerformanceType.MUTE] = AllMuteMuters;
AllContainerMuters[PerformanceType.HARMONIC] = AllHarmonicMuters;
AllContainerMuters[PerformanceType.TREMOLO] = AllTremoloMuters;


const var NUMOFKEYSWITCHES = 4;

 
 inline function setAllSamplersMuted(){
 
	 for(i = 0; i < AllContainerMuters.length; i++){ 
		if(AllContainerMuters[i] != -1){
			for(var j = 0; j < AllContainerMuters[i].length; j++){
				AllContainerMuters[i][j].setAttribute("Bypass", true);
			}
		}
	 }
 }
 
 inline function setSamplerUnmuted(articulationIndex){
	 if(AllContainerMuters[articulationIndex] == -1){
		 Console.print("articulation doesn't have muter or doesn't exist");
	 }else{
		 for(i = 0; i < AllContainerMuters[articulationIndex].length; i++){
		 
			 	AllContainerMuters[articulationIndex][i].setAttribute("Bypass", false);
		 }
	 }
 }
 
 Globals.g_currArticulationPlaying = PerformanceType.SUSTAIN;
 
 inline function detectKeySwitch(notePlayed){
	 
 
	if(!isBetweenIncl(notePlayed, SUSTAINKEYSWITCHNOTE, SUSTAINKEYSWITCHNOTE + NUMOFKEYSWITCHES - 1)){
		//keyswitch was not pressed
		return 0;
	}
	
	
	setAllSamplersMuted();
	 
	 //emulated releases probably only work on sustains so set off by default
	 Globals.g_emulatedReleasesOn = false;
	 
	 if(notePlayed == SUSTAINKEYSWITCHNOTE){
	 
		 setSamplerUnmuted(PerformanceType.SUSTAIN);
		Globals.g_currArticulationPlaying = PerformanceType.SUSTAIN; 
		 Globals.g_emulatedReleasesOn = true;
	 }else if(notePlayed == MUTEKEYSWITCHNOTE){
	 
		 setSamplerUnmuted(PerformanceType.MUTE);
		 Globals.g_currArticulationPlaying = PerformanceType.MUTE;
		 
	 }else if(notePlayed == HARMONICKEYSWITCHNOTE){
		 
		 setSamplerUnmuted(PerformanceType.HARMONIC);
		 Globals.g_currArticulationPlaying = PerformanceType.HARMONIC;
	 }else if(notePlayed == TREMOLOKEYSWITCHNOTE){
		 
		 setSamplerUnmuted(PerformanceType.TREMOLO);
		 Globals.g_currArticulationPlaying = PerformanceType.TREMOLO;
	 }else if(notePlayed == SFXKEYSWITCHNOTE){
	 
		 Globals.g_currArticulationPlaying = PerformanceType.SFX;
		 
	 }
	 
 }
 
 
 
 detectKeySwitch(SUSTAINKEYSWITCHNOTE);
 

 
 //variables to correspond with the Fretdisplay
 
 //please refactor this later to all just be an array
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
var stringNoteId = [];
var currStrummingDirection = StrummingDirections.notStrumming;
var downStrumHeld = false;
var upStrumHeld = false;


stringNote.reserve(NUMOFSTRINGS);
for(i = 0; i < NUMOFSTRINGS * 2; i++){
	stringNote.push(NO_NOTE);
	stringNoteId.push(NO_NOTE);
}


inline function resetNotes(){
	for(var i = 0; i < stringNote.length - 1; i++){
		stringNote[i] = NO_NOTE;
	}
}

Message.setAllNotesOffCallback(resetNotes);

//one more push to make up for the "NOSTRING" and not go out of bounds when scanning string notes
stringNote.push(POSINFINITY);




// GUI TO HELP ME DEBUG

inline function onButton1Control(component, value)
{
	Console.print("~~~ NOTES CORRELATING TO THE STRINGS ~~~");

	for(var i = 0; i < NUMOFSTRINGS; i++){
		Console.print("String " + (i + 1) + ": " + stringNote[i] +" | legato: " + stringNote[i + StringType.LEGATOOFFSET]);
	}
};

Content.getComponent("Button1").setControlCallback(onButton1Control);




// functions to ensure only one sampler plays a voice at a time
// this should only take the StringType enum
inline function playString(stringToPlay){
	
	
	// consider refactoring stringNote to be updated here rather than the melody fretting point
	stringNoteId[stringToPlay] = Message.getEventId();
	
	
	// adding 1 because the enum starts on 0 but channels start on 1
	Message.setChannel(stringToPlay + 1);
	if(Globals.g_currRRBehaviour == RRBehaviour.LINEAR){
		linearRR_setSamplersRR(stringToPlay);
	}
}

inline function noteOffString(stringToOff){
	// adding 1 because the enum starts on 0 but channels start on 1
	Synth.noteOffByEventId(stringNoteId[stringToOff]);
	
	stringNote[stringToOff] = NO_NOTE;
	stringNoteId[stringToOff] = NO_NOTE;
	Message.setChannel(stringToOff + 1);
}
 

 
 inline function updateGlobals(){
 
 	if(stringNote[StringType.STRING1LEG] == NO_NOTE)
		Globals.g_stringNote1 = stringNote[StringType.STRING1];
	else
		Globals.g_stringNote1 = stringNote[StringType.STRING1LEG];
		
	if(stringNote[StringType.STRING2LEG] == NO_NOTE)
		Globals.g_stringNote2 = stringNote[StringType.STRING2];
	else
		Globals.g_stringNote2 = stringNote[StringType.STRING2LEG];
		
	if(stringNote[StringType.STRING3LEG] == NO_NOTE)
		Globals.g_stringNote3 = stringNote[StringType.STRING3];
	else
		Globals.g_stringNote3 = stringNote[StringType.STRING3LEG];
		
	if(stringNote[StringType.STRING4LEG] == NO_NOTE)
		Globals.g_stringNote4 = stringNote[StringType.STRING4];
	else{
		Globals.g_stringNote4 = stringNote[StringType.STRING4LEG];
		}
		
	if(stringNote[StringType.STRING5LEG] == NO_NOTE)
		Globals.g_stringNote5 = stringNote[StringType.STRING5];
	else
		Globals.g_stringNote5 = stringNote[StringType.STRING5LEG];
		
	if(stringNote[StringType.STRING6LEG] == NO_NOTE)
		Globals.g_stringNote6 = stringNote[StringType.STRING6];
	else
		Globals.g_stringNote6 = stringNote[StringType.STRING6LEG];

 }
 
 inline function isPolyphonyPlaying(){
	 return Synth.getNumPressedKeys() > 1;
 }
 
 
 // fretting engine designed for going low to high string then going back down
 // used primarily for quick debugging 
 
 inline function primitiveFretting(notePlayed){
 
	 if (stringNote[StringType.STRING6] == NO_NOTE){
	 	playString6();
	 	stringNote[StringType.STRING6] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING5] == NO_NOTE){
	 	playString5();
	 	stringNote[StringType.STRING5] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING4] == NO_NOTE){
	 	playString4();
	 	stringNote[StringType.STRING4] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING3] == NO_NOTE){
	 	playString3();
	 	stringNote[StringType.STRING3] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING2] == NO_NOTE){
	 	playString2();
	 	stringNote[StringType.STRING2] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING1] == NO_NOTE){
	 	playString1();
	 	stringNote[StringType.STRING1] = notePlayed;
	 	updateGlobals();
	 	return;
	 }
	 
	 
 }







/* 
The main logic for the "Natural" fretting mode in polyphony
*/
inline function stringWithClosestNote(notePlayed, currentHandPos){
	
	local currString = StringType.NOSTRING;
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
	
	
	local currString = StringType.NOSTRING;
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
	Globals.g_stringPerformance[Globals.g_forcedString] = Globals.g_currArticulationPlaying;
	
	newFretFromForceString = notePlayed - OPENSTRINGNOTES[Globals.g_forcedString];
	distanceBetweenForceAndAutoFret = Math.abs(newFretFromForceString - currentHandPos);
	
	//changes fret position if forceString's frets go a certain distance
	if(distanceBetweenForceAndAutoFret < fretSpaceToChange)
		{
		return currentHandPos;
		}
	else
		{
	// originally condition was greater than 17. still not sure why it bugs out without the cap
		if(newFretFromForceString > NOTESPERSTRING - 5)
			return NOTESPERSTRING - 5;
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

// the function returns the next fret for the algorithm and sets the message's midi channel
inline function naturalFretting2_2_1(notePlayed, currentHandPos)
{
	

	local distBetweenNewFretAndAutoFret = 0;
	local newFretFromPolyphony;
	
	// I've completely forgotten what fretSpaceToChange was
	// but I think it has to do polyphony
	local fretSpaceToChange = 2;
	local stringToPlay;
	local newHandPos;
	local forceStringLowBound;
	local forceStringHighBound;
	
	if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
	    return currentHandPos;
	}
	
	
	//Going to force string mode
	if(Globals.g_forcedString != -1)
	{


	// Yes, that -1 of NOTESPERSTRING is needed.
	forceStringLowBound = OPENSTRINGNOTES[Globals.g_forcedString];
	forceStringHighBound = OPENSTRINGNOTES[Globals.g_forcedString] + NOTESPERSTRING - 1;
	
		if(isBetweenIncl(notePlayed, forceStringLowBound, forceStringHighBound) && stringNote[Globals.g_forcedString] == -1)
		{
		
			return forceStringLogic(notePlayed, currentHandPos, fretSpaceToChange);
			
		}
	}
	
	
	//no forced string and therefore just goes as normal
	
	
	stringToPlay = stringWithClosestNote(notePlayed, currentHandPos);
	stringNote[stringToPlay] = notePlayed;
	Globals.g_stringPerformance[stringToPlay] = currArticulationPlaying;
	playString(stringToPlay);
	
	
	updateGlobals();
	
	
	//when there's polyphony, virtual guitarist moves hand to wherever the biggest change in pos is
	if(Synth.getNumPressedKeys() >= 2 && stringToPlay != StringType.NOSTRING){
	//change fret position to suit the chord fingering more.
	
	newFretFromPolyphony = stringNote[stringToPlay] - OPENSTRINGNOTES[stringToPlay];
	distBetweenNewFretAndAutoFret = Math.abs(newFretFromPolyphony - currentHandPos);
	}else{
	
	
	
		if(stringToPlay == StringType.STRING1){
			if(notePlayed - currentHandPos < OPENSTRING1NOTE + 5)
	       		return currentHandPos;
	        else
	        {
	        	newHandPos = notePlayed - OPENSTRING1NOTE - 4;
	            return newHandPos;
	         }
		}
		
		if(stringToPlay == StringType.STRING6){
			if(notePlayed < currentHandPos + OPENSTRING6NOTE){
				newHandPos = notePlayed - OPENSTRING6NOTE;
				return newHandPos;
			
			}
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

*/

inline function melodyFretting1_0_0(notePlayed, currentHandPos)
{
	
	local distBetweenNewFretAndAutoFret = 0;
	local newFretFromPolyphony;
	local fretSpaceToChange = 5;
	local stringToPlay;
	local newHandPos;
	
	if(!isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
	    return currentHandPos;
	}
	
	
	//Going to force string mode
	if(Globals.g_forcedString != -1)
	{

		if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.g_forcedString], OPENSTRINGNOTES[Globals.g_forcedString] + NOTESPERSTRING - 1) && stringNote[Globals.g_forcedString] == NO_NOTE)
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
		
		// Figure out the stringWithMelodyNote first and then figure where the fret position changes
		if(notePlayed > OPENSTRINGNOTES[stringToPlay] + 3){
			return currentHandPos;
		}
	}else
	{
		return currentHandPos;
	}
}


 
 inline function isEventStillPlaying(eventId)
 {
// I dont think this is actually used like.... at all bruh	
	

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


	local isNoteInRange = false;

	//exit early because it should just play the note on a new string
	if(!isPolyphonyPlaying())
	{
		return false;
	}
	
		
 	 for( var i = 0; i < NUMOFSTRINGS && !noteInRange; i++){
 	 
 	 
	 	 if(isBetweenIncl(notePlayed, stringNote[i] - Globals.g_legatoRange, stringNote[i] + Globals.g_legatoRange)){
	 	 	 	 isNoteInRange = true;
	 	 	 	 
	 	 	 	 if(notePlayed > stringNote[i]){
	 	 	 	 	Globals.g_stringPerformance[i] = PerformanceType.LEGATOUP;
	 	 	 	 	Globals.g_currArticulationPlaying = PerformanceType.LEGATOUP;
	 	 	 	 }
	 	 	 	 else{
	 	 	 	 	Globals.g_stringPerformance[i] = PerformanceType.LEGATODOWN;
	 	 	 	 	Globals.g_currArticulationPlaying = PerformanceType.LEGATODOWN;
	 	 	 	 }
	 	 	 	 

	 	 	 	stringNote[i] = notePlayed;
				stringNote[i + StringType.LEGATOOFFSET] = notePlayed;
	 	 	 	 playString(i + StringType.LEGATOOFFSET);
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
 
 
 // interfacing between different fretting engines
 
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
 
 
 
 // setting up RR handling. Primarily just here to make double tracking between left and right.
 // Maybe make it randomized later

inline function createAllLeftArticSamplerArray(articName, lowBound, highBound){
	
	local samplerArrayToReturn = [];
	local samplerToPush;
	local numOfSamplers = highBound - lowBound + 1;

	samplerArrayToReturn.reserve(numOfSamplers);
	
	for(i = lowBound; i <= highBound; i++){
		samplerToPush = Synth.getChildSynth("LeftString" + i + articName + "Sampler");
		samplerArrayToReturn.push(samplerToPush);
	}

	return samplerArrayToReturn;
	
}


inline function createAllRightArticSamplerArray(articName, lowBound, highBound){
	
	local samplerArrayToReturn = [];
	local samplerToPush;
	local numOfSamplers = highBound - lowBound + 1;

	samplerArrayToReturn.reserve(numOfSamplers);
	
	for(i = lowBound; i <= highBound; i++){
		samplerToPush = Synth.getChildSynth("RightString" + i + articName + "Sampler");
		samplerArrayToReturn.push(samplerToPush);
	}

	return samplerArrayToReturn;
	
}

const var legDownSamplerLowestStringNum = 1;
const var legDownSamplerHighestStringNum = NUMOFSTRINGS;

const var legUpSamplerLowestStringNum = 1;
const var legUpSamplerHighestStringNum = NUMOFSTRINGS;


const var susSamplerLowestStringNum = 1;
const var susSamplerHighestStringNum = NUMOFSTRINGS;
  
const var muteSamplerLowestStringNum = 1;
const var muteSamplerHighestStringNum = NUMOFSTRINGS;

 const var harmonicSamplerLowestStringNum = 1;
 const var harmonicSamplerHighestStringNum = NUMOFSTRINGS;
  
  
const var tremoloSamplerLowestStringNum = 1;
const var tremoloSamplerHighestStringNum = NUMOFSTRINGS;

 
const var AllSusLeftSamplers = createAllLeftArticSamplerArray(susSamplerName, susSamplerLowestStringNum, susSamplerHighestStringNum);

const var AllSusRightSamplers = createAllRightArticSamplerArray(susSamplerName, susSamplerLowestStringNum, susSamplerHighestStringNum);

 
const var AllLegDownLeftSamplers = createAllLeftArticSamplerArray(legDownSamplerName, legDownSamplerLowestStringNum, legDownSamplerHighestStringNum);

const var AllLegDownRightSamplers = createAllRightArticSamplerArray(legDownSamplerName, legDownSamplerLowestStringNum, legDownSamplerHighestStringNum);

const var AllLegUpLeftSamplers = createAllLeftArticSamplerArray(legUpSamplerName, legUpSamplerLowestStringNum, legUpSamplerHighestStringNum);

const var AllLegUpRightSamplers = createAllRightArticSamplerArray(legUpSamplerName, legUpSamplerLowestStringNum, legUpSamplerHighestStringNum);


 
 const var AllMuteLeftSamplers = createAllLeftArticSamplerArray(muteSamplerName, muteSamplerLowestStringNum, muteSamplerHighestStringNum);
 
 const var AllMuteRightSamplers = createAllRightArticSamplerArray(muteSamplerName, muteSamplerLowestStringNum, muteSamplerHighestStringNum);
 
 
 const var AllHarmonicLeftSamplers = createAllLeftArticSamplerArray(harmonicSamplerName, harmonicSamplerLowestStringNum, harmonicSamplerHighestStringNum);
 
 const var AllHarmonicRightSamplers = createAllRightArticSamplerArray(harmonicSamplerName, harmonicSamplerLowestStringNum, harmonicSamplerHighestStringNum);
 


const var AllTremoloLeftSamplers = createAllLeftArticSamplerArray(tremoloSamplerName, tremoloSamplerLowestStringNum, tremoloSamplerHighestStringNum);

const var AllTremoloRightSamplers = createAllRightArticSamplerArray(tremoloSamplerName, tremoloSamplerLowestStringNum, tremoloSamplerHighestStringNum);


// skipping SFX samplers for now. Do later
 
const var AllLeftSamplers = [];
AllLeftSamplers.reserve(PerformanceType.NUMOFPERFORMANCES);

const var AllRightSamplers = [];
AllRightSamplers.reserve(PerformanceType.NUMOFPERFORMANCES);

for(i = 0; i < PerformanceType.NUMOFPERFORMANCES; i++){
	AllLeftSamplers.push(-1);
	AllRightSamplers.push(-1);
}

AllLeftSamplers[PerformanceType.SUSTAIN] = AllSusLeftSamplers;
AllLeftSamplers[PerformanceType.MUTE] = AllMuteLeftSamplers;
AllLeftSamplers[PerformanceType.HARMONIC] = AllHarmonicLeftSamplers;
AllLeftSamplers[PerformanceType.TREMOLO] = AllTremoloLeftSamplers;
AllLeftSamplers[PerformanceType.LEGATOUP] = AllLegUpLeftSamplers;
AllLeftSamplers[PerformanceType.LEGATODOWN] = AllLegDownLeftSamplers;



AllRightSamplers[PerformanceType.SUSTAIN] = AllSusRightSamplers;
AllRightSamplers[PerformanceType.MUTE] = AllMuteRightSamplers;
AllRightSamplers[PerformanceType.HARMONIC] = AllHarmonicRightSamplers;
AllRightSamplers[PerformanceType.TREMOLO] = AllTremoloRightSamplers;
AllRightSamplers[PerformanceType.LEGATOUP] = AllLegUpRightSamplers;
AllRightSamplers[PerformanceType.LEGATODOWN] = AllLegDownRightSamplers;



// Need to disable round robin behaviour for randomization
inline function disableStandardRRBehaviour(){

	for(i = 0; i < AllLeftSamplers.length; i++){
		if(AllLeftSamplers[i] != -1){
	
			for(var j = 0; j < AllLeftSamplers[i].length; j++){
				AllLeftSamplers[i][j].asSampler().enableRoundRobin(false);
				AllRightSamplers[i][j].asSampler().enableRoundRobin(false);
			}
		}
	}
}


// keep in mind that the right samplers still need disabled RRs as it needs to very precisely be incremented from the left

inline function enableLinearRRBehaviour(){
	

	Globals.g_currRRBehaviour = RRBehaviour.LINEAR;

	for(i = 0; i < AllLeftSamplers.length; i++){
		if(AllLeftSamplers[i] != -1){
	
			for(var j = 0; j < AllLeftSamplers[i].length; j++){
				AllLeftSamplers[i][j].asSampler().enableRoundRobin(false);
				AllRightSamplers[i][j].asSampler().enableRoundRobin(false);
			}
		}
	}
}

enableLinearRRBehaviour();

const var numOfRRs = [];
numOfRRs.reserve(PerformanceType.NUMOFPERFORMANCES);

for(i = 0; i < PerformanceType.NUMOFPERFORMANCES; i++){
	numOfRRs.push(-1);
}


// I'd rather do this manually but the functions are bugging out on me for some reason
// will need to look into getNumActiveGroups and getRRGroupsForMessage

numOfRRs[PerformanceType.SUSTAIN] = 6;
numOfRRs[PerformanceType.MUTE] = 6;
numOfRRs[PerformanceType.HARMONIC] = 2;
numOfRRs[PerformanceType.LEGATOUP] = 6;
numOfRRs[PerformanceType.LEGATODOWN] = 6;

// Make sure any sampler that only has 1 RR does transposition trick to not go down to mono
numOfRRs[PerformanceType.TREMOLO] = 1;

inline function linearRR_setSamplersRR(stringPlaying){



	local rightSamplerToIncrement;
	local leftSamplerToIncrement;
	local RRForLeftSampler;
	local RRForRightSampler;
	local currArticulation;
	local stringToPlay = stringPlaying % NUMOFSTRINGS;
	
	
	currArticulation = Globals.g_currArticulationPlaying;
	
	rightSamplerToIncrement = AllRightSamplers[currArticulation][stringToPlay];
	leftSamplerToIncrement = AllLeftSamplers[currArticulation][stringToPlay];
	
	
	if(numOfRRs[currArticulation] >= 2){
	
	rrCounter = (rrCounter % numOfRRs[currArticulation]) + 1;
	
	
	RRForLeftSampler = rrCounter;
	
	// % makes sure it doesn't loop around and the final + 1 because 0th RR passes error
	RRForRightSampler = (RRFromLeftSampler % numOfRRs[currArticulation]) + 1;
	
	rightSamplerToIncrement.asSampler().setActiveGroup(RRForRightSampler);
	leftSamplerToIncrement.asSampler().setActiveGroup(RRForLeftSampler);
	}else{
		
		// make sure any sampler for this does the transposition trick for whatever RR needs it
	
		rightSamplerToIncrement.asSampler().setActiveGroup(1);
		leftSamplerToIncrement.asSampler().setActiveGroup(1);
	}
}

// setting up strumming functions

inline function linMap(value, inMin, inMax, outMin, outMax)
{
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

inline function strumIfStrumKeyPressed(notePlayed, noteIdsToUpdate, heldNotes, noteVelocity){


	if(notePlayed != StrummingKeyswitch.downStrumKeyswitch && notePlayed != StrummingKeyswitch.upStrumKeyswitch){
		return false;
	}
	
	Message.delayEvent(1);
	
	Message.ignoreEvent(true);

		
	if(notePlayed == StrummingKeyswitch.downStrumKeyswitch){
		downStrumHeld = true;
		currStrummingDirection = StrummingDirections.downStrumming;
		downStrum(notesFiltered, noteIdsToUpdate, noteVelocity, currStrummingDirection);
		return true;
	}
	
	
	/*
	if(notePlayed == StrummingKeyswitch.upStrumKeyswitch){
		upStrumHeld = true;
		currStrummingDirection = StrummingDirections.upStrumming;
		upStrum(notesFiltered, noteVelocity, currStrummingDirection);
		return true;
	}*/
	
}



const var fastestTotalStrumTime = 5;
const var slowestTotalStrumTime = 350;



const var fastestStrumRandomizationPercent = 0.45;
const var slowestStrumRandomizationPercent = 0.1;
  
const var notesFilteredForStrum = [];
notesFilteredForStrum.reserve(NUMOFSTRINGS);

for(i = 0; i < NUMOFSTRINGS; i++){
	notesFilteredForStrum.push(-1);
}

const var filteredNoteIds = [];
filteredNoteIds.reserve(NUMOFSTRINGS);

for(i = 0; i < NUMOFSTRINGS; i++){
	filteredNoteIds.push(-1);
}

var numOfNotesPlaying = 0;

inline function updateNumOfNotesPlayingCount(notesPlaying){
	numOfNotesPlaying = 0;

	for(i = 0; i < notesPlaying.length; i++){
		if(notesPlaying[i] != NO_NOTE){
			numOfNotesPlaying++;
		}
	}
}

inline function downStrum(notesToStrum, noteIdsToUpdate, noteVelocity, strummingDirection){
	local thisStrumDirection = strummingDirection;
	
	local totalTimeMS = linMap(noteVelocity, 1, 127, slowestTotalStrumTime, fastestTotalStrumTime);
	
	local totalTimeSamples = Engine.getSamplesForMilliSeconds(totalTimeMS);
	local indivNoteDelay;
	local indivNoteDelayRandomized;
	local idToRelease;
	local numOfStringPlaying = NO_STRING;
	
	local randomizedNoteVelocity;
	
	local strumRandomizationPercent = linMap(noteVelocity, 1, 127, slowestStrumRandomizationPercent, fastestStrumRandomizationPercent);
	
	updateNumOfNotesPlayingCount(notesToStrum);
	
	if(numOfNotesPlaying > 1)
		indivNoteDelay = totalTimeSamples/(noteCount - 1);
	else if(numOfNotesPlaying == 1)
	{
		for(i = 0; i < NUMOFSTRINGS && numOfStringPlaying == NO_STRING; i++){
			if(notesToStrum != NO_NOTE){
				numOfStringPlaying = i;
			}
		}
		
		
	}else{
		
	}
	
}

inline function releaseStrumKeyIfReleased(noteReleased){
	
	if(noteReleased == StrummingKeyswitch.downStrumKeyswitch){
		downStrumHeld = false;
	}else if(noteReleased == StrummingKeyswitch.upStrumKeyswitch){
		upStrumHeld = false;
	}else{
		return false;
	}
	
	if(downStrumHeld || upStrumHeld){
		return false;
	}
	
	
	for(i = 0; i < stringNoteId.length; i++){
		
		if(stringNoteId[i] != -1){
			
	/*	
	At the moment , randomizing a delayed off time seems to create hanging heldNotes so I'll just keep with making it a super fast release
		Synth.noteOffDelayedByEventId(testIds[i], Math.randInt(0, 10) * Engine.getSamplesForMilliSeconds(2));
	*/
	
	Synth.noteOffDelayedByEventId(stringNoteId[i], Math.random() * Engine.getSamplesForMilliSeconds(10));
		stringNoteId[i] = -1;
			}
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
	
	if(isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
		if(legatoKeySwitchPlaying){
			
			local didPlayNoteLegato = playNextNoteLegato(notePlayed, velocityPlayed);
			if(!didPlayNoteLegato){
		
			playNextNoteOnNewString(notePlayed, velocityPlayed);
			
			}else{
				//Console.print("legato was played");
			}
		
		}else{
	
			playNextNoteOnNewString(notePlayed, velocityPlayed);
			
		}
	}
	
	
	
	
	if(notePlayed == StrummingKeyswitches.downStrumKeyswitch){
	 // C7 in HISE
	 
	}
	// eventualy put this for the string chosen
}
	
function onNoteOff()
{
    local releasedNote = Message.getNoteNumber();
    local releasedNoteId = Message.getEventId();
    local noteFound = false;
    local noteFoundInLegato = false;

	if(releasedNote == legatoKeySwitchNote)
		legatoKeySwitchPlaying = false;

    for (i = 0; i < NUMOFSTRINGS && !noteFound; i++)
		{
		    if (stringNoteId[i] == releasedNoteId)
		    {
		        noteOffString(i);
		        noteFound = true;
		        
		    }
		}

		
	for (var i = StringType.LEGATOOFFSET; i < stringNote.length && !noteFoundInLegato; i++)
			{
	//Not tested yet with noteId because I lowkey forgor how to do legato. Will need to try later

			    if (stringNoteId[i] == releasedNoteId)
			    {
	
			        stringNote[i] = NO_NOTE;
			        noteOffString(i);
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
 