const var releaseAddition = [0,0];
const var releaseAdditionWhenHigh = [-3, -4, -5];
const var OPENSTRINGNOTE = 52;
const var NOTEPERSTRING = 22;
const var POINTTOCHANGERELEASE = OPENSTRINGNOTE + (NOTEPERSTRING/2);



//values used in emulated releases
reg releaseNoteNum = 0;
reg isReleased = 0;
reg releaseAdditionIndex = 0;
reg id = -99;
reg noteReleased;
reg noteVelocity = 60;



Synth.stopTimer();

//const var releaseAddition = [-2, -3, -4, -5, -6];

const var startReleaseVolume = 1;
var releaseVolumeOverTime = startReleaseVolume;
//note to self, figure out if you can fade between your pseudo releases
const var releaseTimeSeconds = .01;
function onNoteOn()
{
    if(Message.getChannel() != 12){
        Message.ignoreEvent(true);
    }else{
        Message.makeArtificial(); 
        noteVelocity = Message.getVelocity();
        Synth.stopTimer();        
        isReleased = false;
        releaseAdditionIndex = 0;
        releaseVolumeOverTime = startReleaseVolume;

        if(id != -99){
            Synth.noteOffByEventId(id); 
        }
        id = Message.getEventId(); 
    }
}function onNoteOff()
{
    if(Message.getChannel() != 12){
        Message.ignoreEvent(true);
    }else{
        noteReleased = Message.getNoteNumber();
        releaseVolumeOverTime = startReleaseVolume;
        isReleased = true;
        Synth.startTimer(0.01);
    }
}function onController()
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
 