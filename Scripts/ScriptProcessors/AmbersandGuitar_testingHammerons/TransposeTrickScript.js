include("KeyswitchConstants.js");

include("NoteRangeAndOpenStringNote.js");

inline function isBetweenIncl(num, lowBound, highBound){
	 return num >= lowBound && num <= highBound;
}


inline function transposeUpTrick(semitones){
	Message.setTransposeAmount(-semitones);
	Message.setCoarseDetune(semitones);
}



inline function transposeDownTrick(semitones){
	Message.setTransposeAmount(semitones);
	Message.setCoarseDetune(-semitones);
}function onNoteOn()
{
	local notePlayed = Message.getNoteNumber();


	// Works in theory

	if(Globals.g_currArticulationPlaying == PerformanceType.TREMOLO){
		if(isBetweenIncl(notePlayed, LOWESTNOTE, HIGHESTNOTE)){
			
			// note is at the lowest range, grab sample from high up and pitch shift it down
			if(isBetweenIncl(notePlayed, LOWESTNOTE, LOWESTNOTE + NOTEPITCHSPREAD)){
				transposeDownTrick(NOTEPITCHSPREAD);
			}else{
			// otherwise just getting the sample from down below
			
				transposeUpTrick(NOTEPITCHSPREAD);
			} 
		}
	}
	


}
 function onNoteOff()
{
	
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
 