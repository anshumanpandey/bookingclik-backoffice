export function getLocations() {
  return {
    url: `https://www.grcgds.com/admincarrental/api/public/locationCodes`,
    method: 'POST'
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

