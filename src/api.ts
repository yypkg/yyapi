import { AxiosRequestConfig } from 'axios'

import {
  Urls,
  API,
  Events
} from './types'
import { createSender } from './sender'

export function createAPI<T extends API> (
  urls: Urls<T>,
  config?: AxiosRequestConfig,
  events?: Events
): T {
  const api = Object()

  for (const k in urls) {
    const url = urls[k]
    api[k] = createSender(k, url, config ?? {}, events ?? {})
  }

  return api
}
