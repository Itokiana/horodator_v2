// let timerID = undefined;
let date1 = new Date()
let date2 = new Date()
let time = {}
let time2 = {}
let timerID = setInterval(() => {
  console.log("NONE")
}, 1000)

let inactivitySenderID = setInterval(() => {
  console.log("NONE")
}, 1000)

if(sessionStorage.getItem("date1") !== null){
  date1 = new Date(sessionStorage.getItem("date1"))
  console.log("DATE 1 => ", date1)
  timerID = setInterval(() => {
    date2 = new Date();
    time = dateDiff(date1, date2)
    $("#timer").html(`${ ("0" + time.hour).slice(-2) }:${ ("0" + time.min).slice(-2) }:${ ("0" + time.sec).slice(-2) }`)
  }, 1000)
}

let startHorodator = () => {
  let session = sessionStorage.getItem("session");
  let computerInfos = sessionStorage.getItem("computer_infos");

  if(session !== null && computerInfos !== null ){
    console.log(computerInfos)
    let c = JSON.parse(computerInfos)

    session = Base64.decode(session);
    console.log(session)
    start(
      JSON.parse(session).jwt,
      {
        ip: c.ip,
        mac: c.mac
      }
    ).then((res) => {
      sessionStorage.setItem('owner', JSON.stringify(res.data));
      date1 = new Date()
      sessionStorage.setItem("date1", date1)
    })

  }
}

let restartHorodator = () => {
  let session = sessionStorage.getItem("session");
  let computerInfos = sessionStorage.getItem("computer_infos");

  if(session !== null && computerInfos !== null ){
    console.log(computerInfos)
    let c = JSON.parse(computerInfos)

    session = Base64.decode(session);
    console.log(session)
    start(
      JSON.parse(session).jwt,
      {
        ip: c.ip,
        mac: c.mac
      }
    ).then((res) => {
      sessionStorage.setItem('owner', JSON.stringify(res.data));
    })

  }
}

let reportInactivity = (data) => {
  let session = sessionStorage.getItem("session");
  let owner = sessionStorage.getItem("owner");
  if(session !== null && owner !== null){

    session = Base64.decode(session);

    axios({
      headers: { 'Authorization': JSON.parse(session).jwt },
      method: 'post',
      url: api_base_uri.horodator_server + '/inactivity',
      data: data
    })

  }
}


let stopHorodator = () => {
  let session = sessionStorage.getItem("session");
  let owner = JSON.parse(sessionStorage.getItem("owner"))

  if(session !== null){

    session = Base64.decode(session);
    console.log(session)
    stop(
      JSON.parse(session).jwt,
      { schedule: owner.schedule }
    ).then((res) => {
      sessionStorage.removeItem('owner');
    })

  }
}