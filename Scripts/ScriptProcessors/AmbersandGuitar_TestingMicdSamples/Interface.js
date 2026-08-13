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



Globals.g_string6ActiveRR = "not playing";
Globals.g_string5ActiveRR = "not playing";
Globals.g_string4ActiveRR = "not playing";
Globals.g_string3ActiveRR = "not playing";
Globals.g_string2ActiveRR = "not playing";
Globals.g_string1ActiveRR = "not playing";




const var NUMOFSTRINGS = 6;


 Content.makeFrontInterface(1200, 600);
 
//connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.g_NUMOFSTRINGS = 6;
Globals.g_pitchBendOffset = 0;



const var handPositionFretLabel = Content.getComponent("handPositionFretLabel");




const var HandPositionFretForceKnob = Content.getComponent("HandPositionFretForceKnob");

inline function onHandPositionFretForceKnobControl(component, value)
{
	if(value == -1)
	{
		HandPositionFretForceKnob.set("text", "Fret: Auto");
	}	else
	{

		HandPositionFretForceKnob.set("text", "Fret: " + value);
	}
};

Content.getComponent("HandPositionFretForceKnob").setControlCallback(onHandPositionFretForceKnobControl);



const var StringForceKnob = Content.getComponent("StringForceKnob");


inline function onStringForceKnobControl(component, value)
{
	local text = "Auto";

	if(value == -1)
	{
		StringForceKnob.set("text", "String: " + text);
	}else
	{
		StringForceKnob.set("text", "string: " + (6 - value));
	}
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










function onNoteOn()
{
	Globals.g_forcedHandPositionFret = HandPositionFretForceKnob.getValue();
	
	Globals.g_forcedString = StringForceKnob.getValue();
	
	
	
	switch (Globals.g_forcedString)
	{
		case -1:
			break;
		default:
			Globals.g_forcedString = NUMOFSTRINGS - Globals.g_forcedString - 1;
	}
	
	
	
	
	Synth.startTimer(0.05);
	
	handPositionFretLabel.set("text", Globals.g_handPositionFret);
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
	
	updateStringRRLabels();
	
	
	
	
	
	
}
 function onControl(number, value)
{
	
}
 