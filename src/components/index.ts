import Vue from 'vue'
import '@/components/common-form/BaseForm'
import '@/components/common-table/BaseTable'
import '@/components/common-view-html/BaseViewHtml'
import BaseMenu from '@/components/common-menu/BaseMenu'
import BaseConfirm from '@/components/common-confirm-button/BaseConfirm.vue'
import LangSetting from '@/components/lang-setting/LangSetting.vue'
import PageHeader from '@/components/page-header/PageHeader.vue'
import BaseDialog from '@/components/common-dialog/BaseDialog.vue'
import BaseUpload from '@/components/common-upload/BaseUpload.vue'
import BaseFlex from '@/components/common-flex/BaseFlex.vue'

// 注册全局组件
Vue.component('AppLangSetting', LangSetting)
Vue.component('BaseConfirm', BaseConfirm)
Vue.component('AppPageHeader', PageHeader)
Vue.component('BaseMenu', BaseMenu)
Vue.component('BaseDialog', BaseDialog)
Vue.component('BaseUpload', BaseUpload)
Vue.component('BaseFlex', BaseFlex)
