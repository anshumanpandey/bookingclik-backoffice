import axios from "axios";


export function getFields() {
  return `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/availableFields`;
}

export function postFields() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/parserConfig`,
    method: 'POST',
  }
}

export function getTransactions() {
  return axios({
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/paypal-transactions`,
    method: 'GET',
  })
    .then(r => r.data)
}

export function postTransaction(id) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/paypal-transaction-complete`,
    data: { orderId: id }
  })
    .then(r => r.data)
}

export function postLogo(id) {
  return {
    method: 'POST',
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/upload_logo`,
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
}