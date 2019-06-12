from os import nice;
from os.path import split , join
from subprocess import Popen , PIPE;
from time import sleep, time;
from database import db;
from files import Time, isFileExists

try : nice(19);
except : pass;

def run(command , password=None) :
	if password != None :
		command = command.replace("sudo","echo {0} | sudo -S ".format(password))
	result = Popen(command , shell = True,stdout=PIPE,stderr=PIPE,stdin=PIPE)
	output , err = result.communicate()	
	if result.returncode != 0 : raise ValueError("the query <{0}> can't work correctly".format(command))
	#its items cannot be "" or "\n" or any mix of them with any times, can be empty
	return [c for c in output.decode("utf-8").split("\n") if c.replace(" ","").replace("\n","") != ""];


def getCurrentUIprocesses() : 
	pids = run("wmctrl  -lp | awk  '{ print $3 }' | sort | uniq")
	names = [];
	for pid in pids :
		try :
			pname = run("cat /proc/{0}/comm".format(pid))[0]
			if pname.replace(" ","").replace("\n","") != "" : names.append(pname);
		except : pass;
	return list(set(names)) #return a list of pnames in which a name cannot be "" or "\n" or any mix of them with any times
				 #the list can be empty
	

d = db();
builder = {};
counter = 1;

yearBefore = int(Time.getYear());
monthBefore = int(Time.getMonth());
dayBefore = int(Time.getDay());


while True :
	t1 = time();
	currentproc = getCurrentUIprocesses();

	yearCurrent = int(Time.getYear());
	monthCurrent = int(Time.getMonth());
	dayCurrent = int(Time.getDay());

	if yearCurrent - yearBefore != 0 or monthCurrent - monthBefore != 0 or dayCurrent - dayBefore != 0 or not isFileExists() : 
		print("jesus christ");
		d = db();
		yearBefore = yearCurrent;
		monthBefore = monthCurrent;
		dayBefore = dayCurrent;

	sleep(0.5);
	t2 = time();
	diff = round(t2 - t1 , 2);

	for c in currentproc : 
		if c not in builder.keys() : builder[c] = 0;
		else : builder[c] = round(builder[c] + diff,2);

	if counter % 20 == 0 : 
		try :
			old = d.get();
			appended = d.append(old,builder);
			d.insert(appended);
		except : pass;
		finally :
			counter = 1;
			builder = {};

	counter += 1;

	
"""

while True :
	print(getCurrentUIprocesses())
	sleep(0.5)
	print("-"*60)
"""

