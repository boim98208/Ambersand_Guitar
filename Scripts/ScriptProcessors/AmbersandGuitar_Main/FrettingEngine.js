 const var string6Mute = Synth.getMidiProcessor("Container0String6Mute");
 const var string5Mute = Synth.getMidiProcessor("Container0String5Mute");
 const var string4Mute = Synth.getMidiProcessor("Container0String4Mute");
 const var string3Mute = Synth.getMidiProcessor("Container0String3Mute");
 
 reg isFirstNote = true;
 
 namespace StringType
 {
	 const var STRING1 = 0;
	 const var STRING2 = 1;
	 const var STRING3 = 2;
	 const var STRING4 = 3;
	 const var STRING5 = 4;
	 const var STRING6 = 5;
 }
 
 
 inline function playString6(){
	string6Mute.setAttribute("Bypass", false);
	string5Mute.setAttribute("Bypass", true);
	string4Mute.setAttribute("Bypass", true);
	string3Mute.setAttribute("Bypass", true);
 }
 
 inline function playString5(){
 	string6Mute.setAttribute("Bypass", true);
 	string5Mute.setAttribute("Bypass", false);
 	string4Mute.setAttribute("Bypass", true);
 	string3Mute.setAttribute("Bypass", true);
 }
 
 inline function playString4(){
 	string6Mute.setAttribute("Bypass", true);
 	string5Mute.setAttribute("Bypass", true);
 	string4Mute.setAttribute("Bypass", false);
 	string3Mute.setAttribute("Bypass", true);
 }
 
 inline function playString3(){
 	string6Mute.setAttribute("Bypass", true);
 	string5Mute.setAttribute("Bypass", true);
 	string4Mute.setAttribute("Bypass", false);
 	string3Mute.setAttribute("Bypass", true);
 }
 
 function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 