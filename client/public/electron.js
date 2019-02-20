const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

let mainWindow;

function createWindows() {

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  console.log(width, height);

  mainWindow = new BrowserWindow({width: width*0.7, height: height*0.75, backgroundColor: '#f4f9fd', frame: false, resizable: false, show: false});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : './public/index.html');
  mainWindow.on('closed', () => mainWindow = null);


  splash = new BrowserWindow({width: width*0.15, height: height*0.4, backgroundColor: '#f4f9fd', frame: false, resizable: false});
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
