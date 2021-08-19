import {
  Url,
  RequestConfig,
  Sender,
  Events
} from './types'
import axios, { AxiosRequestConfig } from 'axios'
import { compile } from 'path-to-regexp'
import URL from 'url-parse'

export function createSender (namespace: string, url: Url, config: AxiosRequestConfig, events: Events): Sender {
  async function sender ($data?: any | undefined, $config: RequestConfig = {}): Promise<any> {
    // 注入 url
    if (typeof url === 'string') {
      $config.url ?? ($config.url = url)
    } else {
      $config.url ?? ($config.url = url.url)
      $config.method ?? ($config.method = url.method)
    }

    // 合并基本 config
    $config = Object.assign(config, $config)

    if ($config.url === undefined) throw new Error(`API-${namespace}, url undefined`)

    // keys
    if ($config.keys !== undefined) {
      if ($config.url.startsWith('http')) {
        const { origin, pathname } = new URL($config.url)
        $config.url = `${origin}${compile(pathname)($config.keys)}`
      } else {
        $config.url = compile($config.url)($config.keys)
      }
    }

    // 注入 data
    if ($data !== undefined) {
      if ($config.method === 'GET') {
        $config.params = $data
      } else {
        $config.data = $data
      }
    }

    try {
      // onBeforeRequest
      if (events.onBeforeRequest !== undefined) {
        await events.onBeforeRequest(namespace, url, $config)
      }

      const response = await axios($config)

      // onBeforeReturnResponse
      if (events.onBeforeReturnResponse !== undefined) {
        await events.onBeforeReturnResponse(namespace, url, $config, response)
      }

      return response.data
    } catch (error) {
      // onErrror
      if (error.isAxiosError === true && events.onError !== undefined) {
        await events.onError(namespace, url, $config, error)
      }
      throw error
    }
  }

  return sender
}
