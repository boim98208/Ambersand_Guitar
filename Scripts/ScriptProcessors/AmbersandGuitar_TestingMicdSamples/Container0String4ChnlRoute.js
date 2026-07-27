 function onNoteOn()
{
	if(Message.getChannel() != 4){
		
		Message.ignoreEvent(true);
	}else{
		//is now playing the note and updates	
		Globals.g_string4ActiveRR = Sampler.getActiveRRGroup();
	}
}
 function onNoteOff()
{
	if(Message.getChannel() != 4){
		
	
		Message.ignoreEvent(true);
	}else{
		Console.print("should be releasing");
	
		Globals.g_string4ActiveRR = "not playing";
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
 