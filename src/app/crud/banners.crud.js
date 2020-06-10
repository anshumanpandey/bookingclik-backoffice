export function getLocations() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/banner-meta/get`,
    method: 'GET'
  }
}

export function getBuyedBanner() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/banner/get`,
    method: 'GET'
  }
}

export function postBannerRecip() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/banners-payment`,
    method: 'POST'
  }
}

