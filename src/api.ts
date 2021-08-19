import {
  Urls,
  API,
  Options,
  Events
} from './types'
import { createSender } from './sender'

export function createAPI<T extends API> (
  urls: Urls<T>,
  options: Options | null,
  events: Events | null
): T {
  const api = Object()

  for (const k in urls) {
    const url = urls[k]
    api[k] = createSender(k, url, options ?? {}, events ?? {})
  }

  return api
}
