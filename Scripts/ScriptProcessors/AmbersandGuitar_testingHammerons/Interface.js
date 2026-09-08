Globals.g_forcedHandPositionFret = -1;
Globals.g_forcedString = -1;
Globals.g_handPositionFret = 0;

Globals.g_stringNote1 = -1;
Globals.g_stringNote2 = -1;
Globals.g_stringNote3 = -1;
Globals.g_stringNote4 = -1;
Globals.g_stringNote6 = -1;
reg i = 0;


include("KeyswitchConstants.js");

include("NoteRangeAndOpenStringNote.js");


Globals.g_resetNotes = false;

Globals.g_frettingEngine = FrettingEngine.NATURAL;
Globals.g_legatoRange = 2;

Globals.g_releaseVolume = 5;

Globals.g_timeStretchRatio = 1;

Globals.g_strummingModeOn = false;


var timeStretchRatioBeforeDisabling = 1;


const var NONOTE = -1;





namespace KeyboardColors{
	const var KEYSWITCHES = Colours.withAlpha(Colours.red, 0.5);
	const var NOTES = Colours.withAlpha(Colours.cyan, 0.5);
	const var PERCUSSION = Colours.withAlpha(Colours.green, 0.5);
	const var LEGATO = Colours.withAlpha(Colours.cornflowerblue, 0.5);
	const var FORCEFRETHAND = Colours.withAlpha(Colours.deeppink, 0.5);
}



Globals.g_stringPerformance = [];
Globals.g_stringPerformance.reserve(NUMOFSTRINGS);
for(var i = 0; i < NUMOFSTRINGS; i++){
	Globals.g_stringPerformance[i] = PerformanceType.SUSTAIN;
}


//size of this constant array is number of enums in PerformanceType
const var stringPerformanceImgs = [];

stringPerformanceImgs.reserve(PerformanceType.NUMOFPERFORMANCES);

for(i = 0; i < PerformanceType.NUMOFPERFORMANCES; i++){

	// By default, everything will just have the sustain articulation image

	stringPerformanceImgs.push("{PROJECT_FOLDER}PlayingMode_FretIndicator.png");
}

stringPerformanceImgs[PerformanceType.SUSTAIN] = "{PROJECT_FOLDER}PlayingMode_FretIndicator.png";

stringPerformanceImgs[PerformanceType.MUTE] = "{PROJECT_FOLDER}PlayingMode_FretIndicator_Mute.png";

stringPerformanceImgs[PerformanceType.LEGATOUP] = "{PROJECT_FOLDER}PlayingMode_FretIndicator_Legatoup.png";

stringPerformanceImgs[PerformanceType.LEGATODOWN] = "{PROJECT_FOLDER}PlayingMode_FretIndicator_Legatodown.png";

stringPerformanceImgs[PerformanceType.HARMONIC] = 
"{PROJECT_FOLDER}PlayingMode_FretIndicator_Harmonic.png";

stringPerformanceImgs[PerformanceType.TREMOLO] = 
"{PROJECT_FOLDER}PlayingMode_FretIndicator_Tremolo.png";






inline function setImage(imgObject, imgAddress){
	imgObject.set("fileName", imgAddress);
}

inline function displayFret(fretImg, stringNum)
{
	
	// something isn't getting updated or some strings just wont update?


	if(Globals.g_stringPerformance[stringNum] == PerformanceType.SUSTAIN)
	{

		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.SUSTAIN]);
	}
	else if(Globals.g_stringPerformance[stringNum] == PerformanceType.MUTE)
	{

		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.MUTE]);
	}
	else if(Globals.g_stringPerformance[stringNum] == PerformanceType.LEGATOUP)
	{
		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.LEGATOUP]);
	}
	else if(Globals.g_stringPerformance[stringNum] == PerformanceType.LEGATODOWN)
	{

		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.LEGATODOWN]);
		
	}	
	else if(Globals.g_stringPerformance[stringNum] == PerformanceType.HARMONIC)
	{


		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.HARMONIC]);
		
	}else if(Globals.g_stringPerformance[stringNum] == PerformanceType.TREMOLO)
	{


		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.TREMOLO]);
		
	}else{
	
		fretImg.set("fileName", stringPerformanceImgs[PerformanceType.SUSTAIN]);
	}
			
	fretImg.set("visible", true);
}




inline function onResetGlobalRRButtonControl(component, value)
{
	if(value){
		Globals.g_stringNote1 = -1;
		Globals.g_stringNote2 = -1;
		Globals.g_stringNote3 = -1;
		Globals.g_stringNote4 = -1;
		Globals.g_stringNote5 = -1;
		Globals.g_stringNote6 = -1; 
		
		//some notes have a problem of just hanging and not getting off the stringNote array in FrettingEngine
		Globals.g_resetNotes = true;
		//Globals.g_resetNotes is put back to false in FrettingEngine after it recognizes it
	}
	
	Engine.allNotesOff();
	
};

Content.getComponent("ResetGlobalRRButton").setControlCallback(onResetGlobalRRButtonControl);



