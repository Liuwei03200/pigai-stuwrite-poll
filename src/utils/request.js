import axios from 'axios'
// import { Message } from 'element-ui'
import QS from 'qs';

// create an axios instance
// let baseurl;
// if(window.location.hostname == 'localhost'){
//   baseurl = '/api'
// }else{
//   baseurl = ''
// }

const service = axios.create({
	headers: {'Content-Type':'application/x-www-form-urlencoded'},
	// baseURL: baseurl,
    timeout: 30000 // request timeout
})
service.defaults.withCredentials =true;
// service.baseURL=baseurl;

// 添加请求拦截器
service.interceptors.request.use(
  config => {
	config.headers['Content-Type'] = config.headers['Content-Type']? config.headers['Content-Type']: 'application/x-www-form-urlencoded';
    if(config.method === 'post') {
      config.data = QS.stringify( {
        ...config.data  // 将参数变成  a=xx&b=xx&c=xx这样的参数列表
      });
    }else if(config.method === 'json') {
      config.method = 'post'
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
