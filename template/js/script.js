const {ipcRenderer} = require('electron');
const http = require('http');
const fs = require('fs');
const os = require('os');
const {exec} = require('child_process');

console.log('Application Started ...');

let osUserName = os.userInfo().username;


function checkTrackingFiles() {

    let trackingData = {
        years: 0,
        allMonths: []
    };

    console.log('4');

    fs.readdir(`/home/${osUserName}/Tracking`, (e, year) => {

        if (e) throw e;

        trackingData.years = year.sort(function(a, b){return b - a});

        trackingData.years.forEach((eachYear) => {
            fs.readdir(`/home/${osUserName}/Tracking/${eachYear}`, (e, month) => {

                if (e) throw e;

                trackingData.allMonths.push(month.sort(function(a, b){return b - a}))

                if (trackingData.years.length === trackingData.allMonths.length) {
                    showMsgs(trackingData);
                }
            });
        });
    });
}

function showMsgs(trackingFilesData) {

    console.log('1');

    console.log(trackingFilesData);
    console.log(trackingFilesData.years);

    console.log('2');
    for (let i = 0; i < trackingFilesData.years.length; i++) {

        console.log('3');


        for (let j = 0; j < trackingFilesData.allMonths[i].length ; j++) {
            trackingFilesData.allMonths[i].forEach((month) => {
                fs.readFile(`/home/${osUserName}/Tracking/${trackingFilesData.years[i]}/${month}/log.csv`, (e, data) => {
                    let prepData;


                    console.log('Hey Iam fs.readFile Function ...');
                    if (e) throw e;

                    prepData = data.toString().split("\n");

                    // loop on each line in the data to represent it
                    for (let i = 0; i < prepData.length; i++) {
                        let lineData, DOMStrings, detailedData, msgHTML, newMsgHTML;

                        DOMStrings = {
                            msgHistory: '#msg_history'
                        };

                        console.log(`I'm line ${i}`);
                        console.log(`\n`);

                        lineData = prepData[i].split(',');
                        console.log(lineData);

                        detailedData = {
                            incMsg: lineData[0],
                            repMsg: lineData[1],
                            command: lineData[2],
                            msgDate: lineData[4],
                            msgTime: lineData[5]
                        };

                        // Create HTML string with placeholder text
                        msgHTML = '<ul>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t<!User Query>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t<li>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<img src="dist/img/face.jpg" alt="avatar">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<div class="content">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="message">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="bubble">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>%reply%</p>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t<span>%date% | %time%</span>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t</li>\n' +
                            '\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t<!User Query>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t<li>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t<div class="content">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="message">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="bubble">\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>%reply%</p>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t\t<span>%date% | %time%</span>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t\t\t\t\t</li>\n' +
                            '\t\t\t\t\t\t\t\t\t\t</ul>';

                        // Replace the placeholder text with some actual data

                        newMsgHTML = msgHTML.replace('%reply%', detailedData.repMsg);
                        newMsgHTML = newMsgHTML.replace('%income%', detailedData.incMsg);
                        newMsgHTML = newMsgHTML.replace('%time%', detailedData.msgTime);
                        newMsgHTML = newMsgHTML.replace('%date%', detailedData.msgDate);

                        console.log(`newMsgHTML: ${newMsgHTML}`);

                        document.querySelector(DOMStrings.msgHistory).insertAdjacentHTML('afterbegin', newMsgHTML);
                    }
                });

            });
        }
    }
}

// checkTrackingFiles();

// function getUsage() {
//     var xhttp = new XMLHttpRequest();
//     function toTwoArrays(j) {
//         if(j == null) { return [[],[]]; }
//         data = JSON.parse(j);
//         var keys = Object.keys(data)
//         var values = Object.values(data)
//         return [keys , values]
//     }
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             // document.getElementById("test").innerHTML = xhttp.responseText;
//             document.getElementById("test").innerHTML = xhttp.responseText

//         }
//     };
//     try {
//         xhttp.open("GET", "http://localhost:9000/usage", true);
//         xhttp.send();
//     }
//     catch(err) {}
// }

//-----------------------------------------------------------------------------

function scrollButtom(eid) {
    var objDiv = document.getElementById(eid);
    objDiv.scrollTop = objDiv.scrollHeight;
}

//-----------------------------------------------------------------------------

// function s/endQuery() {
//     var q = document.getElementById("input").value; 
//     if(q.replace(" ","") == "") return;
//     appendReply(q)

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             appendSend(xhttp.responseText)
//             scrollButtom("msg_history")
//         }
//     };    
//     try {
//         xhttp.open("POST", "http://localhost:9000/text", true);
//         xhttp.send(q);
//     }
//     catch(err) {
//         appendSend("Sorry an error has been occured")
//         scrollButtom("msg_history")
//     }
	
