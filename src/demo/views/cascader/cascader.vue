<template>
  <div>
    {{defaultValue}}
    <el-cascader
      class="w"
      v-model="defaultValue"
      :options="options"
      :props="{ multiple: true, checkStrictly: true }"
      clearable
    ></el-cascader>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import { cascaderOptions } from '@/demo/model/demo.model'

  @Component({})
  export default class Input extends Vue {
    public options = cascaderOptions
    public defaultValue = [ [ 'zujian' ], [ 'ziyuan' ], [ 'zhinan' ] ]
  }
</script>
<style scoped lang="less">

</style>
