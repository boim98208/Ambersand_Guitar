const var releaseAddition = [1, 4, 5];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var OPENSTRINGNOTE = 67;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);
const var LEGATOCHNLOFFSET = 6;


/*
reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg releaseId = -99;

reg noteReleased;
reg noteVelocity = 60;*/


//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 5;
var releaseVolumeOverTime = Globals.g_releaseVolume;


//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .03;
function onNoteOn()
{
	
	if(Message.getChannel() == 3){
		    
		Globals.g_string3ActiveRR = Sampler.getActiveRRGroup();
		
	}
	else{
		Message.ignoreEvent(true);
	}
	
}
 function onNoteOff()
{

	if(Message.getChannel() != 3){
		Message.ignoreEvent(true);
	}else{
		Globals.g_string3ActiveRR = "not playing";
	}
}
  function onController()
{
	
}
 function onTimer()
{
	
	/*

local releaseNote;
local numOfReleases;

 if(!Globals.g_emulatedReleasesOn){
	 return;
 
	}
	
	if(releaseId != -99)
		Synth.noteOffByEventId(releaseId);
	
	if(isReleased){
	
		
		
		if(noteReleased < POINTTOCHANGERELEASE)
			{		
			releaseNote = noteReleased + releaseAddition[releaseAdditionIndex];
			numOfReleases = releaseAddition.length;
			}
		else
			{
			releaseNote = noteReleased + releaseAdditionWhenHigh[releaseAdditionIndex];
			numOfReleases = releaseAdditionWhenHigh.length;

			}
		
		
		if(noteVelocity == 0)
			releaseId = Synth.playNote(releaseNote, 1);
		else
		{
		//consider having go either the volume of the note played or something else

			releaseId = Synth.playNote(releaseNote, 60);

		}
		
		
		Synth.addVolumeFade(releaseId, 0, releaseVolumeOverTime);

		
		releaseVolumeOverTime = releaseVolumeOverTime - .02;
		
		releaseAdditionIndex++;
		Synth.startTimer(releaseTimeSeconds);
		
		if(releaseAdditionIndex >= numOfReleases - 1){ 
			isReleased = false;
			releaseAdditionIndex = 0;
			Synth.addVolumeFade(releaseId, .01, -100);
			releaseId = -99;
		}
		
		
	}
	*/
	

	
}
 function onControl(number, value)
{
	
}
 