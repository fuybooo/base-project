<template>
  <el-dialog
    ref="dialog"
    class="base-dialog"
    :visible.sync="localVisible"
    v-bind="props"
  >
    <template slot="title">
      <slot name="title"></slot>
    </template>
    <template>
      <slot></slot>
    </template>
    <template slot="footer">
      <slot name="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator'
  import './BaseDialog.less'

  @Component({})
  export default class BaseDialog extends Vue {
    @Prop({default: false}) public visible!: boolean
    @Prop() public props!: object
    @Prop({default: true}) public autoClose!: boolean
    public localVisible = this.visible
    @Watch('visible')
    public visibleChange () {
      this.localVisible = this.visible
    }
    @Watch('localVisible')
    public localVisibleChange () {
      this.$emit('update:visible', this.localVisible)
    }
    @Emit()
    public cancel () {
      if (this.autoClose) {
        this.localVisible = false
      }
    }
    @Emit()
    public ok () {
      if (this.autoClose) {
        this.localVisible = false
      }
    }
  }
</script>
<style scoped lang="less">

</style>
