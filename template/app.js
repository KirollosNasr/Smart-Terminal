const electron = require('electron'),
       {app, BrowserWindow , Menu ,ipcMain} = electron ;

let mainWin ;

const {PythonShell} = require("python-shell");

//run server starter at each start 
PythonShell.run("../lib/server.py", null, function(err , results){
	if(err) {
		
	}
});
 


let appMenu = [ { label : "menue 1" },{ label : "menue 2" } ]
    
app.on('ready', () => {
    mainWin = new BrowserWindow({width: 800, height: 600});
    mainWin.loadFile('chat_window.html')
    mainWin.maximize()
    mainWin.on('closed' , () => {app.quit()})

    let mainMenu = Menu.buildFromTemplate(appMenu)})    
