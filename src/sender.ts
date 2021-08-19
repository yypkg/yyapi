import {
  Url,
  Options,
  ExtendOptions,
  Sender,
  Events
} from './types'
import axios from 'axios'
import { compile } from 'path-to-regexp'
import URL from 'url-parse'

export function createSender (namespace: string, url: Url, options: Options, events: Events): Sender {
  async function sender <T extends any> ($data?: any | undefined, $options: Options & ExtendOptions = {}): Promise<T> {
    // 注入 url
    if (typeof url === 'string') {
      $options.url ?? ($options.url = url)
    } else {
      $options.url ?? ($options.url = url.url)
      $options.method ?? ($options.method = url.method)
    }

    // 合并基本 options
    $options = Object.assign(options, $options)

    if ($options.url === undefined) throw new Error(`API-${namespace}, url undefined`)

    // keys
    if ($options.keys !== undefined) {
      if ($options.url.startsWith('http')) {
        const { origin, pathname } = new URL($options.url)
        $options.url = `${origin}${compile(pathname)($options.keys)}`
      } else {
        $options.url = compile($options.url)($options.keys)
      }
    }

    // 注入 data
    if ($data !== undefined) {
      if ($options.method === 'GET') {
        $options.params = $data
      } else {
        $options.data = $data
      }
    }

    try {
      // onBeforeRequest
      if (events.onBeforeRequest !== undefined) {
        await events.onBeforeRequest(namespace, url, $options)
      }

      const response = await axios($options)

      // onBeforeReturnResponse
      if (events.onBeforeReturnResponse !== undefined) {
        await events.onBeforeReturnResponse(namespace, url, $options, response)
      }

      return response.data
    } catch (error) {
      // onErrror
      if (error.isAxiosError === true && events.onError !== undefined) {
        await events.onError(namespace, url, $options, error)
      }
      throw error
    }
  }

  return sender
}