// }

//----------------------------------------------------------------------------

function sendQuery() {
    var q = document.getElementById("input").value; 
    if(q.replace(" ","") == "") return;
    appendReply(q)

    var xhttp = new XMLHttpRequest();

    try {
        xhttp.open("POST", "http://localhost:9000/text", false);
        xhttp.send(q)
        appendSend(xhttp.responseText)
        scrollButtom("discussion")

    }
    catch(err) {
        console.log(err)
        appendSend("Sorry an error has been occured")
        scrollButtom("discussion")
    }
    
}

//----------------------------------------------------------------------------

// function appendSend(msg) {
//     var query = '<div class="incoming_msg"><div class="incoming_msg_img"><img src="linux.png" alt="sunil"> </div><div class="received_msg"><div class="received_withd_msg"><p>' + msg + '</p><span class="time_date"></span></div></div></div>';
//     document.getElementById("msg_history").innerHTML += query;
// }

// function appendSend(msg) {
//     var query = '<li>'+
//     '<img  src="dist/img/face.jpg" alt="avatar">'+
//     '<div class="content">'+
//         '<div class="message">'+
//             '<div class="bubble">'+
//                 '<p>'+ msg +'</p>'+
//             '</div>'+
//         '</div>'+
//     '</div>'+
// '</li>';
//     document.getElementById("msg_parent").innerHTML += query;
// }

function appendSend(msg) {
    var query =  '<div class="bubble sender first">'  + msg + '</div>';
    document.getElementById("discussion").innerHTML += query;
}
//----------------------------------------------------------------------------

// function appendReply(msg) {
//     var query = '<div class="outgoing_msg">'+
//                 '<div class="sent_msg"><p>' + msg + '</p><span class="time_date"></span></div></div>';
//     document.getElementById("msg_history").innerHTML += query;

// }

// function appendReply(msg) {
//     var query = '<li>'+
//     '<div class="content">'+
//         '<div class="message">'+
//             '<div class="bubble">'+
//                '<p>'+ msg +'</p>'+
//             '</div>'+
//         '</div>'+
//     '</div>'+
// '</li>';
//     document.getElementById("msg_parent").innerHTML += query;
// }

function appendReply(msg) {
    var query = '<div class="bubble recipient">'+msg+'</div>';
    document.getElementById("discussion").innerHTML += query;
}
//----------------------------------------------------------------------------

function voiceQuery() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var json = JSON.parse(xhttp.responseText);
                if(json["query"] != "") { appendReply(json["query"]) }
                appendSend(json["response"])
                scrollButtom("discussion")
            }
            catch {
                appendSend("Sorry an error has been occured ")
                scrollButtom("discussion")
            }
        }
    }
    try {
        xhttp.open("GET", "http://localhost:9000/voice", true);
        xhttp.send();
    }
    catch(err) { console.log(err) }
}

//----------------------------------------------------------------------------

// appendReply("jesus christ is here")
// appendSend("jesus christ is here");


// $('#send').click(function(){
//     var input = document.getElementById("input").value; 
//     if(input.replace(" ","") == "") return;
//     ipcRenderer.send('add', input)
//     ipcRenderer.on('added',(e,data) => document.getElementById("response").innerHTML = data) 
//     appendSend(input)
//     s/endQuery(input)
// })


// function getTrackingData() {

//      var xhttp = new XMLHttpRequest();
//      let values     = [];
//      let dataKeys   = [];
//      xhttp.onreadystatechange = function() {
//          if (this.readyState == 4 && this.status == 200) {
//             let data = JSON.parse(xhttp.responseText)
//             let keys = Object.keys(data);
            
//             for(var i = 0;i < keys.length;i++) {
//                 dataKeys.push(keys[i])
//             }
            
//             for(var j = 0;j < dataKeys.length;j++) {
//                 values.push(data[dataKeys[j]])
//             }
//          }
//          f = false;
//      };    
//      try {
//          xhttp.open("GET", "http://localhost:9000/usage", true);
//          xhttp.send();
//          return [dataKeys , values]
//      }
//      catch(err) {
//          console.log(err)
//      }
// }


//--------------------------------------------------------------------------

function createBrowserWindow() {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    const win = new BrowserWindow({
    height: 600,
    width: 800
    });
    win.loadFile('chart/samples/vue/bar/bar-with-custom-data-labels.html')
    getUsage()
}

