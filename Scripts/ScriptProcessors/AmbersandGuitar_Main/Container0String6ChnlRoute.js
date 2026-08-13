const var releaseAddition = [10, 11, 10];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var OPENSTRINGNOTE = 52;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);
const var LEGATOCHNLOFFSET = 6;


reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg noteReleased;
reg noteVelocity = 60;


//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 10;
var releaseVolumeOverTime = startReleaseVolume;
//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .03;
function onNoteOn()
{


	Message.makeArtificial();
	
	if(Message.getChannel() == 6){
		//is now playing the note and updates
		Synth.stopTimer();   
		isReleased = false;
		releaseAdditionIndex = 0;
		Globals.g_string6ActiveRR = Sampler.getActiveRRGroup();
		noteVelocity = Message.getVelocity();
		id = Message.getEventId();
		
	}else if(Message.getChannel() == 6 + LEGATOCHNLOFFSET){
		
		Synth.noteOffByEventId(id);
		Message.ignoreEvent(true);
	}
	else{
		Message.ignoreEvent(true);
	}
	
}
 function onNoteOff()
{

	if(Message.getChannel() != 6){
		Message.ignoreEvent(true);
	}else{
		isReleased = true;
		noteReleased = Message.getNoteNumber();
		releaseVolumeOverTime = startReleaseVolume;
		Globals.g_string6ActiveRR = "not playing";
		Synth.startTimer(0.02);
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
	
	if(id != -99)
		Synth.noteOffByEventId(id);
	
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
			id = Synth.playNote(releaseNote, 1);
		else
		{
		//consider having go either the volume of the note played or something else

			id = Synth.playNote(releaseNote, 60);

		}
		
		
		Synth.addVolumeFade(id, 0, releaseVolumeOverTime);
		
		releaseVolumeOverTime = releaseVolumeOverTime - .02;
		
		releaseAdditionIndex++;
		Synth.startTimer(releaseTimeSeconds);
		
		if(releaseAdditionIndex == numOfReleases - 1){ 
			isReleased = false;
			releaseAdditionIndex = 0;
		}
		
		
	}
	

	
}
 function onControl(number, value)
{
	
}
 