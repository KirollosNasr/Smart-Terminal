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


var model = (function (viewCtrl) {

    let replyJSONmsg;


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
        textQueryReply: function (textQuery) {

            let xhttp = new XMLHttpRequest();
            try {
                xhttp.open("POST", "http://localhost:9000/text", false);
                xhttp.send(textQuery);

                replyJSONmsg = JSON.parse(xhttp.responseText);
            }
            catch (e) {
                replyJSONmsg["statues"] = '4';
            }

            return replyJSONmsg;
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
        startRecordingSound: function () {

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        replyJSONmsg = JSON.parse(xhttp.responseText);

                        // TODO 'Search for Asyc variables scope'
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            };

            try {
                xhttp.open("GET", "http://localhost:9000/voice", true);
                xhttp.send();
            }
            catch(err) {
                console.log("error in connection");
            }
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
        cmdSpan:'#span-',
        serverRes: '#CMDoutput-',
    };

    let osUsername = os.userInfo().username;
    let osHostname = os.hostname();

    let inputCmdList = [];
    let serverResList = [];

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
            let inputCmd = `<div id="inputCMD-${eid}">
                                <span id="span-${eid}" class="glitch a" data-text="GLITCH">${osUsername}@${osHostname}</span>:<span id="b">~</span><span id="c">$</span>
                                <input id="userInput-${eid}" type="text">
                                
                                <button  id="sendbtn-${eid}" class="recbtn" style="display: none"><i class="a glyphicon glyphicon-send" style="font-size:13px; "></i></button>
                                <button id="recbtn-${eid}" class="recbtn"><i id="a" class="fa fa-microphone" style="font-size:17px"></i></button>
                                
                            </div>`;

            // 2. Place it before end of it's parent
            document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', inputCmd);
            document.querySelector(`${DOMstrings.userInput}${eid}`).setAttribute('autofocus', '');

            // 3. Add divID number
            inputCmdList.push(eid);
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
        displayAppropriteRep: function (replyJSONmsg) {

            let serverRespose, eid, warnRep, infoRep, succRep, errRep;

            serverRespose = replyJSONmsg["response"];

            (serverResList.length === 0) ? eid = 0 : eid = serverResList[serverResList.length -1] + 1;

            warnRep= `<div id="CMDoutput-${eid}">
                                <div id="warnMsg">
                                    <span class="warn"><strong>WARNING:</strong></span> <span>${serverRespose}</span>
                                </div>
                            </div>`;

            infoRep = `<div id="CMDoutput-${eid}">
                                <div id="infoMsg">
                                    <span class="info"><strong>INFO:</strong></span> <span>${serverRespose}</span>
                                </div>
                           </div>`;

            succRep = `<div id="CMDoutput-${eid}">
                                <div id="successMsg">
                                    <span class="success"><strong>SUCCESS:</strong></span> <span>${serverRespose}</span>
                                </div>
                           </div>`;

            errRep = `<div id="CMDoutput-${eid}">
                            <div id="errMsg">
                                <span class="err"><strong>ERROR:</strong></span> <span>${serverRespose}</span>
                            </div> 
                        </div>`;

            console.log("NOt hereee")
            if (replyJSONmsg["statues"] === '0') {
                document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', succRep);
            } else if (replyJSONmsg["statues"] === '1') {
                document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', errRep);
            } else if (replyJSONmsg["statues"] === '2') {
                document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', infoRep);
            } else if (replyJSONmsg["statues"] === '3') {
                // TODO 'Model Not Understood'
            } else if (replyJSONmsg["statues"] === '4') {
                document.querySelector(DOMstrings.console).insertAdjacentHTML('beforeend', errRep);
            } else {
                console.log("There is a big fucken error")
            }

            serverResList.push(eid);
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
            document.querySelector(`${DOMstrings.userInput}${eid}`).setAttribute('disabled', '');

            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).removeAttribute('class');
            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).removeAttribute('data-text');
            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).setAttribute('class', 'a');

            document.querySelector(`${DOMstrings.recBtn}${eid}`).style.display = "none";
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
        blockOldEmptyInputCmd: function (eid){
            // Blocks elements by id
            document.querySelector(`${DOMstrings.userInput}${eid}`).style.display = "none";

            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).removeAttribute('class');
            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).removeAttribute('data-text');
            document.querySelector(`${DOMstrings.cmdSpan}${eid}`).setAttribute('class', 'a');

            document.querySelector(`${DOMstrings.recBtn}${eid}`).style.display = "none";
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
            for (let i = 0; i < inputCmdList.length; i++) {
                document.querySelector(`${DOMstrings.cmdDiv}${i}`).style.display = "none";
            }

            for (let i = 0; i < serverResList.length; i++) {
                document.querySelector(`${DOMstrings.serverRes}${i}`).style.display = "none";
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
        showMicBtn: function (eid) {
            document.querySelector(`${DOMstrings.sendBtn}${eid}`).style.display = 'none';
            document.querySelector(`${DOMstrings.recBtn}${eid}`).removeAttribute('style');
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
        showSendBtn: function (eid) {
            document.querySelector(`${DOMstrings.recBtn}${eid}`).style.display = 'none';
            document.querySelector(`${DOMstrings.sendBtn}${eid}`).removeAttribute('style');
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
        getResList: function () {
            return serverResList;
        }
    }
})();



