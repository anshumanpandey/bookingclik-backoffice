export function getAbout() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/about/get`,
    method: 'GET'
  }
}

export function editAbout() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/about/edit`,
    method: 'PUT'
  }
}