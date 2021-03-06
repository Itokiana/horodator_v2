const { hooking, browser_hooking } = require('./core/tracker')
const { inactivity } = require('./core/checker')
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Notification = electron.Notification;
const activeWin = require('active-win');
const psList = require('ps-list');


let mainWindow;



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1020, 
    height: 700, 
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    },
    icon: __dirname + '/index.png',
  });



  mainWindow.loadFile('index.html');
  mainWindow.center()

  hooking(mainWindow);
  inactivity(mainWindow)
  browser_hooking(mainWindow);



  setInterval(() => {

    activeWin().then(result => {
      mainWindow.webContents.executeJavaScript('sessionStorage.setItem("active_window", JSON.stringify('+ JSON.stringify(result) +') )') 
    });
    
  }, 1000);

  // setInterval(() => {
  //   (async () => {
  //     console.log(await psList());
  //     mainWindow.webContents.executeJavaScript('sessionStorage.setItem("window", JSON.stringify('+ JSON.stringify(await psList()) +') )') 
  //     //=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
  //   })();
  // }, 3000);

  setInterval(() => {
    try {
      mainWindow.webContents.executeJavaScript('sessionStorage.setItem("computer_infos", \'{ "ip": "'+ require('ip').address() +'", "mac": "'+ require('getmac').default() +'"  }\')')
    }
    catch(error) {}
  }, 15000);

  let alertInactivityNotification = new Notification({
    title: 'ALERT HORODATOR',
    body: 'Veuillez activer HORODATOR SVP !!!\nSinon votre temps de travail risquerait de ne pas être comptabilisé 😉',
    silent: false,
    icon: __dirname + '/index.png'
  })

  alertInactivityNotification.on("click", () => {
    mainWindow.focus()
    mainWindow.focusOnWebView()
  })

  setInterval(() => {
    mainWindow.webContents.executeJavaScript('sessionStorage.getItem("state")').then((status) => {
      if(status !== null){
        alertInactivityNotification.show()
      }
    })
  }, 15000);

  try {
    mainWindow.webContents.executeJavaScript('sessionStorage.setItem("computer_infos", \'{ "ip": "'+ require('ip').address() +'", "mac": "'+ require('getmac').default() +'"  }\')')
  }
  catch(error) {}
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});