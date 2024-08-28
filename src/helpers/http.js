import axios from "axios";
import HOSTS from "../enviroments.js";
const TOKEN = localStorage.getItem("token");

let config = {
  baseURL: HOSTS.API,
};

const Connection = axios.create(config);

const authInterceptor = (config) => {
  config.headers = {
    Authorization: TOKEN,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
  return config;
};

const loggerInterceptor = (config) => {
  return config;
};

Connection.interceptors.request.use(authInterceptor);
Connection.interceptors.request.use(loggerInterceptor);

Connection.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Connection;