//making sure an array is completely uniform
inline function isUniform(buffer, bufferSize){
	local checker = buffer[0];


	for(var i = 1; i < bufferSize; i++){
		if(checker != buffer[i])
			return false;
	}

	
	return true;
	
}




//every index is a fret
const var xPosOfFretBorder = [0, 5, 50, 87, 116, 146, //0
							 170, 193, 210, 230, 246, //6
							 264, 279, 295, 312, 330, //10
							 346, 364, 380, 395, 407, 
							 421, 432, 115, 125];



Globals.g_string6ActiveRR = "not playing";
Globals.g_string5ActiveRR = "not playing";
Globals.g_string4ActiveRR = "not playing";
Globals.g_string3ActiveRR = "not playing";
Globals.g_string2ActiveRR = "not playing";
Globals.g_string1ActiveRR = "not playing";


Synth.deferCallbacks(true);
 Content.makeFrontInterface(1020, 600);
 
// connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.g_NUMOFSTRINGS = 6;
Globals.g_pitchBendOffset = 0;



// Setting up Double Tracking

const var LeftGuitarGain = Synth.getEffect("LeftGuitarGain");

const var RightGuitarGain = Synth.getEffect("RightGuitarGain");

const var RightContainerMute = Synth.getMidiProcessor("RightContainerMute");


inline function onDoubleTrackingBtnControl(component, value)
{
	if(value){
		LeftGuitarGain.setAttribute(LeftGuitarGain.Balance, -100.0);
	
		RightContainerMute.setAttribute("Bypass", false);
		RightGuitarGain.setAttribute(RightGuitarGain.Gain, 0.0);
	}else{
		
		LeftGuitarGain.setAttribute(LeftGuitarGain.Balance, 0.0);
	
		RightContainerMute.setAttribute("Bypass", true);
		RightGuitarGain.setAttribute(RightGuitarGain.Gain, -100.0);
	}
};

Content.getComponent("DoubleTrackingBtn").setControlCallback(onDoubleTrackingBtnControl);


inline function onStrummingModeEnableBtnControl(component, value)
{
	if(value){
		Globals.g_strummingModeOn = true;
	}else{
		Globals.g_strummingModeOn = false;
	}
};

Content.getComponent("StrummingModeEnableBtn").setControlCallback(onStrummingModeEnableBtnControl);



// Setting up playing mode GUI



const var handPositionFretLabel = Content.getComponent("handPositionFretLabel");


const var HandPositionFretForceKnob = Content.getComponent("HandPositionFretForceKnob");

inline function handPositionFretForceKnobChange(value){

	Globals.g_forcedHandPositionFret = value - 2;
	
	

}

inline function onHandPositionFretForceKnobControl(component, value)
{
	handPositionFretForceKnobChange(value);
};

Content.getComponent("HandPositionFretForceKnob").setControlCallback(onHandPositionFretForceKnobControl);



const var StringForceKnob = Content.getComponent("StringForceKnob");


inline function onStringForceKnobControl(component, value)
{
	Globals.g_forcedString = value - 2;
	moveForceString(Globals.g_forcedString);
	//Console.print(Globals.g_forcedString);
};

Content.getComponent("StringForceKnob").setControlCallback(onStringForceKnobControl);




const var FrettingEngineComboBox = Content.getComponent("FrettingEngineComboBox");


inline function onFrettingEngineComboBoxControl(component, value)
{
	Globals.g_frettingEngine = value;
};

Content.getComponent("FrettingEngineComboBox").setControlCallback(onFrettingEngineComboBoxControl);


const var StringRRLabel = [Content.getComponent("String1RRLabel"),
                           Content.getComponent("String2RRLabel"),
                           Content.getComponent("String3RRLabel"),
                           Content.getComponent("String4RRLabel"),
                           Content.getComponent("String5RRLabel"),
                           Content.getComponent("String6RRLabel")];


const var DebugPanel = Content.getComponent("DebugPanel");

const var PlayingModeBG = Content.getComponent("PlayingModeBG");

const var ShowArticulationsButton = Content.getComponent("ShowArticulationsButton");


const var CurrArticulationPlayingLabel = Content.getComponent("CurrArticulationPlayingLabel");

inline function updateCurrArticPlayingLabel(){
	

	if(Globals.g_currArticulationPlaying == PerformanceType.SUSTAIN)
		CurrArticulationPlayingLabel.set("text", "Sustain");
	else if(Globals.g_currArticulationPlaying == PerformanceType.MUTE)
		CurrArticulationPlayingLabel.set("text", "Mute");
	else if(Globals.g_currArticulationPlaying == PerformanceType.HARMONIC)
		CurrArticulationPlayingLabel.set("text", "Harmonic");
	else if(Globals.g_currArticulationPlaying == PerformanceType.TREMOLO)
		CurrArticulationPlayingLabel.set("text", "Tremolo");
	else if(Globals.g_currArticulationPlaying == PerformanceType.SFX)
			CurrArticulationPlayingLabel.set("text", "SFX");
	
}





// setting up the buttons that show the GUI

inline function onShowDebugPanelButtonControl(component, value)
{

	if(value){
		DebugPanel.set("visible", true);
		ShowPlayingModeButton.setValue(1);
		ShowArticulationsButton.setValue(0);
		PlayingModeBG.set("visible", 1);
		ArticulationBG.set("visible", false);
		}
	else
		DebugPanel.set("visible", false);
	
	
};

