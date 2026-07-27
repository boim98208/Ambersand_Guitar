Globals.g_forcedHandPositionFret = -1;
Globals.g_forcedString = -1;
Globals.g_handPositionFret = 0;
Globals.g_stringNote1 = -1;
Globals.g_stringNote2 = -1;
Globals.g_stringNote3 = -1;
Globals.g_stringNote4 = -1;
Globals.g_stringNote5 = -1;
Globals.g_stringNote6 = -1; 

Globals.g_frettingEngine = 1;
Globals.g_legatoRange = 2;


const var NOTESPERSTRING = 22;

Globals.g_emulatedReleasesOn = true;



inline function onResetGlobalRRButtonControl(component, value)
{
	if(value){
		Globals.g_stringNote1 = -1;
		Globals.g_stringNote2 = -1;
		Globals.g_stringNote3 = -1;
		Globals.g_stringNote4 = -1;
		Globals.g_stringNote5 = -1;
		Globals.g_stringNote6 = -1; 
	}
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




const var NUMOFSTRINGS = 6;


 Content.makeFrontInterface(1020, 600);
 
//connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.g_NUMOFSTRINGS = 6;
Globals.g_pitchBendOffset = 0;



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



inline function onShowDebugPanelButtonControl(component, value)
{

	if(value)
		DebugPanel.set("visible", true);
	else
		DebugPanel.set("visible", false);
	
	
};

Content.getComponent("ShowDebugPanelButton").setControlCallback(onShowDebugPanelButtonControl);


const var PlayingModeBG = Content.getComponent("PlayingModeBG");





const var ShowPlayingModeButton = Content.getComponent("ShowPlayingModeButton");

ShowPlayingModeButton.setValue(1);

inline function onShowPlayingModeButtonControl(component, value)
{
	
	if(ShowPlayingModeButton.getValue() == 0){
		PlayingModeBG.set("visible", 0);
	}else{
		PlayingModeBG.set("visible", 1);
	}

};

Content.getComponent("ShowPlayingModeButton").setControlCallback(onShowPlayingModeButtonControl);

	

namespace stringType
{

    const var STRING1 = 0;
    const var STRING2 = 1;
    const var STRING3 = 2;
    const var STRING4 = 3;
    const var STRING5 = 4;
    const var STRING6 = 5;

}

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

	if(notePlayed == 51)
	{
	Console.print("keyswitch for fret change is hit");
	newFretPosition = velocity % 18;

		HandPositionFretForceKnob.setValue(newFretPosition);
		Globals.g_forcedHandPositionFret = newFretPosition;
		Globals.g_handPositionFret = newFretPosition;
		
		
	}else if(notePlayed == 50)
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
                               
ForceStringImages.reverse();
                               
for( i in ForceStringImages){
	i.set("visible", false);
}




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
	
	hideAll();

	if(Globals.g_stringNote6 >= 52 && Globals.g_stringNote6 <= 73){
		fretImages[stringType.STRING6][Globals.g_stringNote6 - 52].set("visible", true);
	}
	
	if(Globals.g_stringNote5 >= 57 && Globals.g_stringNote5 <= 78){
		fretImages[stringType.STRING5][Globals.g_stringNote5 - 57].set("visible", true);
	}
	
	if(Globals.g_stringNote4 >= 62 && Globals.g_stringNote4 <= 83){
		fretImages[stringType.STRING4][Globals.g_stringNote4 - 62].set("visible", true);
	}
	
	if(Globals.g_stringNote3 >= 67 && Globals.g_stringNote3 <= 88){
		fretImages[stringType.STRING3][Globals.g_stringNote3 - 67].set("visible", true);
	}
	
	if(Globals.g_stringNote2 >= 71 && Globals.g_stringNote2 <= 92){
		fretImages[stringType.STRING2][Globals.g_stringNote2 - 71].set("visible", true);
	}
	
	if(Globals.g_stringNote1 >= 76 && Globals.g_stringNote1 <= 97){
		fretImages[stringType.STRING1][Globals.g_stringNote1 - 76].set("visible", true);
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
	
	
	
	
	
	
	
	
}
 function onControl(number, value)
{
	
}
 