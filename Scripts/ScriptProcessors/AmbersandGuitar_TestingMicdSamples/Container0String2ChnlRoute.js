 function onNoteOn()
{
	if(Message.getChannel() != 2){
		
		Message.ignoreEvent(true);
		Globals.g_string3ActiveRR = "not playing";
	}else{
		//is now playing the note and updates	
	 Globals.g_string2ActiveRR = Sampler.getActiveRRGroup();
	}
}
 function onNoteOff()
{
	if(Message.getChannel() != 2){
		Message.ignoreEvent(true);
	}else{
		Globals.g_string2ActiveRR = "not playing";
	}
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
 