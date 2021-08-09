import {
  Urls,
  Options,
  Sender,
  Events
} from './types'
import { createSender } from './sender'

export function createAPI<U extends Urls> (
  urls: U,
  options: Options | null,
  events: Events | null
): { [K in keyof U]: Sender } {
  const api = Object()

  for (const k of Object.keys(urls)) {
    const url = urls[k]
    api[k] = createSender(k, url, options ?? {}, events ?? {})
  }

  return api
}
