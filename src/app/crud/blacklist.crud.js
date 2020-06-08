export function getBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/blacklisted`,
    method: 'GET'
  }
}

export function createBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/blacklisted/post`,
    method: 'POST'
  }
}

export function editBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/blacklisted/put`,
    method: 'PUT'
  }
}

export function deleteBlacklistedCompanies() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/blacklisted/delete`,
    method: 'DELETE'
  }
}