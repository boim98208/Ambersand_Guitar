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
 
 const var NOTESPERSTRING = 22;
 
 const var OPENSTRINGNONOTE = POSINFINITY;
 
 const var OPENSTRINGNOTES = [OPENSTRING1NOTE, OPENSTRING2NOTE, OPENSTRING3NOTE, OPENSTRING4NOTE, OPENSTRING5NOTE, OPENSTRING6NOTE];
 
 OPENSTRINGNOTES.push(OPENSTRINGNONOTE);

 
 namespace StringType
 {
 
     const var STRING1 = 0;
     const var STRING2 = 1;
     const var STRING3 = 2;
     const var STRING4 = 3;
     const var STRING5 = 4;
     const var STRING6 = 5;
     const var LEGATOOFFSET = 6;
     
     const var STRING1LEG = 6;
     const var STRING2LEG = 7;
     const var STRING3LEG = 8;
     const var STRING4LEG = 9;
     const var STRING5LEG = 10;
     const var STRING6LEG = 11;
     const var NOSTRING = 12;
 
 }
 
 namespace FrettingEngine
 {
	//make sure this lines up with the item list from the combo box

 	const var NATURAL = 1;
 	const var MELODY = 2;
 }
 
 
 const var string6Mute = Synth.getMidiProcessor("Container0String6Mute");
 const var string5Mute = Synth.getMidiProcessor("Container0String5Mute");
 const var string4Mute = Synth.getMidiProcessor("Container0String4Mute");
 const var string3Mute = Synth.getMidiProcessor("Container0String3Mute");
 const var string2Mute = Synth.getMidiProcessor("Container0String2Mute");
 const var string1Mute = Synth.getMidiProcessor("Container0String1Mute");
 
/*
 string6Mute.setAttribute("Bypass", true);
 string5Mute.setAttribute("Bypass", true);
 string4Mute.setAttribute("Bypass", true);
 string3Mute.setAttribute("Bypass", true);
 string2Mute.setAttribute("Bypass", true);
 string1Mute.setAttribute("Bypass", true);
 */
 
 //variables to correspond with the Fretdisplay
 Globals.g_stringNote1 = -1;
 Globals.g_stringNote2 = -1;
 Globals.g_stringNote3 = -1;
 Globals.g_stringNote4 = -1;
 Globals.g_stringNote5 = -1;
 Globals.g_stringNote6 = -1;
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
	stringNote.push(-1);
}

Console.print(stringNote.length);


//one more push to make up for the "NOSTRING" and not go out of bounds
stringNote.push(POSINFINITY);


//this is where the leftmost part of the virtual guitarist's hand is



//functions to ensure only one sampler plays a voice at a time


//setAttributes might be redundant right now but I'm too scared of it breaking
//so I'll leave it there for now

/*
inline function playString6(){ 
string6Mute.setAttribute("Bypass", false);
Message.setChannel(6); 
}

inline function playString5(){ 
string5Mute.setAttribute("Bypass", false);
Message.setChannel(5); }

inline function playString4(){
string4Mute.setAttribute("Bypass", false);
 Message.setChannel(4); }

inline function playString3(){
string3Mute.setAttribute("Bypass", false);
 Message.setChannel(3); }

inline function playString2(){
	string2Mute.setAttribute("Bypass", false);
 Message.setChannel(2); }

inline function playString1(){ 
string1Mute.setAttribute("Bypass", false);
Message.setChannel(1); }
*/


