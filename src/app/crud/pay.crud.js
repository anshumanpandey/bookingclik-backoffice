export function reportPayment() {
    return {
      url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/paypal-transaction-complete`,
      method: 'POST'
    }
}
  
export function getPayments() {
    return {
      url: `${process.env.REACT_APP_BACKEND_URL ?  process.env.REACT_APP_BACKEND_URL : window.location.origin}/paypal-transactions`,
      method: 'GET'
    }
  }
  