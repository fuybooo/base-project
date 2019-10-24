import {lg} from '@/util/common/fns/fns'
import {KEY_API} from '@/model/project/local-storage-keys/keys'
import {isDev} from '@shared/env'

// 可以在这里切换调试的服务器【这里是整体切换，相对而言 dev-config中是局部切换】
// const baseURL = 'http://99.99.99.99:9999/' // 尚医至信测试环境
let baseURL = 'http://localhost:3002/api' // nodejs 环境
if (isDev()) {
  baseURL = 'http://localhost:3002/api'
} else {
  baseURL = '/api'
}
const baseWs = 'ws://localhost:3002/'
// window的最小高度
const MIN_WIN_HEIGHT = 450
export default {
  /**
   * 这里的配置可以使得在不方便改代码进行调试时，可以在浏览器控制台输入相应的代码进行路径的切换
   * 例如 localStorage.setItem('FUYBOOO_API', 'http://99.99.99.99:9999/')
   * 表示，所有所有请求都将被发送到 http://99.99.99.99:9999/ 上
   */
  baseURL: lg(KEY_API) || baseURL,
  MIN_WIN_HEIGHT,
  baseWs,
}
