import Vue from 'vue'
import axios, {AxiosInstance} from 'axios'
import config from '@/config/base-config'
import {IUrl, staticPath, urlType} from '@/util/project/urls/url-util'
import {dc, deepTrim, gc} from '@/util/common/fns/fns'
import {debugReq} from '@/config/dev-config'
import {KEY_TOKEN} from '@/model/project/local-storage-keys/keys'
import {isDev, isProd} from '@shared/env'
// 原始axios
axios.interceptors.response.use((res) => {
  return res.data
})

function create (options?: any): AxiosInstance {
  const localAxios = axios.create({
    ...(options || {}),
    baseURL: config.baseURL,
    withCredentials: true,
  })
  localAxios.interceptors.request.use((req) => {
    // 添加处理入参的代码
    // 针对不同的接口使用不同的环境
    if (isDev()) {
      debugReq(req)
    }
    const token = gc(KEY_TOKEN)
    if (token) {
      req.headers['x-access-token'] = token
    }
    return req
  })
  localAxios.interceptors.response.use((res) => {
    if (res.data.msg) {
      Vue.prototype.$tip(res.data)
    }
    // 若后端返回未登录的错误，则跳转到登录界面
    if (res.data.head.errCode === 40011) {
      if (isProd()) {
        // 正式环境跳转到登录界面
        dc(KEY_TOKEN)
        window._vueInstance_.$router.push({name: 'login'})
      }
    }
    return res.data
  })
  return localAxios
}

const getSafeUrl = (url: string): string => {
  return url.endsWith('/') ? url : url + '/'
}
const getUrl = (url: urlType): IUrl => {
  let urlConfig: IUrl
  if (typeof url === 'string') {
    urlConfig = {url: getSafeUrl(url), isStatic: false}
  } else if (url.isStatic) {
    urlConfig = {url: (url.staticPath || staticPath) + (url.prefix || '') + url.url + '.json', isStatic: true}
  } else {
    urlConfig = {url: getSafeUrl((url.prefix || '') + url.url), isStatic: false}
  }
  return urlConfig
}
const getAxiosRes = (url: urlType, params: any, fn: () => any) => {
  const urlConfig = getUrl(url)
  if (urlConfig.isStatic) {
    return axios.get(urlConfig.url, params)
  } else {
    return fn()
  }
}
const methods: any = {
  get (url: urlType, params = {}, axiosInstance: AxiosInstance): any {
    return getAxiosRes(url, {params}, () => axiosInstance.get(getUrl(url).url, {params}))
  },
  post (url: urlType, data = {}, axiosInstance: AxiosInstance): any {
    return getAxiosRes(url, {params: data}, () => axiosInstance.post(getUrl(url).url, data))
  },
  put (url: urlType, data = {}, axiosInstance: AxiosInstance): any {
    return getAxiosRes(url, {params: data}, () => axiosInstance.put(getUrl(url).url, data))
  },
  delete (url: urlType, data = {}, axiosInstance: AxiosInstance): any {
    return getAxiosRes(url, {params: data}, () => axiosInstance.delete(getUrl(url).url, data))
  },
}
const defAxios = create()
const request = (url: urlType, data = {}, method = 'post', axiosInstance = defAxios) => {
  return methods[method](url, deepTrim(data, true), axiosInstance)
}
export default {
  request,
  create,
}
// 在vue原型上挂载常用函数
Vue.prototype.$req = request
