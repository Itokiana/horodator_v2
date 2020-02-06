const ioHook = require('iohook');
const activeWin = require('active-win');
const { Base64 } = require('js-base64');
const connectivity = require('connectivity');
const axios = require('axios');

let { 

  sendWindow, 
  start_visit_url_online, 
  select_url_online, 
  update_focused_url_online, 
  blur_url_online,
  end_visit_url_online

} = require('./cors/computer_event_to_send');

const appURI = "http://localhost:9001"


module.exports.hooking = (mainWindow) => {
  

  // ################################## IOHOOK #############################################
  ioHook.on('mousemove', event => {
    // axios.post(appURI, event)
    // console.log(JSON.stringify(event))
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("mousemove_event", '${ JSON.stringify(event) }')`)
  });

  ioHook.on('keydown', event => {
    // axios.post(appURI, event)
    // console.log(event)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
  });
  
  ioHook.on('mousewheel', event => {
    // axios.post(appURI, event)
    // console.log(event)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
  });
  
  ioHook.on('mousedown', event => {
    // axios.post(appURI, event)
    // console.log(event)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
  });

  const id = ioHook.registerShortcut([56, 15], (keys) => {
    
    // axios.post(appURI, keys)
    // console.log(keys)
    mainWindow.webContents.executeJavaScript('sessionStorage.getItem("session")').then((s) => {
      if(s !== null){
        (async () => {
          mainWindow.webContents.executeJavaScript('sessionStorage.setItem("window", "'+ JSON.stringify(await activeWin()) +'")')
          let jwt = JSON.parse(Base64.decode(s))
          sendWindow(jwt.jwt, await activeWin()).then((res) => console.log(res.data))
        })();
      }
    })
  });

  ioHook.on('mouseclick', event => {
    // axios.post(appURI, event)
    // console.log(event)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("inactivity_position", '${ JSON.stringify([]) }')`)
    mainWindow.webContents.executeJavaScript('sessionStorage.getItem("session")').then((s) => {
      if(s !== null){
        (async () => {
          let jwt = JSON.parse(Base64.decode(s))
          sendWindow(jwt.jwt, await activeWin()).then((res) => console.log(res.data))
        })();
      }
    })
  });
  
  // Register and start hook
  ioHook.start();
  
  // Alternatively, pass true to start in DEBUG mode.
  ioHook.start(true);

}


module.exports.browser_hooking = (win) => {
  var url = require("url");
  require('http').createServer(function (request, response) {

    var parsedUrl = url.parse(request.url, true); // true to get query as object
    var queryAsObject = parsedUrl.query;

    if(queryAsObject.event === 'visit'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              start_visit_url_online(queryAsObject.url, JSON.parse(Base64.decode(session)).jwt)
            }
          })
        } else {
          visit_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'focus'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(update_focused_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          focus_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'blur'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(blur_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          blur_url(queryAsObject.url, win)
        }
      })
      
    }
    if(queryAsObject.event === 'close'){
      console.log(queryAsObject)
      connectivity(function (online) {
        if (online) {
          win.webContents.executeJavaScript('sessionStorage.getItem("session")').then((session) => {
            if(session !== null){
              select_url_online(end_visit_url_online, JSON.parse(Base64.decode(session)).jwt,  queryAsObject.url)
            }
          })
        } else {
          quit_url(queryAsObject.url, win)
        }
      })
      
    }

    // console.log(JSON.stringify(queryAsObject));
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end('OK');
  }).listen(9999)
}