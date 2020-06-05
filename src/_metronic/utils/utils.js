import { configure } from 'axios-hooks'
//@ts-ignore
import { Crypt, RSA } from 'hybrid-crypto-js';
import { setGlobalAppState } from '../../app/pages/AppState'

export function removeCSSClass(ele, cls) {
  const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
  ele.className = ele.className.replace(reg, " ");
}

export function addCSSClass(ele, cls) {
  ele.classList.add(cls);
}

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;

export function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      if (config.data instanceof FormData) {
        config.data = config.data
      } else {
        config.data = JSON.parse(encrypt(config.data))
      }


      return config;
    }
  );
  axios.interceptors.response.use(
    config => {
      config.data = JSON.parse(decrypt(config.data))
      return config;
    },
    (error) => {
      console.log(error.response)
      if (error.response) {
        error.response.data = JSON.parse(decrypt(error.response.data))
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setGlobalAppState('error', error.response.data.error);
        if (error.response.status === 401) {
          store.dispatch({ type: '[Logout] Action' });
        }
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Something happened in setting up the request that triggered an Error');
        console.log(error.message);
      }
      return Promise.reject(error);
    }
  );
  configure({ cache: false, axios })
}

/*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
export function removeStorage(key) {
  try {
    localStorage.setItem(key, "");
    localStorage.setItem(key + "_expiresIn", "");
  } catch (e) {
    console.log(
      "removeStorage: Error removing key [" +
        key +
        "] from localStorage: " +
        JSON.stringify(e)
    );
    return false;
  }
  return true;
}

/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
export function getStorage(key) {
  const now = Date.now(); //epoch time, lets deal only with integer
  // set expiration for storage
  let expiresIn = localStorage.getItem(key + "_expiresIn");
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0;
  }

  expiresIn = Math.abs(expiresIn);
  if (expiresIn < now) {
    // Expired
    removeStorage(key);
    return null;
  } else {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (e) {
      console.log(
        "getStorage: Error reading key [" +
          key +
          "] from localStorage: " +
          JSON.stringify(e)
      );
      return null;
    }
  }
}
/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */
export function setStorage(key, value, expires) {
  if (expires === undefined || expires === null) {
    expires = 24 * 60 * 60; // default: seconds for 1 day
  }

  const now = Date.now(); //millisecs since epoch time, lets deal only with integer
  const schedule = now + expires * 1000;
  try {
    localStorage.setItem(key, value);
    localStorage.setItem(key + "_expiresIn", schedule);
  } catch (e) {
    console.log(
      "setStorage: Error setting key [" +
        key +
        "] in localStorage: " +
        JSON.stringify(e)
    );
    return false;
  }
  return true;
}

var crypt = new Crypt();
var rsa = new RSA();

// Increase amount of entropy
var entropy = 'Random string, integer or float';
var crypt = new Crypt({ entropy: entropy });
var rsa = new RSA({ entropy: entropy });

// Select default message digest
var crypt = new Crypt({ md: 'sha512' });

export function encrypt(message) {
    // Encryption with one public RSA key
    var encrypted = crypt.encrypt(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCw/7mJzszlPo3TY4x4Lz5FSCpX
Cr8jkdkceaZnspBU3/LtpLTooCXJ2iTL3wtjFYtEU9HFZFDiVU/JDcyMMH0imroD
V2rAhGpcKTv7bGsjklfNnE0sMJxXFzd0C1NhqrwxJxjSlcPGaG4y0Jyyej67I+J7
UABUVoiLxw+86WqfqwIDAQAB
-----END PUBLIC KEY-----`, JSON.stringify(message));

return encrypted
}

export function decrypt(encrypted) {
    // Decrypt encryped message with private RSA key
    var decrypted = crypt.decrypt(`-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCw/7mJzszlPo3TY4x4Lz5FSCpXCr8jkdkceaZnspBU3/LtpLTo
oCXJ2iTL3wtjFYtEU9HFZFDiVU/JDcyMMH0imroDV2rAhGpcKTv7bGsjklfNnE0s
MJxXFzd0C1NhqrwxJxjSlcPGaG4y0Jyyej67I+J7UABUVoiLxw+86WqfqwIDAQAB
AoGAdAhAxpG2irY2XZTOGl/GL77+Wq9l3FiZfuxU5XgO3EUvyRCHtFSAUVJbevcO
TPdro/Ba/U8lIysQMdqE9IY5EWV/yGiqfFOvTbd8Zw98T2zdONLluErnrztGVCb0
DYBVfHAx302qNuasWoYkOfP3iaU2dJHFtMRCqlCT7qe9hgkCQQDljvqKYQqTdJmn
eizZZFNhMU0IkhfqijK9OXx3WyHfbQmVWP/32857/Az+PYkTaNWjD2eJvx2TFu0R
qP3/oosVAkEAxWLqMd7I7irogx1q2gJnhyKklxmhHqeed7dcZWbkW17nkFRNcEWf
Yp2aTcUqrPo494+uPoWUcevjJ11GsCwvvwJAFAO9UGdZlrWp1/JNCr82jdjQkJi8
QRS/i8QBWB63+1T0avMRjji57hFxyJDw7KJNTiQ/sMDbAUIUdV+4lZtEaQJAF8dF
vUJAZGio3/qwP5kgjaf/ufAtd7rrnTJqoBCYG+W/8aQmPAs3GzMvPoUtEe+G41Pc
ws1mx56KG9jhxiFckwJBANVRl7tDftHRAbj0GQNiFNpDBy4xsdez7T6JmKGr+ALg
DvMOJMpj2+B6Fevy7AQq0Ee9OZvy68w5mpCrMwzx+rg=
-----END RSA PRIVATE KEY-----`, JSON.stringify(encrypted));
return decrypted.message
}
