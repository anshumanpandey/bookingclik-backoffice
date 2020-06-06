export function putClient() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client`,
    method: 'PUT'
  }
}

export function getClients() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/clients`,
    method: 'GET'
  }
}

export function postRolesForClient() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/roles`,
    method: 'POST'
  }
}

export function updateSupplier() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/edit`,
    method: 'PUT'
  }
}

export function getBranches(clientId) {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/branch/${clientId}`,
    method: 'GET'
  }
}

export function postBranch(clientId) {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/branch/${clientId}`,
    method: 'POST'
  }
}