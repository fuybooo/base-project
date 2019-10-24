import {Menu} from '@/components/common-menu/menu.model'
import {DicType} from '@/model/project/dic/dic'

export interface State {
  showLangSetting: boolean
  menus: Menu[]
  dic: DicType
}

export default {
  showLangSetting: true, // 是否显示语言选择器
  menus: [],
  dic: {},
}
