import { createAPI, Sender, Method, API } from './index'

interface User {
  id: number
}

interface CustomAPI extends API {
  [key: string]: Sender
  test1: Sender<User[]>
  test2: Sender
  test3: Sender<User, { name: string }, { keys: { id: number } }>
}

const api = createAPI<CustomAPI>({
  /**
   * 测试地址 1
   */
  test1: 'https://yapi.joyyued.com/mock/114/user/all',
  test2: {
    url: 'https://google.com',
    method: Method.Delete
  },
  test3: {
    url: 'https://yapi.joyyued.com/mock/114/checklist/detail/:id',
    method: Method.Get
  }
}, {
  headers: {
    token: '1234567890'
  }
}, {
  async onBeforeRequest (namespace, url, config) {
    console.log('beforeRequest', config.url)
  },
  async onBeforeReturnResponse (namespace, url, config) {
    console.log('onBeforeReturnResponse', namespace, config)
  },
  async onError (namespace, url, config, error) {
    console.log('onerror', namespace, config, error.message)
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
  const data = await api.test3({ name: 'xxx' }, { keys: { id: 12 } })
  console.log(data)
}

Promise.all([
  // testcase1()
  // testcase2()
  testcase3()
]).catch(error => console.error(error))
