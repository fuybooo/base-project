import Vue from 'vue'
import {Menu} from '@/components/common-menu/menu.model'
import './BaseMenu.less'

// @ts-ignore
export default Vue.component('baseMenuComponent', {
  functional: true, // 使用函数式组件可以解决返回多个子元素的问题
  render (createElement, {props}) { // 使用函数式组件时只能在第二个参数中去取menus而不能在this中取
    const max = 11
    let menus = props.menus as Menu[]
    if (menus.length > max) {
      menus = menus.slice(0, max).concat([{
        index: (props.parent ? (props.parent.idnex + '-') : '') + 'more',
        title: '更多',
        children: menus.slice(max),
      }])
    }
    return menus.map((menu: Menu) => {
      if (menu.children) {
        return createElement('el-submenu', {
          props: {
            index: menu.index,
          },
        }, [
          createElement('template', {slot: 'title'}, menu.title),
          createElement('base-menu', {props: {menus: menu.children, parent: menu}}),
        ])
      } else {
        return createElement('el-menu-item', {props: {index: menu.index}}, menu.title)
      }
    })
  },
  props: {
    menus: {
      type: Array,
      required: true,
    },
    parent: {
      type: Object,
    },
  },
})
