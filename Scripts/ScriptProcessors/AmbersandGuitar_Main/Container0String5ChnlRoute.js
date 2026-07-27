const var releaseAddition = [10, 11, 10];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var emulatedReleasesOn = Globals.g_emulatedReleasesOn
const var OPENSTRINGNOTE = 57;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);



reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg noteReleased;
reg noteVelocity = 60;



Synth.stopTimer();

//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 10;
var releaseVolumeOverTime = startReleaseVolume;
//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .03;
function onNoteOn()
{


	if(Message.getChannel() != 5){
		
		Message.ignoreEvent(true);
	}else{
		//is now playing the note and updates	
		Globals.g_string5ActiveRR = Sampler.getActiveRRGroup();
		noteVelocity = Message.getVelocity();
		
	}
	
}
 function onNoteOff()
{

	if(Message.getChannel() != 5){
		Message.ignoreEvent(true);
	}else{
		noteReleased = Message.getNoteNumber();
		isReleased = true;
		Synth.startTimer(0.01);
		Globals.g_string5ActiveRR = "not playing";
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
			id = Synth.playNote(releaseNote, noteVelocity);

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
 