export function getSupplier() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/client`,
    method: 'GET'
  }
}

export function createSupplier() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/client`,
    method: 'post'
  }
}

export function updateSupplier() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/edit`,
    method: 'PUT'
  }
}