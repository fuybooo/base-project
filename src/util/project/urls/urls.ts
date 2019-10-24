import Vue from 'vue'
import {prefix, urlType} from '@/util/project/urls/url-util'

// 该接口与urls保持一致，保证使用this.$urls时能够通过"."得到提示
export interface Urls {
  demo: {
    table: {
      get: urlType,
      getById: urlType,
      create: urlType,
      edit: urlType,
      del: urlType,
    },
  },
  login: {
    login: urlType,
    hasLogin: urlType,
    forgot: urlType,
    register: urlType,
    logout: urlType,
  },
  test: {
    getRules: urlType,
  },
  user: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
  },
  menu: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
    updateSort: urlType,
  },
  tenant: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
  },
  dictionary: {
    list: urlType,
    listType: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
  },
  organization: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
    upload: string,
  },
  diary: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
  },
  plan: {
    list: urlType,
    get: urlType,
    create: urlType,
    delete: urlType,
    update: urlType,
  },
}

const urls: Urls = {
  demo: {
    table: {
      get: {url: 'table/get', isStatic: true, prefix: prefix.demo},
      getById: {url: 'table/getById', isStatic: true, prefix: prefix.demo},
      create: {url: 'table/create', isStatic: true, prefix: prefix.demo},
      edit: {url: 'table/edit', isStatic: true, prefix: prefix.demo},
      del: {url: 'table/del', isStatic: true, prefix: prefix.demo},
    },
  },
  login: {
    // 登录
    login: {url: 'login', isStatic: true, prefix: prefix.base},
    // 根据token判断是否已经登录
    hasLogin: {url: 'hasLogin', isStatic: true, prefix: prefix.base},
    forgot: {url: 'forgot', isStatic: true, prefix: prefix.base},
    register: {url: 'register'},
    logout: {url: 'logout', isStatic: true, prefix: prefix.base},
  },
  test: {
    getRules: 'platform-extend/rule/rule/search',
  },
  user: {
    list: 'user/list',
    get: 'user/get',
    delete: 'user/delete',
    create: 'user/create',
    update: 'user/update',
  },
  menu: {
    list: {url: 'menu/list', isStatic: true},
    get: 'menu/get',
    delete: 'menu/delete',
    create: 'menu/create',
    update: 'menu/update',
    updateSort: 'menu/updateSort',
  },
  tenant: {
    list: 'tenant/list',
    get: 'tenant/get',
    delete: 'tenant/delete',
    create: 'tenant/create',
    update: 'tenant/update',
  },
  dictionary: {
    list: 'dictionary/list',
    listType: 'dictionary/listType', // 根据类型查询字典 入参可以是字符串，也可以是数组
    get: 'dictionary/get',
    delete: 'dictionary/delete',
    create: 'dictionary/create',
    update: 'dictionary/update',
  },
  organization: {
    list: 'organization/list',
    get: 'organization/get',
    delete: 'organization/delete',
    create: 'organization/create',
    update: 'organization/update',
    upload: 'organization/upload',
  },
  diary: {
    list: 'diary/list',
    get: 'diary/get',
    create: 'diary/create',
    delete: 'diary/delete',
    update: 'diary/update',
  },
  plan: {
    list: 'plan/list',
    get: 'plan/get',
    create: 'plan/create',
    delete: 'plan/delete',
    update: 'plan/update',
  },
}
Vue.prototype.$urls = urls
