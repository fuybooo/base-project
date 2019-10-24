import {State} from '@/stores/states'
import {Menu} from '@/components/common-menu/menu.model'
import {dic, toggleLangSetting, setMenus} from '@/stores/mutation-types'

export default {
  [toggleLangSetting] (state: State, setting: boolean) {
    state.showLangSetting = setting
  },
  [setMenus] (state: State, menus: Menu[]) {
    state.menus = menus
  },
  [dic] (state: State, dicObj: any) {
    // @ts-ignore
    state.dic[dicObj.dicType] = dicObj.list
  },
}
