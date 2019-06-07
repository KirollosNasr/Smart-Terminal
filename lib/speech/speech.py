from speech_recognition import Recognizer , Microphone , UnknownValueError , RequestError;
from os import system , listdir;
from os.path import join , isfile , isdir;
from pathlib import Path;
from threading import Thread;

PATH  = str(Path(Path(__file__).resolve()).parent);
VOICE = join(PATH , "voices" , 'cmu_us_slt.flitevox')

RECOGNIZER = Recognizer()
RECOGNIZER.dynamic_energy_threshold = False;
RECOGNIZER.energy_threshold = 400;
RECOGNIZER.non_speaking_duration = 0.3
MICROPHONE = Microphone();


def _speak(text) :
	if not text.replace(" ","") == "" and isfile(VOICE) : 
		system("flite -voice '{0}' -t '{1}'".format(VOICE , text));

def speak(text) : 
	thrd = Thread(target=lambda : _speak(text))
	thrd.start(); 


def listen() :
	with MICROPHONE as source :
		RECOGNIZER.adjust_for_ambient_noise(source , duration=0.2)
		print("Speak:")
		audio = RECOGNIZER.listen(source)   
		try:
			return RECOGNIZER.recognize_google(audio);
		except UnknownValueError:
			return "";
		except RequestError as e:
			return "";



# speak("enough")
# print(listen())