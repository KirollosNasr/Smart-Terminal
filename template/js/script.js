/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
 * @author Smart-Terminal Team.
 * @since  0.9
 */

/** jshint {inline configuration here} */


const os = require(`os`);
const {PythonShell} = require("python-shell");


var model = (function () {



    return {

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        createServerConnection: function () {

            PythonShell.run("../lib/server.py", null);

            return console.log(`Server Connected Successfully`)
        }
    }
})();

var view = (function () {

    let DOMstrings = {
        console: '#console',
        cmdDiv: '#inputCMD-',
        sendBtn: '#sendbtn-',
        recBtn: '#recbtn-',
        userInput:'#userInput-',
    };

    let osUsername = os.userInfo().username;
    let osHostname = os.hostname();

    let inputCmdList = [];

    return {

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        displayCmd: function (eid) {

            // 1. Pick inputCmd Div
            /*let inputCmd = `<div id="inputCMD-${eid}">
                                <span id="a"><strong>${osUsername}@${osHostname}</strong></span>:<span id="b">~</span><span id="c">$</span>
                                <input id="${DOMstrings.userInput}${eid}" type="text" autofocus>
                                <button id="${DOMstrings.sendBtn}${eid}" class="recbtn"><i class="glyphicon glyphicon-send" style="font-size:17px; margin-top: 5px; margin-right: 2px"></i></button>
                                <button id="${DOMstrings.recBtn}${eid}" class="recbtn"><i class="fa fa-microphone" style="font-size:17px"></i></button>
                            </div> `;*/

            let inputCmd = `<div id="inputCMD-${eid}">
                                <span id="a" class="glitch" data-text="GLITCH"><strong>${osUsername}@${osHostname}</strong></span>:<span id="b">~</span><span id="c">$</span>
                                <input id="userInput-${eid}" type="text">
                                <button id="sendbtn-${eid}" class="recbtn"><i id="a" class="glyphicon glyphicon-send" style="font-size:17px; margin-top: 5px; margin-right: 2px"></i></button>
                                <button id="recbtn-${eid}" class="recbtn"><i id="a" class="fa fa-microphone" style="font-size:17px"></i></button>
                            </div>`;

            // 2. Place it before end of it's parent
            document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', inputCmd);
            document.querySelector(`${DOMstrings.userInput}${eid}`).setAttribute('autofocus', '');

            // 3. Add divID number
            inputCmdList.push(eid);
        },

        displayCmdChild: function (){
            let parent
        },

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        blockOldInputCmd: function (eid){
            // Blocks elements by id
            document.querySelector(`${DOMstrings.userInput}${eid}`).style.display = "none";
            document.querySelector(`${DOMstrings.userInput}${eid}`).removeAttribute('autofocus');
            document.querySelector(`${DOMstrings.sendBtn}${eid}`).style.display = "none";
            document.querySelector(`${DOMstrings.recBtn}${eid}`).style.display = "none";

            (eid === 0) ? console.log(`###########`): console.log('');
        },

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        blockAllInputCmd: function (){
            // Blocks elements by id
            for (let i = 0; i < inputCmdList.length; i++){
                document.querySelector(`${DOMstrings.cmdDiv}${i}`).style.display = "none";
            }
        },

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        getDOMStrings: function () {
            return DOMstrings;
        },

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        getInputCmdList: function () {
            return inputCmdList;
        },

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
    }
})();



var controller = (function (modelCtrl, viewCtrl) {

    let inputCmdList = viewCtrl.getInputCmdList();

    var setupEventListeners = function () {
        var DOMstrings = viewCtrl.getDOMStrings();

        document.querySelector(`${DOMstrings.sendBtn}${inputCmdList.length - 1}`).addEventListener('onclick', appendSend);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                // 1. Check if input is emptu
                if (document.querySelector(`${DOMstrings.userInput}${inputCmdList.length - 1}`).value === "") {

                    // 1. Block input & Btns
                    viewCtrl.blockOldInputCmd(inputCmdList[inputCmdList.length - 1]);

                    // 2. Display new one
                    viewCtrl.displayCmd(inputCmdList.length);
                } else if (document.querySelector(`${DOMstrings.userInput}${inputCmdList.length - 1}`).value === "clear") {

                    console.log(`Arr=  ${inputCmdList}`);

                    // 1. Loop over all input Cmd divs
                    viewCtrl.blockAllInputCmd()

                    // 2. Display new one
                    viewCtrl.displayCmd(inputCmdList.length);

                }
            }
        });
    };

    var appendSend = function () {
      console.log('Button has been clicked');
    };

    return {

        /**
         * Summary. (Displays initial Cmd input.)
         *
         * Description. (Used mainly at the first init() call.)
         *
         * @since      0.9
         *
         * @memberof view
         *
         * @fires   eventName
         * @fires   className#eventName
         * @listens event:eventName
         * @listens className~event:eventName
         *
         * @param {type}   var           Description.
         * @param {type}   [var]         Description of optional variable.
         * @param {type}   [var=default] Description of optional variable with default variable.
         * @param {Object} objectVar     Description.
         * @param {type}   objectVar.key Description of a key in the objectVar parameter.
         *
         * @return {type} Description.
         */
        init: function () {
          console.log(' App has Started!');

          // 1. Initialize new server connection
          //modelCtrl.createServerConnection();

          // 2. Initial display for Cmd input
          (inputCmdList.length === 0) ? viewCtrl.displayCmd(0) : viewCtrl.displayCmd(inputCmdList.length);

          // 3. Setup Event listenters
          setupEventListeners();

      },
    }
})(model, view);

controller.init();


/*
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
*/


//---------------------------------------------------------------------------


/*
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
*/
