export function getValuatedLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/valuated-locations/get`,
    method: 'GET'
  }
}

export function saveValuatedLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/valuated-locations/save`,
    method: 'POST'
  }
}


export function deleteValuatedLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/valuated-locations/delete`,
    method: 'DELETE'
  }
}

