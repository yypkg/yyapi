import { AxiosRequestConfig } from 'axios'

import {
  Urls,
  API,
  Events,
  Sender
} from './types'
import { createSender } from './sender'

export function createAPI<T = API> (
  urls: Urls<T>,
  config?: AxiosRequestConfig,
  events?: Events
): T extends API ? T : { [K in keyof typeof urls]: Sender } {
  const api = Object()

  for (const k in urls) {
    const url = urls[k]
    api[k] = createSender(k, url, config ?? {}, events ?? {})
  }

  return api
}
