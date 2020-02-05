// let timerID = undefined;
let date1 = new Date()
let time = {}
let timerID = setInterval(() => {
  console.log("NONE")
}, 1000)

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
      sessionStorage.setItem('owner', JSON.stringify());
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
      clearInterval(timerID);
    })

  }
}