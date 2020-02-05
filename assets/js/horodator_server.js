
let start = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'post',
    url: api_base_uri.horodator_server + '/start_horodator',
    data: data
  })
}
let stop = (jwt, data) => {
  return axios({
    headers: { 'Authorization': jwt },
    method: 'put',
    url: api_base_uri.horodator_server + '/end_horodator',
    data: data
  })
}