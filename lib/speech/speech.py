from speech_recognition import Recognizer , Microphone , UnknownValueError , RequestError;
from os import system , listdir;
from os.path import join , isfile , isdir;
from pathlib import Path;
from threading import Thread;
from re import sub;

PATH  = str(Path(Path(__file__).resolve()).parent);
VOICE = join(PATH , "voices" , 'cmu_us_slt.flitevox')


class Speech :
	def __init__(self) :
		self.recognizer = Recognizer()
		self.recognizer.dynamic_energy_threshold = False;
		self.recognizer.energy_threshold = 400;
		self.recognizer.non_speaking_duration = 0.3
		self.microphone = Microphone();

	def listen(self) :
		with self.microphone as source :
			self.recognizer.adjust_for_ambient_noise(source , duration=0.2)
			print("Speak:")
			audio = self.recognizer.listen(source)   
			try:
				return self.recognizer.recognize_google(audio);
			except UnknownValueError:
				return "";
			except RequestError as e:
				return "";

	@staticmethod
	def _speak(text) :
		if not text.replace(" ","") == "" and isfile(VOICE) : 
			system('flite -voice "{0}" -t "{1}"'.format(VOICE , sub(r'[^a-zA-Z0-9\s\/\,\?\.]', ' ', text)));

	def speak(self , text) : 
		thrd = Thread(target=lambda : self._speak(text))
		thrd.start(); 



