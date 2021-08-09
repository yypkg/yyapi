import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export const enum Method {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete'
}

export type Url = string | {
  /**
   * 接口地址
   */
  url: string
  /**
   * 默认请求方式
   */
  method: Method
}

export interface Urls {
  [key: string]: Url
}

export interface ExtendOptions {
  /**
   * 设置 url 参数键对值，例如 /url/:id 可设置 keys = { id: 值 }
   */
  keys?: {
    [key: string]: any
  }
}

export type Options = AxiosRequestConfig

export interface Sender {
  <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined): Promise<T>
  get: <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined) => Promise<T>
  post: <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined) => Promise<T>
  put: <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined) => Promise<T>
  patch: <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined) => Promise<T>
  delete: <T extends any>(data?: any | undefined, options?: Options & ExtendOptions | undefined) => Promise<T>
}

export interface Events {
  /**
   * 发送请求前回调，可用于注入 headers 参数等功能
   */
  onBeforeRequest?: (namespace: string, url: Url, options: Options & ExtendOptions) => Promise<void>
  /**
   * 请求成功后，还未返回数据前的回调，可用于动态包裹返回数据等功能
   */
  onBeforeReturnResponse?: (namespace: string, url: Url, options: Options & ExtendOptions, response: AxiosResponse) => Promise<void>
  /**
   * 请求失败回调，可用于统一接口请求失败上报等功能
   */
  onError?: (namespace: string, url: Url, options: Options & ExtendOptions, error: AxiosError) => void
}
