export function getMyLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers/assignedLocations`,
    method: 'GET'
  }
}

export function postMyLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers/assignedLocations`,
    method: 'POST'
  }
}