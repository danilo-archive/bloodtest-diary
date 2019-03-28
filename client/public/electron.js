const electron = require('electron');
const app = electron.app;
const session  = electron.session;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');
const jsonController = require("../lib/json-controller.js");

const maxWindowWidth = 1400;
const maxWindowHeight = 800;

let width = 0;
let height = 0;

let mainWindow;
let currentSession;
let ip;
let port;

app.on('ready', () => {
  // Register a 'CommandOrControl+X' shortcut listener.
 // const ret = globalShortcut.register('CommandOrControl+R', () => {
   // return;
  //});
});

function getWindowSize(axis) {
  if (axis === "width") {
    return (width*0.75 > maxWindowWidth) ? maxWindowWidth : width*0.75;
  } else if (axis === "height") {
    return (height*0.7 > maxWindowHeight) ? maxWindowHeight : height*0.7;
  }
  return null;
}

function getSplashSize(axis) {
  if (axis === "width") {
    return 275;
  } else if (axis === "height") {
    return 375;
  }
  return null;
}

function setScreenSize() {
  width = electron.screen.getPrimaryDisplay().workAreaSize.width;
  height = electron.screen.getPrimaryDisplay().workAreaSize.height;
}

function createWindows() {

  mainWindow = new BrowserWindow({width: getWindowSize("width"), height: getWindowSize("height"), backgroundColor: '#f4f9fd', frame: false, resizable: true, show: false, minWidth : 300,
  minHeight : 300, icon: __dirname + '/assets/logo.png',});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : './public/index.html');
  mainWindow.on('closed', () => mainWindow = null);


  splash = new BrowserWindow({width: getSplashSize("width"), height: getSplashSize("height"), backgroundColor: '#f4f9fd', frame: false, resizable: false});
  splash.loadFile('./public/loading.html');

}

function getCoreCookies(callback){
    let newIp = undefined;
    let newPort = undefined;
    currentSession.cookies.get({url: "http://localhost"}, (err, cookies) => {
        console.log(cookies);
        for (let i = 0; i < cookies.length; ++i){
            let cookie = cookies[i];
            if (cookie.name === "ip"){
                newIp = cookie.value;
            }
            else if (cookie.name === "port"){
                newPort = cookie.value;
            }
        }
        callback(newIp, newPort)
    });
}

function safeExit(callback){
    getCoreCookies((newIp, newPort) => {
        if (newIp !== ip || newPort !== port){
            jsonController.writeServerConfigFile({ip: newIp, port: newPort});
        }
        callback();
    });
}

app.on('ready', () => {

  setScreenSize();
  createWindows();
  currentSession = mainWindow.webContents.session;
  let config = jsonController.getJSON("src/server_connect_config.json");
  ip = config.ip;
  port = config.port;
  currentSession.cookies.set({name: "ip", value: config.ip, url: "http://localhost"}, err => {console.log(err)});
  currentSession.cookies.set({name: "port", value: config.port, url: "http://localhost"}, err => {console.log(err)});
  mainWindow.once('ready-to-show', () => {
      splash.destroy();
      mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      safeExit( () => app.quit())
  }
});
