from flask import Flask , jsonify , request;
from os.path import join , sep , isfile;
from speech.speech import speak , listen;
from exec import Run;
from monitor.files import rootFolder , subContent , ROOTPATH , FOLDERNAME , Time;

def PATH() : return join(ROOTPATH , FOLDERNAME , Time.getYear() , Time.getMonth() , "log.csv");
rootFolder();
subContent();

classes=['amixer -D pulse sset Master 50%+', 'amixer -D pulse sset Master 50%-', 'cal', 'cal -y', 'date', 'hostname -i', 'mkdir','mkdir -m 777', 'pkill', 'poweroff', 'reboot', 'systemctl suspend','uname -a', 'uptime -p', 'whoami', 'eject', 'rm', 'rm -r','uptime -p']
fl = open(PATH() ,"a");
app = Flask(__name__);
runner = Run();

def logData(query , reply , cmd) :
	global fl;

	def fileName(name) :
		parents = name.split(sep)[-3:][:-1]
		if parents[0] == Time.getYear() and parents[1] == Time.getMonth() : return True;
		return False;
	rootFolder();
	subContent();
	line = "{0},{1},{2},{3},{4}\n".format(query , reply , cmd , "{0}-{1}-{2}".format(Time.getYear() , Time.getMonth() , Time.getDay()) , Time.getTime());
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
	# if query.replace(" ","") == "" : return "error has been detected";
	(reply , command , statues) = runner.exec(query);
	logData(query , reply, command);
	if command not in ["cal" , "cal -y"] : speak(reply)
	# return reply;
	return jsonify({
			"query"    : query,
			"response" : reply,
			"statues"  : statues
		});



@app.route("/voice" , methods=["GET"])
def voice() :
	query = listen();
	if query == "" :
		speak("I can not hear you clearly, please speak again!"); 
		return jsonify({
			"query"    : "",
			"response" : "I can not hear you clearly, please speak again!",
			"statues"  : "2"});
	(reply , command , statues) = runner.exec(query);
	logData(query , reply, command);
	speak(reply)
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
	return jsonify(runner.usage());


@app.route("/test" , methods=["GET"])
def test() :
	return "jesus christ"






if __name__ == "__main__" :
	try :
		app.run(port = 9000 , debug = True);
	except : pass;
