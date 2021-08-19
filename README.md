# YYAPI

基于 **[Axios](https://github.com/axios/axios)** 集约型 API 接口管理模块

## 安装

```sh
yarn add yyapi
# 或者
npm i yyapi
```

## 使用

### 基本使用

```ts
import { createAPI, API, Sender, Method } from 'yyapi'

interface CustomAPI extends API{
  test1: Sender
  test2: Sender<{ id: number }>
}

// 实例化
const api = createAPI<CustomAPI>({
  test1: '接口地址',
  test2: {
    url: '接口地址',
    method: Method.Put
  }
}, {
  headers: {
    token: '1234567890'
  }
}, {
  async onBeforeRequest ({ namespace, url, config }) {
    // 发送请求前回调，可用于注入 headers 参数等功能
    // namespace 命名空间，如 test1、test2
    // url 请求的 <Url> 参数
    // config 请求的参数
    config.headers.token = '0987654321'
    console.log('onBeforeRequest', namespace)
  },
  async onBeforeReturnResponse ({ namespace, url, config, response }) {
    // 请求成功后，还未返回数据前的回调，可用于动态包裹返回数据等功能
    console.log('onBeforeReturnResponse', response.status)
  },
  async onError ({ namespace, url, config, error }) {
    // 请求失败回调，可用于统一接口请求失败上报等功能
    console.log('onerror', error.message)
  }
})

// 请求接口
api.test1() // Promise<any>
api.test2() // Promise<{ id: number }>
```

### 配置项

```js
createAPI(<Urls>, <AxiosRequestConfig?>, <Events?>)
```

* `Urls` 接口数据
* [`AxiosRequestConfig`](https://github.com/axios/axios#request-config)
* `Events` 事件回调

### Data

```ts
import { createAPI, API, Sender } from 'yyapi'

// 定义请求数据类型
interface RequestData {
  id: number
}

// 定义返回数据类型
interface ResponseData {
  name: string
}

interface CustomAPI extends API {
  test: Sender<ResponseData, RequestData>
}

const api = createAPI<CustomAPI>({
  test: '接口地址'
})

// Get 请求会自动转为 url 参数
api.test(<RequestData>) // Promise<ResponseData>
```

### Keys

```ts
import { createAPI, API, Sender } from 'yyapi'

// 定义请求数据类型
interface RequestData {
  id: number
}

// 定义请求配置数据类型
interface RequestConfig {
  keys: {
    id: number
  }
}

// 定义返回数据类型
interface ResponseData {
  name: string
}

interface CustomAPI extends API {
  test: Sender<ResponseData, RequestData, RequestConfig>
}

const api = createAPI<CustomAPI>({
  test: '接口地址/:id'
})

// 配置 keys 自动注入 url 参数
api.test(<RequestData>, <RequestConfig>) // Promise<ResponseData>
```
