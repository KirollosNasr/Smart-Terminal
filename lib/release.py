from requests import get;

url  = "http://localhost:9000/shutdown" 
try :
	response = get(url);
except : exit(0);