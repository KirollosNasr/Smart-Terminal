from flask import Flask , jsonify , request;
from os.path import join , sep , isfile;
from speech.speech import Speech;
from exec import Run;
from monitor.files import rootFolder , subContent , ROOTPATH , FOLDERNAME , Time , fullDate;
from shlex import split;

def PATH() : return join(ROOTPATH , FOLDERNAME , Time.getYear() , Time.getMonth() , "log.csv");
rootFolder();
subContent();

fl = open(PATH() ,"a");
app = Flask(__name__);
runner = Run();
speech = Speech();

def logData(query , reply , cmd) :
	global fl;

	def fileName(name) :
		parents = name.split(sep)[-3:][:-1]
		if parents[0] == Time.getYear() and parents[1] == Time.getMonth() : return True;
		return False;
	rootFolder();
	subContent();
	line = "{0},{1},{2},{3}\n".format(query , reply , cmd , fullDate());
	if not isfile(fl.name) or not fileName(fl.name) :
		fl = open(PATH() ,"a");
		fl.write(line);
		fl.flush();
		return;
	fl.write(line);
	fl.flush();



@app.route('/text' , methods=["POST"])
def text() :
	query = request.data.decode('utf-8')
	(reply , command , statues) = runner.exec(query);
	logData(query , reply, command);
	if split(command)[0] != "cal" : speech.speak(reply)
	return jsonify({
			"query"    : query,
			"response" : reply,
			"statues"  : statues
		});



@app.route("/voice" , methods=["GET"])
def voice() :
	query = speech.listen();
	if query == "" :
		speech.speak("I can not hear you clearly, please speak again!"); 
		return jsonify({
			"query"    : "",
			"response" : "I can not hear you clearly, please speak again!",
			"statues"  : "2"});
	(reply , command , statues) = runner.exec(query);
	logData(query , reply, command);
	speech.speak(reply)
	return jsonify({
			"query"    : query, 
			"response" : reply,
			"statues"  : statues
	});




@app.route('/shutdown', methods=["GET"])
def shutdown():
	def shutdown_server():
		func = request.environ.get('werkzeug.server.shutdown')
		if func != None : func()
	shutdown_server();
	return "the server is shutting down.."


@app.route('/usage', methods=["GET"])
def getUsage() :
	return jsonify(runner.usage(7));


@app.route("/test" , methods=["GET"])
def test() :
	return "jesus christ"






if __name__ == "__main__" :
	try :
		app.run(port = 9000 , debug = True);
	except : pass;
