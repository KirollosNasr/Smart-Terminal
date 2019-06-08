function sendQuery() {
    var textQuery = document.getElementById("userInput").value; 

    var xhttp = new XMLHttpRequest();

    try {
        xhttp.open("POST", "http://localhost:9000/text", false);
        xhttp.send(textQuery)

        var json = JSON.parse(xhttp.responseText);

        if(json["statues"] == "1") {
        	console.log("your command can't run probably") // error in running the command
        }

        if(json["statues"] == "0") {
        	console.log("your command run successfully") // command done
        }
    }
    catch(err) {
    	console.log("error in connection");
    }
 
} 


//---------------------------------------------------------------------------


function voiceQuery() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var json = JSON.parse(xhttp.responseText);

                if(json["statues"] == "2") {
                	console.log("I can not hear you clearly, please speak again!")
                }

                if(json["statues"] == "1") {
                	console.log("your command can't run probably")
                }

                if(json["statues"] == "0") {
                	console.log("your command run successfully")
                }                
            }
            catch {
                console.log("error in json parsing");
            }
        }
    }
    try {
        xhttp.open("GET", "http://localhost:9000/voice", true);
        xhttp.send();
    }
    catch(err) { 
    	console.log("error in connection") 
    }
}

