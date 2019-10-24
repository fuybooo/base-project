<template>
  <base-dialog :visible.sync="localVisible" :props="props">
    <base-flex fixed-width="82px">
      <base-upload :props="localProps"></base-upload>
      <el-button slot="fixed" type="primary" plain @click="downloadTemplate">下载模板</el-button>
    </base-flex>
    <el-button slot="footer" @click="cancel">关闭</el-button>
  </base-dialog>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import config from '@/config/base-config'

  @Component({})
  export default class ImportDialog extends Vue {
    @Prop({default: false}) public visible!: boolean
    @Prop({
      default () {
        return {
          title: '导入文件',
          width: '50%',
        }
      },
    }) public props!: object
    @Prop() public uploadProps!: any
    public localVisible = this.visible
    public defaultProps = {
      accept: '.xls,.xlsx',
      action: `${config.baseURL}/${this.uploadProps.actionUrl}`,
    }
    public get localProps () {
      return {
        ...this.defaultProps,
        ...this.uploadProps,
      }
    }

    @Watch('visible')
    public visibleChange () {
      this.localVisible = this.visible
    }

    @Watch('localVisible')
    public localVisibleChange () {
      this.$emit('update:visible', this.localVisible)
    }

    public downloadTemplate () {
    }

    public cancel () {
      this.localVisible = false
    }
  }
</script>
<style scoped lang="less">

</style>
