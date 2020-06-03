
export function postCategories() {
  return {
    method: 'POST',
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/categories`,
  }
}

export function postValues(category_id) {
  return {
    method: 'POST',
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/values/${category_id}`,
  }
}

export function getCategories(offering) {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/categories/${offering}`,
  }
}

export function getFields() {
  return {
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/categories/fields`,
  }
}

export function deleteCategory() {
  return {
    method: 'DELETE',
    url: `${process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : window.location.origin}/categories`,
  }
}
