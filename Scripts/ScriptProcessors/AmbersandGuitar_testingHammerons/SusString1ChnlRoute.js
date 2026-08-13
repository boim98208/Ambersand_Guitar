const var releaseAddition = [1, 4, 5];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var OPENSTRINGNOTE = 76;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);
const var LEGATOCHNLOFFSET = 6;


reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg releaseId = -99;

reg noteReleased;
reg noteVelocity = 60;


//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 15;
var releaseVolumeOverTime = Globals.g_releaseVolume;


//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .03;
function onNoteOn()
{


	Message.makeArtificial();
	
	if(Message.getChannel() == 1){
		//is now playing the note and updates
		Synth.stopTimer();   
		isReleased = false;
		releaseAdditionIndex = 0;
		
		if(releaseId != -99){
		        Synth.noteOffByEventId(releaseId);
		        releaseId = -99;
		}
		    
		Globals.g_string1ActiveRR = Sampler.getActiveRRGroup();
		noteVelocity = Message.getVelocity();
		id = Message.getEventId();
		
	}else if(Message.getChannel() == 1 + LEGATOCHNLOFFSET){
		
		Synth.noteOffByEventId(id);
		Message.ignoreEvent(true);
	}
	else{
		Message.ignoreEvent(true);
	}
	
}
 function onNoteOff()
{

	if(Message.getChannel() != 1){
		Message.ignoreEvent(true);
	}else{
	
		isReleased = true;
		noteReleased = Message.getNoteNumber();
		releaseVolumeOverTime = Globals.g_releaseVolume;
		Globals.g_string1ActiveRR = "not playing";
		Synth.startTimer(0.01);
		Synth.noteOffByEventId(id);
	}
}
  function onController()
{
	
}
 function onTimer()
{
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
	

	
}
 function onControl(number, value)
{
	
}
 