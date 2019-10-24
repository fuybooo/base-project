<template>
  <div class="demo-log-box">
    <div class="title">
    </div>
    <base-table
      ref="table"
      :columns.sync="columns"
      :table-props="tableProps"
      :auto-height="false"
      :is-pagination="false"
    ></base-table>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Column} from '@/components/common-table/table.model'

  @Component({})
  export default class DemoLog extends Vue {
    @Prop() public data!: any[]
    public columns: Column[] = [
      {
        prop: 'datetime',
        label: '时间',
      },
      {
        prop: 'goal',
        label: '测试目的',
      },
      {
        prop: 'result',
        label: '测试结果',
      },
    ]
    public get tableProps () {
      return {
        data: this.data,
      }
    }
  }
</script>
<style scoped lang="less">

</style>
