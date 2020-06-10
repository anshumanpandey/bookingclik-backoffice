export function getBannersOnDb() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/banner-meta/get`,
    method: 'GET'
  }
}

export function updateBannerMetadata() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/banner-meta/save`,
    method: 'PUT'
  }
}

