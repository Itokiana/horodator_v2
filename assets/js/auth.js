let login = (email, password) => {
  const data = {
    email: email,
    password: password
  };
  axios.post(api_base_uri.horodator_server + '/api/login', data)
  .then((res) => {
    if(res.status === 200) {
      if(res.data.jwt !== undefined){
        console.log("DATA = > ", res.data)
        let current_user = Base64.encode(JSON.stringify(res.data))
        sessionStorage.setItem("session", current_user);

        $("#login").hide()
        $("#chrono").show()
        date1 = new Date()
        startHorodator()
        
      } else {
        console.log("ERREUR DE LOGIN")
        var inputEl = $('.validate-input .input100');
        console.log(inputEl)

        for(var i=0; i<inputEl.length; i++) {
          $(inputEl[i]).parent().addClass('alert-validate');
        }
      }
    }
  })
}

let logout = e => {
  e.preventDefault();

  let jwt_token = JSON.parse(Base64.decode(sessionStorage.getItem("session"))).jwt
  let owner = JSON.parse(sessionStorage.getItem("owner"))

  if(owner !== null){
    axios({
      method: "PUT",
      headers: {
        "Authorization": jwt_token
      },
      url: api_base_uri.horodator_server + '/end_horodator',
      data: { schedule: owner.schedule }
    }).then((res) => {
      sessionStorage.setItem("owner", JSON.stringify(res.data))
      sessionStorage.removeItem("session")
      sessionStorage.removeItem("state")
    })
  } else {
    sessionStorage.removeItem("session")
  }
}