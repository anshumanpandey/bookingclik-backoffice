export function getTopLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/top-locations/get`,
    method: 'GET'
  }
}

export function saveTopLocation() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/top-locations/save`,
    method: 'POST'
  }
}


export function deleteTopLocation() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/top-locations/delete`,
    method: 'DELETE'
  }
}

