export function getBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/blacklist`,
    method: 'GET'
  }
}

export function createBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/blacklist`,
    method: 'POST'
  }
}

export function editBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/blacklist`,
    method: 'PUT'
  }
}

export function deleteBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/blacklist`,
    method: 'DELETE'
  }
}