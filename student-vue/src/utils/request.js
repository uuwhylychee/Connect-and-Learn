import axios from "axios";
import { message } from "ant-design-vue"
const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL

console.log("apiUrl",apiUrl)
// 创建axios实例
const request = axios.create({
  baseURL: "/api/", // api的base_url
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，可以在这里设置token
    let token = window.localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = 'bwer ' + token;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("请求出错：", error); // for debug
    Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    /**
     * 对响应数据做点什么
     * 例如，code非20000则判断为错误
     */
    const res = response.data;
    if (res.code !== 200) {
      message.error({
        message: res.message || "Error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    /**
     * 对响应错误做点什么
     */
    console.error("响应出错：", error); // for debug
    message.error(error.response.data.msg);
    return Promise.reject(error);
  }
);

export default request;
