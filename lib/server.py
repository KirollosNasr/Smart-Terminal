from flask import Flask , jsonify , request;
from os.path import join , sep , isfile;
from speech.speech import Speech;
from exec import Run;
from files import rootFolder , subContent , ROOTPATH , FOLDERNAME , Time , fullDate , getUserName;
from shlex import split;
from os import getcwd;

def PATH() : return join(ROOTPATH , FOLDERNAME , Time.getYear() , Time.getMonth() , "log.csv");
rootFolder();
subContent();

fl = open(PATH() ,"a");
app = Flask(__name__);
runner = Run();
speech = Speech();


def logData(query , reply , cmd , statues) :
	global fl;

	def fileName(name) :
		parents = name.split(sep)[-3:][:-1]
		if parents[0] == Time.getYear() and parents[1] == Time.getMonth() : return True;
		return False;
	rootFolder();
	subContent();
	line = "{0},{1},{2},{3},{4}\n".format(query , reply , cmd , statues , fullDate());
	if not isfile(fl.name) or not fileName(fl.name) :
		fl = open(PATH() ,"a");
		fl.write(line);
		fl.flush();
		return;
	fl.write(line);
	fl.flush();


def cwd() :
	c = getcwd();
	if c == join("/" , "home" , getUserName()) : return "~";
	return c;


@app.route('/text' , methods=["POST"])
def text() :
	query = request.data.decode('utf-8')
	(reply , command , statues , talkable) = runner.exec(query);
	logData(query , reply, command , statues);
	if talkable == "0" : 
		speech.speak(reply)
	return jsonify({
			"query"    : query,
			"response" : reply,
			"statues"  : statues,
			"cwd"      : cwd()
		});



@app.route("/voice" , methods=["GET"])
def voice() :
	query = speech.listen();
	if query == "" :
		speech.speak("I can not hear you clearly, please speak again!"); 
		return jsonify({
			"query"    : "",
			"response" : "I can not hear you clearly, please speak again!",
			"statues"  : "2",
			"cwd"      : cwd()});
	(reply , command , statues , talkable) = runner.exec(query);
	logData(query , reply, command , statues);
	if talkable == "0" : speech.speak(reply);
	return jsonify({
			"query"    : query, 
			"response" : reply,
			"statues"  : statues,
			"cwd"      : cwd() 
	});




@app.route('/shutdown', methods=["GET"])
def shutdown():
	def shutdown_server():
		func = request.environ.get('werkzeug.server.shutdown')
		if func != None : func()
	shutdown_server();
	return "the server is shutting down.."


@app.route('/usage', methods=["POST"])
def getUsage() :
	days = request.data.decode('utf-8')
	days = days.strip();
	try :
		days = int(days)
	except : return jsonify(runner.usage(7));
	else :
		return jsonify(runner.usage(days));



@app.route("/test" , methods=["GET"])
def test() :
	return "jesus christ"






if __name__ == "__main__" :
	try :
		app.run(port = 9000 , debug = True);
	except : pass;