Content.getComponent("ShowDebugPanelButton").setControlCallback(onShowDebugPanelButtonControl);



const var ShowPlayingModeButton = Content.getComponent("ShowPlayingModeButton");

ShowPlayingModeButton.setValue(0);
PlayingModeBG.set("visible", true);

inline function onShowPlayingModeButtonControl(component, value)
{
	
	if(ShowPlayingModeButton.getValue() == 0){
		PlayingModeBG.set("visible", false);
		DebugPanel.set("visible", false);
	}else{
		PlayingModeBG.set("visible", true);
		ArticulationBG.set("visible", false);
		ShowArticulationsButton.setValue(0);
	}

};

Content.getComponent("ShowPlayingModeButton").setControlCallback(onShowPlayingModeButtonControl);

const var ArticulationBG = Content.getComponent("ArticulationBG");

ArticulationBG.set("visible", false);

inline function onShowArticulationsButtonControl(component, value)
{
	if(value == 0){
		ArticulationBG.set("visible", false);
		ShowPlayingModeButton.setValue(1);
		DebugPanel.set("visible", false);
		PlayingModeBG.set("visible", false);
	}else{
		ShowPlayingModeButton.setValue(0);
		PlayingModeBG.set("visible", false);
		ArticulationBG.set("visible", true);
	}
};

Content.getComponent("ShowArticulationsButton").setControlCallback(onShowArticulationsButtonControl);

//setting up fretMarkers

var fretImages = [];
for (var str = 0; str < Globals.g_NUMOFSTRINGS; str++){
	
	var row = [];
	
	for (var j = 0; j < NOTESPERSTRING; j++){
		row.push(Content.getComponent("String" + (str + 1) + "Fret" + j + "Marker"));
	}
	fretImages.push(row);
}


for (var i = 0; i < Globals.g_NUMOFSTRINGS; i++){
	for (var j = 0; j < NOTESPERSTRING; j++){
		fretImages[i][j].set("fileName", "{PROJECT_FOLDER}PlayingMode_FretIndicator.png");
		fretImages[i][j].set("visible", false);
	}
}


inline function updateStringRRLabels()
{
	//looks like there's a way do global arrays. Look into later

	StringRRLabel[0].set("text", Globals.g_string1ActiveRR);
	StringRRLabel[1].set("text", Globals.g_string2ActiveRR);
	StringRRLabel[2].set("text", Globals.g_string3ActiveRR);
	StringRRLabel[3].set("text", Globals.g_string4ActiveRR);
	StringRRLabel[4].set("text", Globals.g_string5ActiveRR);
	StringRRLabel[5].set("text", Globals.g_string6ActiveRR);
	

}




inline function hideAll()
{
    for (var i = 0; i < Globals.g_NUMOFSTRINGS; i++)
        for (var j = 0; j < NOTESPERSTRING; j++)
            fretImages[i][j].set("visible", false);
}

