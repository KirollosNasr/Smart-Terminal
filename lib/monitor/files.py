from os.path import join, isdir, isfile
from os import mkdir
from time import strftime, localtime
from os.path import split , expanduser , sep , join

class Time :
	def getYear() : return strftime("%Y", localtime())
	def getMonth() : return strftime("%m", localtime())
	def getDay() : 	return strftime("%d", localtime())
	def getTime() : return strftime("%H:%M:%S", localtime())


def getUserName() : return split(expanduser("~"))[-1];

def rootFolder() :
	path = join(ROOTPATH, FOLDERNAME);
	if not isdir(path) : mkdir(path);

def subContent() :
	path = join(ROOTPATH, FOLDERNAME, Time.getYear())
	if not isdir(path) : mkdir(path);
	path = join(path, Time.getMonth())
	if not isdir(path) : mkdir(path);

def logFile() :
	path = join(ROOTPATH, FOLDERNAME, Time.getYear(), Time.getMonth(), Time.getDay()+".db");
	open(path,"ab").close();

def isFileExists() : return isfile(join(ROOTPATH, FOLDERNAME, Time.getYear(), Time.getMonth(), Time.getDay()+".db"));


ROOTPATH = join(sep , "home" , getUserName())
FOLDERNAME = "tracking"
