import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import Request from './request'
import type { RequestConfig } from './request/types'

// 重写返回类型
interface HttpRequestConfig<T, R> extends RequestConfig<R> {
  data?: T
  method: Method
}
const request = new Request({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 60 * 5,
  // withCredentials: true,
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config: AxiosRequestConfig) => {
      return config
    },
    // 响应拦截器
    responseInterceptors: (result: AxiosResponse) => {
      return result
    },
    responseInterceptorsCatch: (error) => {
      // eslint-disable-next-line no-unused-expressions
      error.response
      return Promise.reject(new Error(error.response.data))
    },
  },
})

/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {HttpRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
function HttpRequest<D = any, T = any>(config: HttpRequestConfig<D, T>) {
  const { method = 'GET' } = config
  if (method === 'get' || method === 'GET')
    config.params = config.data

  return request.request<T>(config)
}
// 取消请求
export function cancelRequest(url: string | string[]) {
  return request.cancelRequest(url)
}
// 取消全部请求
export function cancelAllRequest() {
  return request.cancelAllRequest()
}

export default HttpRequest
