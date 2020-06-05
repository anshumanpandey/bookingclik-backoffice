export function updateUser() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/users`,
    method: 'POST'
  }
}

export function getUsers() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/users`,
    method: 'GET'
  }
}