inline function hideString(stringNum){
	for(var j = 0; j < NOTESPERSTRING; j++){
		fretImages[stringNum][j].set("visible", false);
	}
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

inline function keyswitchForceFret(notePlayed, velocity)
{
	local newFretPosition;

	
	//note to self: figure out how to get knobs to change text when given a keyswitch

	if(notePlayed == FORCEFRETMODEKEYSWITCH)
	{
	Console.print("keyswitch for fret change is hit");
	newFretPosition = velocity % 18;

		HandPositionFretForceKnob.setValue(newFretPosition);
		Globals.g_forcedHandPositionFret = newFretPosition;
		Globals.g_handPositionFret = newFretPosition;
		
		
	}else if(notePlayed == AUTOFRETMODEKEYSWITCH)
	{
	 Console.print("keyswitch for auto fret change is hit");

		HandPositionFretForceKnob.setValue(-1);
		Globals.g_forcedHandPositionFret = -1;
		
	}
}

const var FretBorderLow = Content.getComponent("FretBorderLow");

const var FretBorderLowForced = Content.getComponent("FretBorderLowForced");

FretBorderLowForced.set("visible", false);

const var FretBorderHigh = Content.getComponent("FretBorderHigh");

const var FretBorderHighForced = Content.getComponent("FretBorderHighForced");


const var fretBorderCenterHW = 15;
const var fretBorderCenterY = 23;

const var FretBorderCenter = Content.getComponent("FretBorderCenter");

const var FretBorderCenterForced = Content.getComponent("FretBorderCenterForced");

FretBorderCenterForced.set("visible", false);

FretBorderCenter.set("width", fretBorderCenterHW);
FretBorderCenter.set("height", fretBorderCenterHW);
FretBorderCenter.set("y", fretBorderCenterY);

FretBorderCenterForced.set("width", fretBorderCenterHW);
FretBorderCenterForced.set("height", fretBorderCenterHW);
FretBorderCenterForced.set("y", fretBorderCenterY);




const var StringForcePanel = Content.getComponent("StringForcePanel");

const var ForceStringImages = [Content.getComponent("StringForceString6"),
                               Content.getComponent("StringForceString5"),
                               Content.getComponent("StringForceString4"),
                               Content.getComponent("StringForceString3"),
                               Content.getComponent("StringForceString2"),
                               Content.getComponent("StringForceString1")];
// doing this so that string1 starts on index 0 and I'm too lazy to change the declaration statement
ForceStringImages.reverse();
                               
for( i in ForceStringImages){
	i.set("visible", false);
}


const var ArticulationPlayingLabel = Content.getComponent("ArticulationPlayingLabel");




inline function capLow(lowLim, num){
	if(num < lowLim){
		return lowLim;
		}
	else{
		return num;
		}
}



inline function moveFretBorder(fretPos){
	//implement the different positions for when you go to melody fretting mode so like for melody mode make sure you the span of the lowBorder and the highBorder is greater to a higher fret
	local lowFret;
	local highFret;
	local distBetweenFrets;
	local posOfCenter;
	
	if(fretPos == 1)
	{
		lowFret = cap(0, 2);
	}
	else
	{
		lowFret = capLow(0, fretPos);
	}
		
	highFret = lowFret + 5;
	
	distBetweenFrets = xPosOfFretBorder[highFret] - xPosOfFretBorder[lowFret];
	
	posOfCenter = xPosOfFretBorder[lowFret] + (distBetweenFrets/2);

	if(Globals.g_forcedHandPositionFret != -1)
	{
		FretBorderLowForced.set("visible", true);
		FretBorderHighForced.set("visible", true);
		FretBorderCenterForced.set("visible", true);
	}
	else
	{
		FretBorderLowForced.set("visible", false);
		FretBorderHighForced.set("visible", false);
		FretBorderCenterForced.set("visible", false);
	}


	FretBorderLow.set("x", xPosOfFretBorder[lowFret]);
	FretBorderLowForced.set("x", xPosOfFretBorder[lowFret]);
	FretBorderHigh.set("x", xPosOfFretBorder[highFret]);
	FretBorderHighForced.set("x", xPosOfFretBorder[highFret]);
	FretBorderCenter.set("x", posOfCenter);
	FretBorderCenterForced.set("x", posOfCenter);
	
	
	
	
		
}


inline function moveForceString(stringToForce){
	local whatToForce;

	for(image in ForceStringImages){
		image.set("visible", false);
	}

	if(stringToForce != -1){
		whatToForce = ForceStringImages[stringToForce];
	
		whatToForce.set("visible", true);
	}
}



// initializing DSP FX GUI

const var ConvolutionReverb1 = Synth.getEffect("ConvolutionReverb1");
const var ConvolutionReverb1Sample = Synth.getAudioSampleProcessor("ConvolutionReverb1");

const var cmbIr = Content.getComponent("cmbIr");
const irs = Engine.loadAudioFilesIntoPool();
cmbIr.set("items", "");


inline function oncmbIrControl(component, value)
{
	if(value > 0)
		ConvolutionReverb1Sample.setFile(irs[value - 1]);
};

Content.getComponent("cmbIr").setControlCallback(oncmbIrControl);


for (var i = 0; i < irs.length; i++){
	if(!irs[i].contains("xfade")){
		cmbIr.addItem(irs[i].replace("{PROJECT_FOLDER}").replace(".wav"));
	}


}




const var IRMixKnob = Content.getComponent("IRMixKnob");

inline function onIRMixKnobControl(component, value)
{
	local dryLinear = Math.cos(Math.PI * value / 2);
	local wetLinear = Math.sin(Math.PI * value / 2);
	
		// noticing a boost in the middle position. This'll hopefully reduce that
		local centerComp = 1.0 - 0.2 * Math.sin(Math.PI * value);
		dryLinear *= centerComp;
		wetLinear *= centerComp;
		
		 
	
	local dryGain = 20 * Math.log10(dryLinear);
	local wetGain = 20 * Math.log10(wetLinear);
	
	  
	
		dryGain = dryGain - 6;
	ConvolutionReverb1.setAttribute(ConvolutionReverb1.DryGain, dryGain);
	ConvolutionReverb1.setAttribute(ConvolutionReverb1.WetGain, wetGain);
};

Content.getComponent("IRMixKnob").setControlCallback(onIRMixKnobControl);



// setting up PB and Vibrato knobs


// Probably only using this function to set smoothing times between stuff

inline function copyModulatorParams(source, target)
{
	for(var j = 0; j < target.length; j++){

    for (i = 0; i < source.getNumAttributes(); i++)
    {
        target[j].setAttribute(i, source.getAttribute(i));
    }
    
    }
};

const var SourcePitchBendModulator = Synth.getModulator("SourcePitchBendModulator");

const var PitchBendModulators = Synth.getAllModulators("PitchBendModulator");

const var SourceVibratoLFOIntensityMod = Synth.getModulator("SourceVibratoLFOIntensityMod");

const var VibratoLFOIntensityMods = Synth.getAllModulators("VibratoLFOIntensityMod");

const var SourceVibratoLFOFreqMod = Synth.getModulator("SourceVibratoLFOFreqMod");

const var VibratoLFOFreqMods = Synth.getAllModulators("VibratoLFOFreqMod")


copyModulatorParams(SourcePitchBendModulator, PitchBendModulators);

copyModulatorParams(SourceVibratoLFOIntensityMod, VibratoLFOIntensityMods);

copyModulatorParams(SourceVibratoLFOFreqMod, VibratoLFOFreqMods);

const var SourceVibratoLFO = Synth.getModulator("SourceVibratoLFO");

const var VibratoLFOs = Synth.getAllModulators("VibratoLFO");

inline function changePitchBendRange(range, PBModulators){
	local PBModulator = PBModulators[0];

	for(var i = 0; i < PBModulators.length; i++){
		PBModulator = PBModulators[i];
		PBModulator.setIntensity(range);
	}
}

// This doesn't work for some reason. Please fix it

inline function changeVibratoDepth(depth, VibratoLFOMods){
	local VibratoLFOMod = VibratoLFOMods[0];

	for(i = 0; i < VibratoLFOMods.length; i++){
		VibratoLFOMod = VibratoLFOMods[i];
		VibratoLFOMod.setIntensity(depth);
	}
}



inline function onPitchBendRangeKnobControl(component, value)
{
	SourcePitchBendModulator.setIntensity(value);
	changePitchBendRange(value, PitchBendModulators);
};

Content.getComponent("PitchBendRangeKnob").setControlCallback(onPitchBendRangeKnobControl);


copyModulatorParams(VibratoLFOs, SourceVibratoLFO);

inline function onVibratoDepthKnobControl(component, value)
{
	//SourceVibratoLFO.setIntensity(value);
	SourceVibratoLFO.setIntensity(value);
	changeVibratoDepth(value, VibratoLFOs);
};

Content.getComponent("VibratoDepthKnob").setControlCallback(onVibratoDepthKnobControl);


// setting up articulations page

const var SampleAHDSR = Synth.getModulator("SusAHDSR");

namespace AHDSRIndices
{
	const var attack = 0;
	const var decay = 1;
	const var sustain = 2;
	const var release = 3;
}

const var AHDSRAttributes = [0, 0, 0, 0];

AHDSRAttributes[AHDSRIndices.attack] = SampleAHDSR.Attack;
AHDSRAttributes[AHDSRIndices.decay] = SampleAHDSR.Decay;
AHDSRAttributes[AHDSRIndices.sustain] = SampleAHDSR.Sustain;
AHDSRAttributes[AHDSRIndices.release] = SampleAHDSR.Release;



const var SustainAHDSRKnobs = [Content.getComponent("SustainModulatorsAttack"),
                               Content.getComponent("SustainModulatorsDecay"),
                               Content.getComponent("SustainModulatorsSustain"),
                               Content.getComponent("SustainModulatorsRelease")];

const var SusAHDSRModulators = Synth.getAllModulators("SusAHDSR");




inline function onSustainAHDSRControl(component, value)
{
    for (var k = 0; k < SustainAHDSRKnobs.length; k++)
    {
        if (SustainAHDSRKnobs[k] == component)
        {
            for (var j = 0; j < SusAHDSRModulators.length; j++)
                SusAHDSRModulators[j].setAttribute(AHDSRAttributes[k], value);
            return;
        }
    }
}

for (i = 0; i < SustainAHDSRKnobs.length; i++)
    SustainAHDSRKnobs[i].setControlCallback(onSustainAHDSRControl);
    
for(i = 0; i < SustainAHDSRModulators.length; i++){
	SustainAHDSRModulators[i].setAttribute(SampleAHDSR.AttackCurve, 0.5);
	SustainAHDSRModulators[i].setAttribute(SampleAHDSR.DecayCurve, 0.5);
}


const var MuteAHDSRKnobs = [Content.getComponent("MuteModulatorsAttack"),
                            Content.getComponent("MuteModulatorsDecay"),
                            Content.getComponent("MuteModulatorsMute"),
                            Content.getComponent("MuteModulatorsRelease")];


const var MuteAHDSRModulators = Synth.getAllModulators("MuteAHDSR");


inline function onMuteAHDSRControl(component, value)
{
    for (var k = 0; k < MuteAHDSRKnobs.length; k++)
    {
        if (MuteAHDSRKnobs[k] == component)
        {
            for (var j = 0; j < MuteAHDSRModulators.length; j++)
                MuteAHDSRModulators[j].setAttribute(AHDSRAttributes[k], value);
            return;
        }
    }
}

for (i = 0; i < MuteAHDSRKnobs.length; i++)
    MuteAHDSRKnobs[i].setControlCallback(onMuteAHDSRControl);



const var HarmonicAHDSRKnobs = [Content.getComponent("HarmonicModulatorsAttack"),
                            Content.getComponent("HarmonicModulatorsDecay"),
                            Content.getComponent("HarmonicModulatorsHarmonic"),
                            Content.getComponent("HarmonicModulatorsRelease")];


const var HarmonicAHDSRModulators = Synth.getAllModulators("HarmonicAHDSR");


inline function onHarmonicAHDSRControl(component, value)
{
    for (var k = 0; k < HarmonicAHDSRKnobs.length; k++)
    {
        if (HarmonicAHDSRKnobs[k] == component)
        {
            for (var j = 0; j < HarmonicAHDSRModulators.length; j++)
                HarmonicAHDSRModulators[j].setAttribute(AHDSRAttributes[k], value);
            return;
        }
    }
}

for (i = 0; i < HarmonicAHDSRKnobs.length; i++)
    HarmonicAHDSRKnobs[i].setControlCallback(onHarmonicAHDSRControl);
    

for(i = 0; i < HarmonicAHDSRModulators.length; i++){
	HarmonicAHDSRModulators[i].setAttribute(SampleAHDSR.AttackCurve, 0.5);
	HarmonicAHDSRModulators[i].setAttribute(SampleAHDSR.DecayCurve, 0.5);
}



    
 const var TremoloAHDSRKnobs = [Content.getComponent("TremoloModulatorsAttack"),
                             Content.getComponent("TremoloModulatorsDecay"),
                             Content.getComponent("TremoloModulatorsTremolo"),
                             Content.getComponent("TremoloModulatorsRelease")];
 
 
 const var TremoloAHDSRModulators = Synth.getAllModulators("TremoloAHDSR");
 
 
 inline function onTremoloAHDSRControl(component, value)
 {
     for (var k = 0; k < TremoloAHDSRKnobs.length; k++)
     {
         if (TremoloAHDSRKnobs[k] == component)
         {
             for (var j = 0; j < TremoloAHDSRModulators.length; j++)
                 TremoloAHDSRModulators[j].setAttribute(AHDSRAttributes[k], value);
             return;
         }
     }
 }
 
 for (i = 0; i < TremoloAHDSRKnobs.length; i++)
     TremoloAHDSRKnobs[i].setControlCallback(onTremoloAHDSRControl);
 
for(i = 0; i < TremoloAHDSRModulators.length; i++){
	TremoloAHDSRModulators[i].setAttribute(SampleAHDSR.AttackCurve, 0.5);
	TremoloAHDSRModulators[i].setAttribute(SampleAHDSR.DecayCurve, 0.5);
}



inline function onTremoloTimestretchKnobControl(component, value)
{
	Globals.g_timeStretchRatio = value;
};


Content.getComponent("TremoloTimestretchKnob").setControlCallback(onTremoloTimestretchKnobControl);

const var TremoloTimestretchKnob = Content.getComponent("TremoloTimestretchKnob");


const var EnableTremStretchButton = Content.getComponent("EnableTremStretchButton");








/*

I keep crashing with this. Figure out if you want implementations of this another time

inline function onEnableTremStretchButtonControl(component, value)
{
	if(value){
		Globals.g_timeStretchRatio = timeStretchRatioBeforeDisabling;
	}else{
		
		timeStretchRatioBeforeDisabling = Globals.g_timeStretchRatio;
		Globals.g_timeStretchRatio = -1;
	}
};

Content.getComponent("EnableTremStretchButton").setControlCallback(onEnableTremStretchButtonControl);


*/


const var SFXAHDSRKnobs = [Content.getComponent("SFXModulatorsAttack"),
                            Content.getComponent("SFXModulatorsDecay"),
                            Content.getComponent("SFXModulatorsSFX"),
                            Content.getComponent("SFXModulatorsRelease")];


const var SFXAHDSRModulators = Synth.getAllModulators("SFXAHDSR");


inline function onSFXAHDSRControl(component, value)
{
    for (var k = 0; k < SFXAHDSRKnobs.length; k++)
    {
        if (SFXAHDSRKnobs[k] == component)
        {
            for (var j = 0; j < SFXAHDSRModulators.length; j++)
                SFXAHDSRModulators[j].setAttribute(AHDSRAttributes[k], value);
            return;
        }
    }
}

for (i = 0; i < SFXAHDSRKnobs.length; i++){
    SFXAHDSRKnobs[i].setControlCallback(onSFXAHDSRControl);
}

for(i = 0; i < SFXAHDSRModulators.length; i++){
	SFXAHDSRModulators[i].setAttribute(SampleAHDSR.AttackCurve, 0.5);
	SFXAHDSRModulators[i].setAttribute(SampleAHDSR.DecayCurve, 0.5);
}


// setting up purging
// wont seem to work no matter what I do so I won't use it yet
// I can purge articulations from memory but I can't seem to get articulations back into playing

/*

const var purgeAttributeIndex = 12;



// purges all the samples from samplers from RAM
inline function purgeAllSamplersInArray(samplerArray){
	local samplerToPurge;

	for(i = 0; i < samplerArray.length; i++){
		samplerToPurge = samplerArray[i];
		samplerToPurge.setAttribute(purgeAttributeIndex, true);
	}
}

// gets all the samples from samplers into RAM
inline function loadAllSamplersInArray(samplerArray)
{
    for (i = 0; i < samplerArray.length; i++)
    {
        samplerArray[i].setAttribute(12, 0);
        // Force samplemap reload after unpurge
        samplerArray[i].asSampler().loadSampleMap(samplerArray[i].asSampler().getCurrentSampleMapId());
    }
}

// Lazy load works like kontakt purge where everything is purged until it's played
// not implemented yet
inline function lazyLoadAllSamplersInArray(samplerArray){
	local samplerToLoad;
	
	for(i = 0; i < samplerArray.length; i++){
		samplerToLoad = samplerArray[i];
		samplerToLoad.setAttribute(purgeAttributeIndex, false);
	}

}


inline function purgeArticButtonFunction(value, articSamplerArray){

	if(value == 1){
		loadAllSamplersInArray(articSamplerArray);
	}else if (value == 0){
		purgeAllSamplersInArray(articSamplerArray);
	}
}

// this helper function follows the assumption of samplers following the strings
// and that the samplers follow convention of Left/RightString[Num][Artic]Sampler or String[Num][Artic]Sampler

inline function createAllArticSamplerArray(articName, lowBound, highBound, hasDoubleTrack){
	

	local samplerArrayToReturn = [];
	local samplerToPush;
	local numOfSamplers = highBound - lowBound + 1;

	if(hasDoubleTrack){
		samplerArrayToReturn.reserve(numOfSamplers * 2);
	}else{
		samplerArrayToReturn.reserve(numOfSamplers);
	}
	
	if(hasDoubleTrack){
		for(i = lowBound; i <= highBound; i++){
			samplerToPush = Synth.getSampler("LeftString" + i + articName + "Sampler");
			samplerArrayToReturn.push(samplerToPush);
			
			samplerToPush = Synth.getSampler("RightString" + i + articName + "Sampler");
			samplerArrayToReturn.push(samplerToPush);
		}
	}else{
		for(i = lowBound; i <= highBound; i++){
			samplerToPush = Synth.getSampler("String" + i + articName + "Sampler");
		}
	}
	
	return samplerArrayToReturn;
	
}



inline function createAllArticSamplerArrayAsChildSynth(articName, lowBound, highBound, hasDoubleTrack)
{
    local samplerArrayToReturn = [];
    local numOfSamplers = highBound - lowBound + 1;
    
    if (hasDoubleTrack)
        samplerArrayToReturn.reserve(numOfSamplers * 2);
    else
        samplerArrayToReturn.reserve(numOfSamplers);
    
    if (hasDoubleTrack)
    {
        for (i = lowBound; i <= highBound; i++)
        {
            samplerArrayToReturn.push(Synth.getChildSynth("LeftString" + i + articName + "Sampler"));
            samplerArrayToReturn.push(Synth.getChildSynth("RightString" + i + articName + "Sampler"));
        }
    }
    else
    {
        for (i = lowBound; i <= highBound; i++)
        {
            samplerArrayToReturn.push(Synth.getChildSynth("String" + i + articName + "Sampler"));
        }
    }
    
    return samplerArrayToReturn;
}

const var susSamplerName = "Sus";
const var susSamplerLowestStringNum = 1;
const var susSamplerHighestStringNum = NUMOFSTRINGS;
const var susHasDoubleTrack = true;

const var AllSusSamplers = createAllArticSamplerArrayAsChildSynth(susSamplerName, susSamplerLowestStringNum, susSamplerHighestStringNum, susHasDoubleTrack);


inline function onPurgeSustainBtnControl(component, value)
{
	purgeArticButtonFunction(value, AllSusSamplers);
};

Content.getComponent("PurgeSustainBtn").setControlCallback(onPurgeSustainBtnControl);



const var muteSamplerName = "Mute";
const var muteSamplerLowestStringNum = 1;
const var muteSamplerHighestStringNum = NUMOFSTRINGS;
const var muteHasDoubleTrack = true;

const var AllMuteSamplers = createAllArticSamplerArrayAsChildSynth(muteSamplerName, muteSamplerLowestStringNum, muteSamplerHighestStringNum, muteHasDoubleTrack);


inline function onPurgeMuteBtnControl(component, value)
{
	purgeArticButtonFunction(value, AllMuteSamplers);
};

Content.getComponent("PurgeMuteBtn").setControlCallback(onPurgeMuteBtnControl);



const var harmonicSamplerName = "Harmonic";
const var harmonicSamplerLowestStringNum = 1;
const var harmonicSamplerHighestStringNum = NUMOFSTRINGS;
const var harmonicHasDoubleTrack = true;

const var AllHarmonicSamplers = createAllArticSamplerArrayAsChildSynth(harmonicSamplerName, harmonicSamplerLowestStringNum, harmonicSamplerHighestStringNum, harmonicHasDoubleTrack);


inline function onPurgeHarmonicBtnControl(component, value)
{
	purgeArticButtonFunction(value, AllHarmonicSamplers);
};

Content.getComponent("PurgeHarmonicBtn").setControlCallback(onPurgeHarmonicBtnControl);


 
const var tremoloSamplerName = "Tremolo";
const var tremoloSamplerLowestStringNum = 1;
const var tremoloSamplerHighestStringNum = NUMOFSTRINGS;
const var tremoloHasDoubleTrack = true;

const var AllTremoloSamplers = createAllArticSamplerArrayAsChildSynth(tremoloSamplerName, tremoloSamplerLowestStringNum, tremoloSamplerHighestStringNum, tremoloHasDoubleTrack);


inline function onPurgeTremoloBtnControl(component, value)
{
	purgeArticButtonFunction(value, AllTremoloSamplers);
};

Content.getComponent("PurgeTremoloBtn").setControlCallback(onPurgeTremoloBtnControl);

*/

/*
const var allSFXSamplerNames = ["BackBodyHit"]
AllSFXSamplers.reserve(AllLeftSFXSamplers.length + AllRightSFXSamplers);


inline function onPurgeSFXBtnControl(component, value)
{
	purgeArticButtonFunction(value, AllSFXSamplers);
};

Content.getComponent("PurgeSFXBtn").setControlCallback(onPurgeSFXBtnControl);
 
 */
 
 
// setting up the keyboard

// reset the keyboard
for(i = 0; i < 127; i++){
	Engine.setKeyColour(i, Colours.withAlpha(Colours.red, 0.0));
}


for(var i = LOWESTNOTE; i < HIGHESTNOTE + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.NOTES);
}

