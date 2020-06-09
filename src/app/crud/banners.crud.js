export function getLocations() {
  return {
    url: `http://localhost:3010/api/public/locationCodes`,
    method: 'POST'
  }
}
