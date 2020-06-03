export function postBroker() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers`,
    method: 'POST'
  }
}

export function getBroker() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers`,
    method: 'GET'
  }
}

export function getLocations(brokerId) {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers/locations/${brokerId}`,
    method: 'GET'
  }
}

export function unassignCode(brokerId) {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers/locations/${brokerId}`,
    method: 'DELETE'
  }
}


export function getTypes() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/brokers/types`,
    method: 'GET'
  }
}