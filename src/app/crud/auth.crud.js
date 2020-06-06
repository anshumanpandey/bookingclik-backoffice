import axios from "axios";

const normalAxios = axios.create()

export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/login`,
    { clientname: email, password });
}

export function register(body) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/register`,
    body);
}

export function requestPassword(email) {
  return normalAxios.post(
    `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/public/forgot`,
    { email });
}

export function instagramLogin() {
  const clientID = '1133493423650865'
  const scopes = ['user_profile', 'user_media']

  window.open(`https://api.instagram.com/oauth/authorize?client_id=${clientID}&redirect_uri=${process.env.REACT_APP_BACKEND_URL}/instagram&scope=${scopes.join(',')}&response_type=code`, "_blank", "height=400, width=550, status=yes, toolbar=no, menubar=no, location=no,addressbar=no")
}

export function facebookLogin(d){
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_BACKEND_URL}/facebook`,
    data: d._profile
  })
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(`${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client`);
}

export function getUserByTokenForHook() {
  return `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/client`
}

export function getProfile() {
  return `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/profile`
}
