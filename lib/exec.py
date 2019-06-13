from sklearn.externals.joblib import load;
from dill import load as cload;
from subprocess import Popen , PIPE;
from correct import normalizeQuery;
from analysis import Collect;
from os import chdir , getcwd;
from os.path import expanduser;

# classes=['amixer -D pulse sset Master 50%+', 'amixer -D pulse sset Master 50%-', 'cal', 'cal -y', 'date', 'hostname -i', 'mkdir','mkdir -m 777', 'pkill', 'poweroff', 'reboot', 'systemctl suspend','uname -a', 'uptime -p', 'whoami', 'eject', 'rm', 'rm -r','uptime -p']

classes=['amixer -D pulse sset Master 50%+', 'amixer -D pulse sset Master 50%-', 'cal', 'cal -y', 'cd', 'cd..', 'cd ~', 'date', 'hostname -i', 'mkdir', 'mkdir -m 777', 'pkill', 'poweroff', 'pwd', 'reboot', 'systemctl suspend',' uname -a', 'whoami','eject', 'rm', 'rm -r']


model      = load("../data/models/model.bin");
feature    = load("../data/models/feature.bin");
correction = cload(open("../data/models/correction.bin" , "rb"));

class Run :
	@staticmethod
	def _run(command , password=None) :
		if password != None :
			command = command.replace("sudo","echo {0} | sudo -S ".format(password), 1)#first occurance
		result = Popen(command , shell = True,stdout=PIPE,stderr=PIPE,stdin=PIPE)
		output , err = result.communicate()	
		if result.returncode != 0 : raise ValueError("the query <{0}> can't work correctly".format(command))
		return output.decode("utf-8")

	def _predict(self, query) :
		(query , quotedwords) = normalizeQuery(query , 0.55 , correction);
		query = [" ".join(query)];
		t_data  = feature.transform(query).toarray()
		result  = model.predict(t_data)
		result  = result[0]
		cmd = classes[result];
		
		return (cmd  , quotedwords);


	def exec(self, query) :
		command = self._predict(query);

		if command[0].strip() == "cd" :
			if len(command[1]) != 1  : return ("Sorry, please give me a correct directory." , "cd {0}".format(" ".join(command[1])) , "1");
			else :
				directory = command[1][0];
				try :
					if directory.strip('"').strip() == "~" : 
						chdir(expanduser("~"));
					else :
						chdir(directory.strip('"'));
				except : return ("Sorry, we can't change the directory to this path" , "cd {0}".format(directory) , "1" , "0")
				else :
					return ("We change the working directory to {0}".format(getcwd()) , "cd {0}".format(directory) , "0" , "0")


		try :
			commandLiteral = "{0} {1}".format(command[0] , " ".join(command[1]));
			output = self._run(commandLiteral)
		except : 
			return ("Sorry your command can not be executed correctly" , commandLiteral , "1" , "0");
		else :
			if command[0] in ['date', 'hostname -i','uname -a', 'uptime -p', 'whoami','uptime -p'] :
				return (output.strip() , commandLiteral , "0" , "0");
			elif command[0] in ['cal', 'cal -y'] : return (output.strip() , commandLiteral , "0" , "1");
			elif command[0] == 'amixer -D pulse sset Master 50%+' : return ("Sound has raised 50%" , commandLiteral , "0" , "0")
			elif command[0] == 'amixer -D pulse sset Master 50%-' : return ("Sound has lowed 50%" , commandLiteral , "0" , "0")
			elif command[0] == 'eject' : return ("CD-ROM has opened" , commandLiteral , "0" , "0")
			elif command[0] in ['mkdir','mkdir -m 777'] : return ("A new folder is created with name {0}".format(" ".join(command[1])) , commandLiteral , "0" , "0")
			elif command[0] == "pkill" : return ("The process {0} is closed".format(" ".join(command[1])) , commandLiteral , "0" , "0")
			elif command[0] == "poweroff" : return ("The computer is turing off now" , commandLiteral , "0" , "0")
			elif command[0] == "reboot" : return ("Your computer will restart shortly" , commandLiteral , "0" , "0")
			elif command[0] == "systemctl suspend" : return ("Your machine will sleep now" , commandLiteral , "0" , "0")
			elif command[0] in ["rm" , "rm -r"] : return ("{0} has deleted".format(" ".join(command[1])) , commandLiteral , "0" , "0")

	def usage(self , days) :
		return Collect(days).getMonitoringData();


if __name__ == "__main__" : 
	print(Run().exec('please i would ask you change the existing working folder to previous folder'))
