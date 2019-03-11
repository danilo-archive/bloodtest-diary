const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const maxWindowWidth = 1400;
const maxWindowHeight = 800;

const maxSplashwWidth = 400;
const maxSplashHeight = 500;

let width = 0;
let height = 0;

let mainWindow;

function getWindowSize(axis) {
  if (axis === "width") {
    return (width*0.7 > maxWindowWidth) ? maxWindowWidth : width*0.7;
  } else if (axis === "height") {
    return (height*0.75 > maxWindowHeight) ? maxWindowHeight : height*0.75;
  }
  return null;
}

function getSplashSize(axis) {
  if (axis === "width") {
    return (width*0.15 > maxSplashwWidth) ? maxSplashwWidth : width*0.15;
  } else if (axis === "height") {
    return (height*0.4 > maxSplashHeight) ? maxSplashHeight : height*0.4;
  }
  return null;
}

function setScreenSize() {
  width = electron.screen.getPrimaryDisplay().workAreaSize.width;
  height = electron.screen.getPrimaryDisplay().workAreaSize.height;
}

function createWindows() {

  mainWindow = new BrowserWindow({width: getWindowSize("width"), height: getWindowSize("height"), backgroundColor: '#f4f9fd', frame: false, resizable: true, show: false, minWidth : 300,
  minHeight : 300});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : './public/index.html');
  mainWindow.on('closed', () => mainWindow = null);


  splash = new BrowserWindow({width: getSplashSize("width"), height: getSplashSize("height"), backgroundColor: '#f4f9fd', frame: false, resizable: false});
  splash.loadFile('./public/loading.html');

}



app.on('ready', () => {

  setScreenSize();
  createWindows();

  mainWindow.once('ready-to-show', () => {
      //TODO: CHECK CONNECTION TO SERVER
      splash.destroy();
      mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
