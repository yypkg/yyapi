# YYAPI

基于 [Axios](https://github.com/axios/axios) 的集中形接口管理模块

## 安装

```sh
yarn add yyapi
# 或者
npm add yyapi
```

## 使用

### 基本使用

```js
import { createAPI } from 'yyapi'

// 实例化
const api = createAPI({
  test: '接口地址'
})

// 请求接口
await api.test()
```

### 配置项

```js
createAPI(<Urls>, <AxiosRequestConfig>, <Events>)
```

* [`Urls` 接口数据]()
* [`AxiosRequestConfig`](https://github.com/axios/axios#request-config)
* [`Events` 事件回调]()

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
