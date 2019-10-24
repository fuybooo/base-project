<template>
  <div :class="'base-flex ' + className">
    <div v-if="fixed === 'after'" class="base-flex-default"><slot></slot></div>
    <div class="base-flex-fixed" :style="fixedStyle"><slot name="fixed"></slot></div>
    <div v-if="fixed === 'before'" class="base-flex-default"><slot></slot></div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator'
  import './BaseFlex.less'

  @Component({})
  export default class BaseFlex extends Vue {
    @Prop({default: 100}) public fixedWidth!: string | number
    @Prop({default: 'after'}) public fixed!: string
    @Prop({default: ''}) public className!: string
    public get fixedStyle () {
      return {
        width: typeof this.fixedWidth === 'string' ? this.fixedWidth : (this.fixedWidth + 'px'),
      }
    }
  }
</script>
<style scoped lang="less">

</style>
