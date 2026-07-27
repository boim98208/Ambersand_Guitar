 //keyswitches
 const var SUSTAINKEYSWITCHNOTE = 36; //C3 in cakewalk
 const var MUTEKEYSWITCHNOTE = 37;
 const var HARMONICKEYSWITCHNOTE = 38;
 const var TREMOLOKEYSWITCHNOTE = 39;
 const var SFXKEYSWITCHNOTE = 40;
 
 const var legatoKeySwitchNote = 49; //Db4 in cakewalk
 
 const var FIRSTKEYSWITCH = SUSTAINKEYSWITCHNOTE;
 const var LASTKEYSWITCH = SFXKEYSWITCHNOTE;
 
 const var FIRSTPERCUSSION = 23;
 const var LASTPERCUSSION = 31;
 
 const var AUTOFRETMODEKEYSWITCH = 50;
 const var FORCEFRETMODEKEYSWITCH = 51;
 
 
 namespace PerformanceType
 {
 	const var SUSTAIN = 0;
 	const var LEGATOUP = 1;
 	const var LEGATODOWN = 2;
 	const var MUTE = 3;
 	const var HARMONIC = 4;
 	const var TREMOLO = 5;
 	const var SFX = 6;
 	
 	const var NUMOFPERFORMANCES = 7;
 	//SFX will just be separate keys down low... maybe
 }