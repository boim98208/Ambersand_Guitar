 Content.makeFrontInterface(1200, 600);
 
//connecting with fret markers on the UI

const var NOTESPERSTRING = 22;
Globals.NUMOFSTRINGS = 6;
Globals.pitchBendOffset = 0;


namespace stringType
{

    const var STRING1 = 0;
    const var STRING2 = 1;
    const var STRING3 = 2;
    const var STRING4 = 3;
    const var STRING5 = 4;
    const var STRING6 = 5;

}

var fretImages = [];
for (var str = 0; str < Globals.NUMOFSTRINGS; str++){
	
	var row = [];
	
	for (var j = 0; j < NOTESPERSTRING; j++){
		row.push(Content.getComponent("String" + (str + 1) + "Fret" + j + "Marker"));
	}
	fretImages.push(row);
}


for (var i = 0; i < Globals.NUMOFSTRINGS; i++){
	for (var j = 0; j <NOTESPERSTRING; j++){
		fretImages[i][j].set("visible", false);
	}
}

inline function hideAll()
{
    for (var i = 0; i < Globals.NUMOFSTRINGS; i++)
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
	        Globals.pitchBendOffset = normalized * MAX_BEND_PIXELS;
			Console.print(Globals.pitchBendOffset);

	    }
	    
	    */
	    
	
}
 function onTimer()
{
	

	
	hideAll();
	
	if(Globals.stringNote6 >= 52 && Globals.stringNote6 <= 73){
		fretImages[stringType.STRING6][Globals.stringNote6 - 52].set("visible", true);
	}
	
	if(Globals.stringNote5 >= 57 && Globals.stringNote5 <= 78){
		fretImages[stringType.STRING5][Globals.stringNote5 - 57].set("visible", true);
	}
	
	if(Globals.stringNote4 >= 62 && Globals.stringNote4 <= 83){
		fretImages[stringType.STRING4][Globals.stringNote4 - 62].set("visible", true);
	}
	
	if(Globals.stringNote3 >= 67 && Globals.stringNote3 <= 88){
		fretImages[stringType.STRING3][Globals.stringNote3 - 67].set("visible", true);
	}
	
	if(Globals.stringNote2 >= 71 && Globals.stringNote2 <= 92){
		fretImages[stringType.STRING2][Globals.stringNote2 - 71].set("visible", true);
	}
	
	if(Globals.stringNote1 >= 76 && Globals.stringNote1 <= 97){
		fretImages[stringType.STRING1][Globals.stringNote1 - 76].set("visible", true);
	}
	
	
	
}
 function onControl(number, value)
{
	
}
 