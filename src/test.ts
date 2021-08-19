import { Method, Sender } from 'types'
import { createAPI } from './index'

interface User {
  id: number
}

interface API {
  [key: string]: Sender
  test1: Sender<User[]>
  test2: Sender
  test3: Sender
}

const api = createAPI<API>({
  /**
   * 测试地址 1
   */
  test1: 'https://yapi.joyyued.com/mock/114/user/all',
  test2: {
    url: 'https://google.com',
    method: Method.Delete
  },
  test3: 'https://yapi.joyyued.com/mock/114/checklist/detail/:id'
}, {
  headers: {
    token: null
  }
}, {
  async onBeforeRequest (namespace, url, options) {
    console.log('beforeRequest', options.url)
  },
  async onBeforeReturnResponse (namespace, url, options) {
    console.log('onBeforeReturnResponse', namespace, options)
  },
  async onError (namespace, url, options, error) {
    console.log('onerror', namespace, options, error.message)
  }
})

/// 成功返回
const testcase1 = async (): Promise<void> => {
  const data = await api.test1()
  console.log(data)
}

/// 请求失败
const testcase2 = async (): Promise<void> => {
  try {
    console.log(await api.test2())
  } catch (error) {
    console.log('biz', error)
  }
}

/// keys
const testcase3 = async (): Promise<void> => {
  const data = await api.test3(null, { keys: { id: 12 } })
  console.log(data)
}

Promise.all([
  // testcase1()
  // testcase2()
  testcase3()
]).catch(error => console.error(error))
