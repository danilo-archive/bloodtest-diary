const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

let mainWindow;

function createWindows() {
  mainWindow = new BrowserWindow({width: 1200, height: 800, backgroundColor: '#f4f9fd', frame: false, resizable: false, show: false});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : './public/index.html');
  mainWindow.on('closed', () => mainWindow = null);


  splash = new BrowserWindow({width: 300, height: 400, backgroundColor: '#f4f9fd', frame: false, resizable: false});
  splash.loadFile('./public/loading.html');



}


app.on('ready', () => {
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
