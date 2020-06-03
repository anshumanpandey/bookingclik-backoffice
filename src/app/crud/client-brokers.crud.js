export function postAssign() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/assign`,
    method: 'POST'
  }
}

export function getBrokers() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers`,
    method: 'GET'
  }
}

export function getAssignedBrokers() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/assigned`,
    method: 'GET'
  }
}

export function unAssignBroker() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/assigned`,
    method: 'DELETE'
  }
}

export function getTypes() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/types`,
    method: 'GET'
  }
}

export function getClientLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/locations`,
    method: 'GET'
  }
}

export function saveLocationConfig() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client/brokers/locations/config`,
    method: 'POST'
  }
}

