export function getResources() {
    return {
      url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/super/resources`,
      method: 'GET'
    }
}