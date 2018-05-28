import axios from 'axios'
import store from '../store'

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000/v1/';
const http = axios.create({ baseURL: baseURL });
http.interceptors.request.use(
  config => {
    config.headers.authorization = localStorage.getItem("token");
    return config;
  },
  error => Promise.reject(error)
);

http.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  try {
    if (403 === error.response.status) {
      store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        alert('登入已逾時')
      })
    } else {
        return Promise.reject(error);
    }
  } catch(e) {
    return Promise.reject(error);
  }
  
});

export default http
