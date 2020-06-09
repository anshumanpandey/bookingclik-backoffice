export function getVisitors() {
    return {
      url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/visitor/get`,
      method: 'GET'
    }
}
  