//this should only take the StringType enum
inline function playString(theStringType){
	
	//adding 1 because the enum starts on 0 but channels start on 1
	Message.setChannel(theStringType + 1);
}
 
 
 
 inline function isBetweenIncl(num, lowBound, highBound){
 	 return num >= lowBound && num <= highBound;
 }
 

 
 inline function updateGlobals(){
	 //todo: add Globals.g_stringNote to update also for whent the legato notes arent empty
 
	 Globals.g_stringNote1 = stringNote[StringType.STRING1];
	 Globals.g_stringNote2 = stringNote[StringType.STRING2];
	 Globals.g_stringNote3 = stringNote[StringType.STRING3];
	 Globals.g_stringNote4 = stringNote[StringType.STRING4];
	 Globals.g_stringNote5 = stringNote[StringType.STRING5];
	 Globals.g_stringNote6 = stringNote[StringType.STRING6];
 }
 
 inline function isPolyphonyPlaying(){
	 return Synth.getNumPressedKeys() > 1;
 }
 
 //fretting engine designed for going low to high string then going back down
 //use primarily for quick debugging 
 
 inline function primitiveFretting(notePlayed){
 
	 if (stringNote[StringType.STRING6] == -1){
	 	playString6();
	 	stringNote[StringType.STRING6] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING5] == -1){
	 	playString5();
	 	stringNote[StringType.STRING5] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING4] == -1){
	 	playString4();
	 	stringNote[StringType.STRING4] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING3] == -1){
	 	playString3();
	 	stringNote[StringType.STRING3] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING2] == -1){
	 	playString2();
	 	stringNote[StringType.STRING2] = notePlayed;
	 	updateGlobals();
	 	return;
	 }else if (stringNote[StringType.STRING1] == -1){
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
//todo: implement logic for when there's legato


	local newFretFromForceString;
	local distanceBetweenForceAndAutoFret;

	if(isBetweenIncl(notePlayed, OPENSTRINGNOTES[Globals.g_forcedString], OPENSTRINGNOTES[Globals.g_forcedString] + (NOTESPERSTRING - 1)) && stringNote[Globals.g_forcedString] == -1)
	{
	
	
	
	stringNote[Globals.g_forcedString] = notePlayed; 
	
	updateGlobals(); 
	playString(Globals.g_forcedString);
	
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
	playString(stringToPlay);
	

	updateGlobals();
	
	
	//when there's polyphony, virtual guitarist moves hand to wherever the biggest change in pos is
	if(Synth.getNumPressedKeys() >= 2){
	newFretFromPolyphony = stringNote[stringToPlay] - OPENSTRINGNOTES[stringToPlay];
	distBetweenNewFretAndAutoFret = Math.abs(newFretFromPolyphony - currentHandPos);
	}else{
	
	
		if(stringToPlay == StringType.STRING1){
			if(notePlayed - currentHandPos < OPENSTRING1NOTE + 5)
	            return currentHandPos;
	        else
	            return notePlayed - OPENSTRING1NOTE - 4;
		}
		
		if(stringToPlay == StringType.STRING6){
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

	local isNoteInRange = false;

	//exit early because it should just play the note on a new string
	if(!isPolyphonyPlaying())
	{
		return false;
	}
	
		
 	 for(i = 0; i < NUMOFSTRINGS || !noteInRange; i++){
 	 
 	 
	 	 if(isBetweenIncl(notePlayed, stringNote[i] - Globals.g_legatoRange, stringNote[i] + Globals.g_legatoRange)){
	 	 	 	 isNoteInRange = true;
	 	 	 	 Console.print(i + StringType.LEGATOOFFSET);
	 	 	 	 stringNote[i + StringType.LEGATOOFFSET] = notePlayed;
	 	 	 	 stringNote[i] = notePlayed;
	 	 	 	 
	 	 	 	 playString(i + StringType.LEGATOOFFSET);
	 	 	 	 return isNoteInRange;
	 	  	 }
 	 	
 	 	if(i > 12){
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



	if(!playNextNoteLegato(notePlayed, velocityPlayed)){


	Console.print("bruh");
	playNextNoteOnNewString(notePlayed, velocityPlayed);
		
	
	
	}else{
		Console.print("did you work");
	}

	
	
}function onNoteOff()
{
    local releasedNote = Message.getNoteNumber();
    


    if(stringNote[StringType.STRING6] == releasedNote){
        stringNote[StringType.STRING6] = -1;
        playString(StringType.STRING6);
    }else if(stringNote[StringType.STRING5] == releasedNote){
        stringNote[StringType.STRING5] = -1;
        playString(StringType.STRING5);
    }else if(stringNote[StringType.STRING4] == releasedNote){
        stringNote[StringType.STRING4] = -1;
        playString(StringType.STRING4);
    }else if(stringNote[StringType.STRING3] == releasedNote){
        stringNote[StringType.STRING3] = -1;
        playString(StringType.STRING3);
    }else if(stringNote[StringType.STRING2] == releasedNote){
        stringNote[StringType.STRING2] = -1;
        playString(StringType.STRING2);
    }else if(stringNote[StringType.STRING1] == releasedNote){
        stringNote[StringType.STRING1] = -1;
        playString(StringType.STRING1);
    }if(stringNote[StringType.STRING6LEG] == releasedNote){
        stringNote[StringType.STRING6LEG] = -1;
        playString(StringType.STRING6LEG);
    }else if(stringNote[StringType.STRING5LEG] == releasedNote){
        stringNote[StringType.STRING5LEG] = -1;
        playString(StringType.STRING5LEG);
    }else if(stringNote[StringType.STRING4LEG] == releasedNote){
        stringNote[StringType.STRING4LEG] = -1;
        playString(StringType.STRING4LEG);
    }else if(stringNote[StringType.STRING3LEG] == releasedNote){
        stringNote[StringType.STRING3LEG] = -1;
        playString(StringType.STRING3LEG);
    }else if(stringNote[StringType.STRING2LEG] == releasedNote){
        stringNote[StringType.STRING2LEG] = -1;
        playString(StringType.STRING2LEG);
    }else if(stringNote[StringType.STRING1LEG] == releasedNote){
        stringNote[StringType.STRING1LEG] = -1;
        playString(StringType.STRING1LEG);
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
 