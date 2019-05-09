import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'

const httpMultipart = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

/**
 * 请求拦截
 */
httpMultipart.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
httpMultipart.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
httpMultipart.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
httpMultipart.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default httpMultipart