for(var i = FIRSTKEYSWITCH; i < LASTKEYSWITCH + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.KEYSWITCHES);
}

for(var i = FIRSTPERCUSSION; i < LASTPERCUSSION + 1; i++){
	Engine.setKeyColour(i, KeyboardColors.PERCUSSION);
}


Engine.setKeyColour(legatoKeySwitchNote, KeyboardColors.LEGATO);
Engine.setKeyColour(FORCEFRETMODEKEYSWITCH, KeyboardColors.FORCEFRETHAND);
Engine.setKeyColour(AUTOFRETMODEKEYSWITCH, KeyboardColors.FORCEFRETHAND);








function onNoteOn()
{
	

	local notePlayed = Message.getNoteNumber();
	local velocityPlayed = Message.getVelocity();
	
	
	keyswitchForceFret(notePlayed, velocityPlayed);
	
	moveForceString(Globals.g_forcedString);
	
	Synth.startTimer(0.05);
	

}
      function onNoteOff()
{
	Synth.startTimer(0.05);
}
 //const var MAX_BEND_PIXELS = 15;

function onController()
{
	
	//script to move fret markers. Implement later if needed

	/*

	var normalized = 0;
	var raw = 0;
	
	if (Message.getControllerNumber() == 128)
	    {
	        raw = Message.getControllerValue();  // 0 to 16383, center = 8192
	
	        // Normalize to -1.0 to +1.0
	        normalized = (raw - 8192) / 8192.0;
	
	        // Convert to pixel offset
	        Globals.g_pitchBendOffset = normalized * MAX_BEND_PIXELS;
			Console.print(Globals.g_pitchBendOffset);

	    }
	    
	    */
	    

	    
	
}
 function onTimer()
{
	local fretImgToControl = fretImages[StringType.STRING6][0];

	
	hideAll();

	if(Globals.g_stringNotes[StringType.STRING6] != NONOTE){
		fretImgToControl = fretImages[StringType.STRING6][ Globals.g_stringNotes[StringType.STRING6] - OPENSTRING6NOTE];
		displayFret(fretImgToControl, StringType.STRING6);
	}
	
	if(Globals.g_stringNotes[StringType.STRING5] != NONOTE){
		fretImgToControl = fretImages[StringType.STRING5][ Globals.g_stringNotes[StringType.STRING5] - OPENSTRING5NOTE];
		displayFret(fretImgToControl, StringType.STRING5);
	}
	
	if(Globals.g_stringNotes[StringType.STRING4] != NONOTE){
		fretImgToControl = fretImages[StringType.STRING4][ Globals.g_stringNotes[StringType.STRING4] - OPENSTRING4NOTE];
		displayFret(fretImgToControl, StringType.STRING4);
	}
	
	if(Globals.g_stringNotes[StringType.STRING3] != NONOTE){
		fretImgToControl = fretImages[StringType.STRING3][ Globals.g_stringNotes[StringType.STRING3] - OPENSTRING3NOTE];
		displayFret(fretImgToControl, StringType.STRING3);
	}
	
	if(Globals.g_stringNotes[StringType.STRING2] != NONOTE){
		fretImgToControl = fretImages[StringType.STRING2][ Globals.g_stringNotes[StringType.STRING2] - OPENSTRING2NOTE];
		displayFret(fretImgToControl, StringType.STRING2);
	}
	
	if(Globals.g_stringNotes[StringType.STRING1] != NONOTE){
		
	
		fretImgToControl = fretImages[StringType.STRING1][ Globals.g_stringNotes[StringType.STRING1] - OPENSTRING1NOTE];
		displayFret(fretImgToControl, StringType.STRING1);
	}
	
	
	
	handPositionFretLabel.set("text", Globals.g_handPositionFret != -1 ? Globals.g_handPositionFret : "");
	
	
	if(Globals.g_forcedHandPositionFret != -1)
	{
		moveFretBorder(Globals.g_forcedHandPositionFret);
	
	}else
	{
		moveFretBorder(Globals.g_handPositionFret);
	}
	
	updateStringRRLabels();
	updateCurrArticPlayingLabel();
	
	TremoloTimestretchKnob.setValue(Globals.g_timeStretchRatio);
	
	
	
	
	
	
}
 function onControl(number, value)
{
	
}
 