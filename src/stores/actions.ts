import Vue from 'vue'
import {dic} from '@/stores/action-types'
import {dic as mutationDic} from '@/stores/mutation-types'
import {Commit} from 'vuex'
import {State} from '@/stores/states'

export default {
  async [dic] ({commit, state}: {commit: Commit, state: State}, dicType: string) {
    if (!state.dic.SYS_USER_TYPE) {
      const res = await Vue.prototype.$req(Vue.prototype.$urls.dictionary.listType, {type: dicType})
      commit(mutationDic, {dicType, list: res.data.results})
    }
  },
}
