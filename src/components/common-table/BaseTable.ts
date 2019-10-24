import Vue, {VNodeChildren} from 'vue'
import {Column, ContentType, defaultFilterSplit} from '@/components/common-table/table.model'
import {debounce, deepClone, deepTrim, guid} from '@/util/common/fns/fns'
import {getClientHeight, getSpaceHeight} from '@/util/common/fns/fns-dom'
import {setProperty} from '@/util/common/fns/fns-common'
import './BaseTable.less'
import {HttpRes, UUID_KEY} from '@/model/common/models'
import config from '@/config/base-config'

Vue.component('BaseTable', {
  render (createElement: typeof Vue.prototype.$CreateElement) {
    const defaultNodeAttrs = {
      ref: 'table',
      class: 'base-table',
    }
    const nodeAttrs = {
      ...defaultNodeAttrs,
      ...this.nodeAttrs,
      ref: defaultNodeAttrs.ref, // ref无法被覆盖
      class: (this.nodeAttrs.class || '') + ' ' + defaultNodeAttrs.class, // class 必须保持默认class名
    }
    // getHeight.bind(this)()
    const defaultTableProps = {
      data: [],
      border: true,
      size: 'mini',
      // @ts-ignore
      height: this.localHeight,
    }
    const tableProps = {
      ...defaultTableProps,
      ...this.tableProps,
      // @ts-ignore
      ...(this.remoteData.length === 0 ? {} : {data: this.remoteData}),
      ...mergeTableFunctionProps.bind(this)(),
      // @ts-ignore
      key: guid(),
    }
    const me = this
    return createElement('div', {
      class: 'base-table-wrap',
    }, [createElement('el-table', {
      props: tableProps,
      ...nodeAttrs,
      // todo 暂时只支持覆盖事件，需要改为既支持自定义事件，又支持通用事件，还支持可配置是否完全覆盖的参数
      on: {
        ...getTableEvent.bind(this)(),
      },
      directives: [
        {
          name: 'loading',
          // @ts-ignore
          value: this.loading === '' ? this.innerLoading : this.loading,
        },
      ],
    }, createColumns.bind(this)(createElement)),
      this.isPagination && tableProps.data.length ? createElement('el-pagination', {
        class: 'base-pagination',
        props: {
          pageSizes: [10, 20, 30, 50, 100],
          background: true,
          layout: 'total, sizes, prev, pager, next, jumper',
          // @ts-ignore
          currentPage: this.currentPage,
          // @ts-ignore
          pageSize: this.pageSize,
          // @ts-ignore
          total: this.total,
        },
        on: {
          'current-change' (currentPage: number) {
            // @ts-ignore
            me.currentPage = currentPage
            // @ts-ignore
            me.search()
          },
          'size-change' (pageSize: number) {
            // @ts-ignore
            me.pageSize = pageSize
            // @ts-ignore
            me.search()
          },
        },
      }) : null])
  },
  created () {
    if (this.recordParams) {
      // 根据url页码初始化分页参数
      // @ts-ignore
      const params = JSON.parse(this.$route.query[this.queryKey] || '{}')
      this.currentPage = params.currentPage || 1
      this.pageSize = params.pageSize || 20
      // 给过滤项赋值
      // @ts-ignore
      const filteredPropList = this.columns.filter((col: Column) => col.props && col.props.filters).map((col: Column) => col.filterProp || col.prop)
      filteredPropList.forEach((item: string) => {
        if (params[item] !== undefined) {
          // @ts-ignore
          setProperty(this.columns, item, {props: {filteredValue: params[item].split(',').map(v => v + (this.filterSplit || defaultFilterSplit) + item)}})
          this.$emit('update:columns', this.columns)
        }
      })
      // 给表单赋值
      // @ts-ignore
      this.$emit('update:params', {...this.params, ...params})
      // 展示选中的行
      this.rememberRow = params._rememberRow
      this.rememberRowKey = params._rememberRowKey
    } else {
      this.$emit('update:params', {...this.params, [UUID_KEY]: guid()})
    }
    if (this.autoHeight || this.fixedElements || this.fixedHeight) {
      // 添加监听事件
      window.addEventListener('resize', this.resize)
      this.resize()
    }
  },
  destroyed () {
    // 组件销毁时必须移除监听
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    search: debounce(function (first = false) {
      // @ts-ignore
      const me = this
      if (!(me.beforeList ? me.beforeList() : true)) {
        return
      }
      if (first) {
        me.currentPage = 1
      }
      me.innerLoading = true
      const params = getParams.bind(me)()
      // 更改浏览器参数
      if (me.recordParams) {
        changeRouteParams.bind(me)()
      }
      // 分页 防抖 滚动加载
      me.$req(me.url, params).then((res: HttpRes) => {
        if (res.head.errCode === 0) {
          // 改变remoteData之后会自动执行render
          me.innerLoading = false
          me.remoteData = me.handleResult ? me.handleResult(res.data || res) : res.data[me.resultKey]
          me.total = me.handleTotal ? me.handleTotal(res.data || res) : res.data.total
        }
      })
    }, 300),
    resize () {
      debounce(calcHeight.bind(this), 100)()
    },
  },
  watch: {
    params: {
      handler () {
        this.search(!this.isFirstSearch)
        this.isFirstSearch = !this.isFirstSearch
      },
      deep: true,
    },
  },
  data () {
    return {
      remoteData: [],
      innerLoading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      sortField: '',
      sortOrder: '',
      localHeight: null,
      filterMap: {},
      filterParams: {},
      isFirstSearch: true, // 第一进入页面时根据浏览器地址栏上的分页参数查询，之后改变条件时都会从第页开始查询
      rememberRow: '', // 要记住的行的值
      rememberRowKey: '', // 要记住的行的key
      rememberRowStatus: true, // 初次为true，点击行之后变为false
      key: guid(),
    }
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    url: {
      type: [Object, String],
    },
    params: {
      type: Object,
      default () {
        return {}
      },
    },
    loading: {
      type: [Boolean, String],
      default: '',
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    autoSearch: {
      type: Boolean,
      default: true,
    },
    // 自动计算表格高度
    autoHeight: {
      type: Boolean,
      default: true,
    },
    // 自动计算表格高度时需要排除的元素
    fixedElements: {
      type: String,
      default: '',
    },
    // 自动计算高度时需要排除的高度
    fixedHeight: {
      type: Number,
      default: 0,
    },
    recordParams: {
      type: Boolean,
      default: true,
    },
    // 是否记录行，点击详情离开界面之后，返回来时能够记住离开时点击的行
    recordRow: {
      type: Boolean,
      default: true,
    },
    queryKey: {
      type: String,
      default: 'q',
    },
    // 用于配置该表格的过滤器分割符（仅在极特殊时配置）
    filterSplit: {
      type: String,
      default: defaultFilterSplit,
    },
    resultKey: {
      type: String,
      default: 'results',
    },
    nodeAttrs: {
      type: Object,
      default () {
        return {}
      },
    },
    tableProps: {
      type: Object,
      default () {
        return {}
      },
    },
    // 当后端返回的数据需要前端进行处理时，可以使用该函数
    handleResult: Function,
    handleTotal: Function,
    // 查询之前可以根据该函数进行拦截处理
    beforeList: Function,
  },
})

function createColumns (createElement: typeof Vue.prototype.$CreateElement): VNodeChildren {
  // @ts-ignore
  const me = this
  let columns: VNodeChildren
  columns = me.columns.map((col: Column) => {
    if (col.content) {
      return createElement('el-table-column', {
        props: getColumnProps.bind(me)(col),
        scopedSlots: {
          // @ts-ignore
          default: (props: any) => createElement('span', getContent.bind(me)(createElement, col, props)),
          // @ts-ignore
          ...(col.headerSlot ? {header: (props: any) => createElement('span', me.$scopedSlots[col.headerSlot]({...props}))} : {}),
        },
      })
    } else if (col.headerSlot || col.contentSlot) {
      return createElement('el-table-column', {
        props: getColumnProps.bind(me)(col),
        scopedSlots: {
          // @ts-ignore
          ...(col.contentSlot ? {default: (props: any) => createElement('span', me.$scopedSlots[col.contentSlot]({...props}))} : {}),
          // @ts-ignore
          ...(col.headerSlot ? {header: (props: any) => createElement('span', me.$scopedSlots[col.headerSlot]({...props}))} : {}),
        },
      })
    } else if (col.prop) {
      if (col.props && col.props.type === 'expand') {
        return createElement('el-table-column', {
          props: getColumnProps.bind(me)(col),
          scopedSlots: {
            default: (props: any) => createElement('div', me.$scopedSlots.expand({...props})),
          },
        })
      }
      return createElement('el-table-column', {
        props: getColumnProps.bind(me)(col),
      })
    }
  })
  return columns
}

function getColumnProps (col: Column) {
  const defaultColumnProps = {
    prop: col.prop,
    label: col.label,
  }
  return {
    ...defaultColumnProps,
    ...(col.props || {}),
  }
}

// el-table绑定的事件
function getTableEvent () {
  // @ts-ignore
  const me = this
  const onEvent = (me.nodeAttrs || {}).on || {}
  return {
    'row-click' () {
      me.rememberRowStatus = false
      // tslint:disable-next-line:no-unused-expression
      onEvent['row-click'] && onEvent['row-click']()
    },
    'sort-change' () {
      // todo 若排序需要支持同时按多个字段排序则需要增加逻辑
      const {prop, order} = arguments[0]
      me.sortField = prop
      me.sortOrder = order
      me.search(true)
      // tslint:disable-next-line:no-unused-expression
      onEvent['sort-change'] && onEvent['sort-change']()
    },
    'filter-change' () {
      // @ts-ignore
      const filterKey: string = Object.keys(arguments[0])[0]
      // @ts-ignore
      const filterValueList: string[] = Object.values(arguments[0])[0]
      if (filterValueList.length) {
        me.filterMap[filterKey] = {
          prop: filterValueList[0].split(me.filterSplit)[1],
          value: filterValueList.map(item => item.split(me.filterSplit)[0]),
        }
      } else {
        me.filterMap[filterKey] = {
          prop: '',
          value: [],
        }
      }
      me.filterParams = {}
      Object.keys(me.filterMap).forEach(key => {
        if (me.filterMap[key].prop) {
          me.filterParams[me.filterMap[key].prop] = me.filterMap[key].value.join()
        }
      })
      me.search(true)
      // tslint:disable-next-line:no-unused-expression
      onEvent['filter-change'] && onEvent['filter-change']()
    },
  }
}

// 表格高度
function getHeight () {
  // @ts-ignore
  const me = this
  // if (me.autoHeight || me.fixedElements || me.fixedHeight) {
  //   // 计算表格高度
  //   calcHeight.bind(me)()
  //   return me.localHeight
  // } else {
  //   return null
  // }
  if (me.autoHeight || me.fixedElements || me.fixedHeight) {
    // 计算表格高度
    calcHeight.bind(me)()
  } else {
    me.localHeight = null
  }
}

// 表格高度
function calcHeight () {
  // @ts-ignore
  const me = this
  const headerHeight = getClientHeight('#main-header')
  const paginationHeight = me.isPagination && ({
    data: [],
    ...me.tableProps,
    ...(me.remoteData.length === 0 ? {} : {data: me.remoteData}),
  }).data.length ? 32 : 0
  const wrapperHeight = getSpaceHeight('.common-el-main-padding.el-main')
  const pageHeaderHeight = getClientHeight('.common-el-page-padding.el-page-header')
  const tableSpaceHeight = getSpaceHeight('.base-table')
  const borderHeight = 1
  // 计算fixed element的高度
  let fixedElementsHeight = 0
  me.fixedElements.split('').forEach((selector: string) => {
    fixedElementsHeight += getClientHeight(selector)
  })
  // 默认会排除的高度 这意味着 当查询条件使用 common-query 时无需传参数即可自动计算
  const defaultFixedElementHeight = getClientHeight('.common-query')
  me.localHeight = Math.max(config.MIN_WIN_HEIGHT, window.innerHeight) - headerHeight - paginationHeight - wrapperHeight - pageHeaderHeight - tableSpaceHeight - borderHeight - me.fixedHeight - defaultFixedElementHeight
}

function getParams () {
  // @ts-ignore
  const me = this
  const params = deepClone(me.params)
  delete params[UUID_KEY]
  delete params._first
  return {
    ...params,
    currentPage: me.currentPage,
    pageSize: me.pageSize,
    sortField: me.sortField,
    sortOrder: me.sortOrder,
    ...me.filterParams,
  }
}

function changeRouteParams () {
  // @ts-ignore
  const me = this
  const params = getParams.bind(me)()
  const query = me.$route.query
  me.$router.replace({
    path: me.$route.path,
    query: {
      ...query,
      [me.queryKey]: JSON.stringify(deepTrim({
        ...params,
        ...(me.recordRow ? (me.rememberRow ? {
          _rememberRow: me.rememberRow,
          _rememberRowKey: me.rememberRowKey,
        } : {}) : {}),
      }, true)),
    },
  })
}

function getContent (createElement: typeof Vue.prototype.$CreateElement, col: Column, props: any): VNodeChildren {
  // @ts-ignore
  const me = this
  let vNode: VNodeChildren = null
  // @ts-ignore
  const type: ContentType = col.content.type
  switch (type) {
    case 'link':
      // @ts-ignore
      if (!col.content.route) {
        throw Error('当type为link时，route为必须')
      }
      // @ts-ignore
      vNode = createElement('router-link', {props: {to: col.content.route(props.row)}}, [createElement('a', {on: getContentEvent.bind(me)(type, col, props)}, [col.content.value ? col.content.value(props.row) : props.row[col.prop]])])
      break
    case 'btn':
      break
    case 'event':
      break
  }
  return [vNode]
}

function getContentEvent (type: ContentType, col: Column, props: any) {
  // @ts-ignore
  const me = this
  const eventObj: any = {}
  switch (type) {
    case 'link':
      eventObj.click = () => {
        // todo 在跳转到其他页面之前需要添加的事情
        if (me.recordRow) {
          // @ts-ignore
          me.rememberRow = props.row[col.content.key || col.prop] + ''
          // @ts-ignore
          me.rememberRowKey = col.content.key || col.prop
        }
        if (me.recordParams) {
          changeRouteParams.bind(me)()
        }
      }
      break
    case 'event':
      break
  }
  return eventObj
}

function mergeTableFunctionProps () {
  // @ts-ignore
  const me = this
  return {
    'row-class-name' (arg: any) {
      let outerRowClassName: any = me.tableProps['row-class-name'] || ''
      if (outerRowClassName) {
        if (typeof outerRowClassName === 'function') {
          outerRowClassName = outerRowClassName(arg)
        }
      }
      let innerRowClassName = ''
      if (me.rememberRowStatus && me.recordParams && me.recordRow && me.rememberRow && me.rememberRow === arg.row[me.rememberRowKey] + '') {
        innerRowClassName = 'remember-row'
      }
      return `${outerRowClassName} ${innerRowClassName}`
    },
  }
}
