const { app, BrowserWindow } = require('electron');
const path = require('path');

const MAIN_HTML = path.join('file://', __dirname, 'index.html');
const CHILD_PADDING = 50;

const onAppReady = function () {
  let parent = new BrowserWindow({
    width: 850,
    height: 575,
    transparent: true,
    frame: true,
    icon: path.join(__dirname, 'img/face3.png')
  });



const {PythonShell} = require("python-shell");
//run server starter at each start 
PythonShell.run("../lib/server.py", null, function(err , results){
  if(err) {
    
  }
});


  parent.setMenu(null)

  parent.once('close', () => {
    parent = null;
  });

  parent.loadURL(MAIN_HTML);
};

//~ app.on('ready', onAppReady);
app.on('ready', () => setTimeout(onAppReady, 500));
