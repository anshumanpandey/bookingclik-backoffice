
export function getParams() {
  return `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/availableUrlParams`;
}


export function postParams() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/urlParams`,
    method: 'POST',
  }
}

export function getRequestConfig() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/requestConfig`,
    method: 'GET',
  }
}

export function postRequestConfig() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/requestConfig`,
    method: 'POST',
  }
}