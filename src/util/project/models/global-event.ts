import Vue from 'vue'
const vue = new Vue()
// 全局事件处理器
Vue.prototype.$globalEvent = vue
interface GlobalEvent {
  researchMenu: string
}
export default GlobalEvent
Vue.prototype.$event = {
  researchMenu: 'researchMenu',
}
