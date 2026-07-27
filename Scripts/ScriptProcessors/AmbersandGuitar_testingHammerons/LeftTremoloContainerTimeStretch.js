 const var NUMOFSTRINGS = 6;
 const var TremoloSamplers = [];
 TremoloSamplers.reserve(NUMOFSTRINGS);
Synth.deferCallbacks(false);

const var timeStretchCCChannel = 3;
 
 
 for(var i = 0; i < NUMOFSTRINGS; i++){
	 TremoloSamplers.push(Synth.getChildSynth("LeftString" + (i + 1) + "TremoloSampler"));
 }
 
 var stretchRatio;
 
const var stretchSettings = TremoloSamplers[5].asSampler().getTimestretchOptions();
stretchSettings.Mode = "TimeVariant";

for(var i = 0; i < NUMOFSTRINGS; i++){
	TremoloSamplers[i].asSampler().setTimestretchOptions(stretchSettings);
	TremoloSamplers[i].asSampler().setTimestretchRatio(1);
}


inline function changeTimestretchRatio(newTimestretchRatio){


	for(var i = 0; i < NUMOFSTRINGS; i++){
		TremoloSamplers[i].asSampler().setTimestretchRatio(newTimestretchRatio);
	}
}

inline function mapTimeStretchRatio(value){
	local normVal = value/127.0;
	return 0.5 + normVal * 1.5;
	
}

Synth.startTimer(0.01);



function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	local rawVal;

	if(Message.getControllerNumber() == timeStretchCCChannel){
		Globals.timeStretchRatio = mapTimeStretchRatio(Message.getControllerValue());
		changeTimestretchRatio(Globals.timeStretchRatio);
	};
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 