# YYAPI

基于 **[Axios](https://github.com/axios/axios)** 的集中形接口管理模块

## 安装

```sh
yarn add yyapi
# 或者
npm i yyapi
```

## 使用

### 基本使用

```ts
import { createAPI, Sender, Method } from 'yyapi'

interface API {
  [key: string]: Sender
  test1: Sender<{ id: number }>
  test2: Sender
}

// 实例化
const api = createAPI<API>({
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
  async onBeforeRequest (namespace, url, options) {
    // 发送请求前回调，可用于注入 headers 参数等功能
    // namespace 命名空间，如 test1、test2
    // url 请求的 url 地址
    // options 所有请求的参数
  },
  async onBeforeReturnResponse (namespace, url, options) {
    // 请求成功后，还未返回数据前的回调，可用于动态包裹返回数据等功能
  },
  async onError (namespace, url, options, error) {
    // 请求失败回调，可用于统一接口请求失败上报等功能
  }
})

// 请求接口
const data = await api.test1()
console.log(data.id)
```

### 配置项

```js
createAPI(<Urls>, <AxiosRequestConfig>, <Events>)
```

* `Urls` 接口数据
* [`AxiosRequestConfig`](https://github.com/axios/axios#request-config)
* `Events` 事件回调

### Data

```js
import { createAPI } from 'yyapi'

const api = createAPI({
  test: '接口地址'
})

const data = { id: 1 }

// Get 请求会自动转为 url 参数
await api.test(data)
```

### RESTful

```js
import { createAPI } from 'yyapi'

const api = createAPI({
  test: '接口地址'
})

await api.test.get()
await api.test.post()
await api.test.put()
await api.test.patch()
await api.test.delete()
```

### Keys

```js
import { createAPI } from 'yyapi'

const api = createAPI({
  test: '接口地址/:id'
})

// 配置 keys 自动注入 url 参数
await api.test(null, { keys: { id: 1 } })
```