var controller = (function (modelCtrl, viewCtrl) {

    let inputCmdList, serverResList, replyJSONmsg;

    inputCmdList = viewCtrl.getInputCmdList();
    serverResList = viewCtrl.getResList();

    let setupEventListeners = function () {

        let DOMstrings = viewCtrl.getDOMStrings();

        /*document.querySelector(`${DOMstrings.userInput}${inputCmdList[inputCmdList.length - 1]}`).addEventListener('input', () => {
            if (document.querySelector(`${DOMstrings.userInput}${inputCmdList[inputCmdList.length - 1]}`).value === "") {
                viewCtrl.showMicBtn(inputCmdList[inputCmdList.length - 1]);
            } else {
                viewCtrl.showSendBtn(inputCmdList[inputCmdList.length - 1]);
            }
        });*/

        document.querySelector(`${DOMstrings.recBtn}${inputCmdList[inputCmdList.length - 1]}`).addEventListener('click', appendSoundQuery);

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {

                let inputText = document.querySelector(`${DOMstrings.userInput}${inputCmdList.length - 1}`).value.toLowerCase();

                // 1. Check if input is emptu
                if (inputText === "") {

                    // 1. Block input & Btns
                    viewCtrl.blockOldEmptyInputCmd(inputCmdList[inputCmdList.length - 1]);

                    // 2. Display new one
                    viewCtrl.displayCmd(inputCmdList.length);
                } else if (inputText === "clear") {

                    console.log(`Arr=  ${inputCmdList}`);

                    // 1. Loop over all input Cmd divs
                    viewCtrl.blockAllInputCmd();

                    // 2. Display new one
                    viewCtrl.displayCmd(inputCmdList.length);

                } else {
                    appendTextQuery(inputText);
                }
            }
        });
    };

    let checkInputText = function () {

    };

    let appendTextQuery = function (inputText) {
        // 1. Call server for reply
        replyJSONmsg = modelCtrl.textQueryReply(inputText);

        // 2. View Appropriate reply
        viewCtrl.displayAppropriteRep(replyJSONmsg);

        // 3. Block old text
        viewCtrl.blockOldInputCmd(inputCmdList[inputCmdList.length - 1]);

        // 4. Display new one
        viewCtrl.displayCmd(inputCmdList.length);
    };

    let appendSoundQuery = function () {

        // 1. Call server for reply
        replyJSONmsg = modelCtrl.startRecordingSound();

        // 2. View Appropriate reply
        viewCtrl.displayAppropriteRep(replyJSONmsg);

        // 3. Block old text
        viewCtrl.blockOldInputCmd(inputCmdList[inputCmdList.length - 1]);

        // 4. Display new one
        viewCtrl.displayCmd(inputCmdList.length);
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
          modelCtrl.createServerConnection();

          // 2. Initial display for Cmd input
          (inputCmdList.length === 0) ? viewCtrl.displayCmd(0) : viewCtrl.displayCmd(inputCmdList.length);

          // 3. Setup Event listenters
          setupEventListeners();

      }
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
