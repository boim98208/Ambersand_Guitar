 function onNoteOn()
{


	if(Message.getChannel() != 6){
		
		Message.ignoreEvent(true);
	}else{
		//is now playing the note and updates	
		Globals.g_string6ActiveRR = Sampler.getActiveRRGroup();
	}
	
}
 function onNoteOff()
{

	if(Message.getChannel() != 6){
		Message.ignoreEvent(true);
	}else{
		Globals.g_string6ActiveRR = "not playing";
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
 