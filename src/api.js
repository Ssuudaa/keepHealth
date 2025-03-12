import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,  // 后端地址
  timeout: 5000  // 请求超时
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');  // 获取存储的 Token
  if (token) {
    config.headers['Authorization'] = `${token}`;  // 设置 Authorization 请求头
  }
  // console.log('请求发送:', config);  // 可以打印请求信息
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
api.interceptors.response.use(response => {
  return response.data;  // 直接返回数据，简化后续处理
}, error => {
  // console.error('请求错误:', error);

  // 如果 Token 过期或认证失败，处理 401 错误
  if (error.response && error.response.status === 401) {
    console.log('Token 过期或认证失败');
    localStorage.removeItem('jwt_token');  // 清除过期的 Token
    window.location.href = '/login';  // 跳转到登录页面
  }

  return Promise.reject(error);
});

export default api;
