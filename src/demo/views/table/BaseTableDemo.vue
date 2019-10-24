<template>
  <el-container class="h">
    <el-main class="h">
      <div class="common-query">
        <base-form :schema="schema" v-model="form" inline @create="handleClick"></base-form>
      </div>
      <base-table
        ref="table"
        :url="url"
        :columns.sync="columns"
        :params.sync="form"
        :handle-result="handleResult"
        :before-list="beforeList"
        :node-attrs="tableAttrs"
      >
        <template v-slot:address="{row}">
          <span>{{row.address}}</span>
        </template>
        <!--        此处一般不需要作用域，根据需要进行解构 v-slot:ageHeader={column}-->
        <template v-slot:ageHeader>
          <span>不仅仅是标题</span>
        </template>
        <template v-slot:ageContent="{row}">
          <span>不仅仅是内容{{row.age}}</span>
        </template>
        <template v-slot:nameHeader>
          <span>slot name header</span>
        </template>
        <template v-slot:genderContent>
          <span>slot genderContent</span>
        </template>
        <template v-slot:op="{row}">
          <el-button type="primary" plain @click="toEdit(row)">编辑</el-button>
          <base-confirm class="ml10" @confirm="del(row)"></base-confirm>
          <!--          <el-button type="danger" plain @click="toDel(row)">删除</el-button>-->
        </template>
      </base-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Column, columnWidth, defaultFilterSplit} from '@/components/common-table/table.model'
  import {Schema} from '@/components/common-form/form.model'
  import {fb} from '@/util/common/fns/fns-form'
  import format from 'date-fns/format'
  import {HttpRes} from '@/model/common/models'
  import {guid} from '@/util/common/fns/fns'

  @Component({})
  export default class BaseTableDemo extends Vue {
    public input = ''
    public schema: Schema[] = [
      {
        label: '搜索',
        prop: 'keyword',
      },
      {
        label: '出生日期',
        prop: 'birthday',
        comp: 'date',
        props: {
          type: 'daterange',
        },
        startProp: 'startBirthday',
        endProp: 'endBirthday',
      },
      {
        label: '生日',
        prop: 'birth',
        comp: 'date',
        props: {
          type: 'date',
        },
        aliasProp: 'birthDate',
      },
    ]
    public form = fb(this.schema)
    public url = this.$urls.demo.table.get
    public columns: Column[] = [
      {
        prop: 'id',
        label: '编号',
        props: {
          width: columnWidth.w120,
        },
        content: {
          type: 'link',
          route (row: any) {
            return `/main/demo/form-detail/view/${row.id}`
          },
        },
      },
      {
        prop: 'name',
        label: '姓名',
        headerSlot: 'nameHeader',
        props: {
          width: columnWidth.w160,
          formatter (r: any, c: any, v: any, i: number) {
            return v + i
          },
          sortable: 'custom',
          filters: [
            {text: '张三', value: '1' + defaultFilterSplit + 'name'}, // 此处的'name'使用filterProp || prop 分隔符 defaultFilterSplit 一般使用该值即可
            {text: '李四', value: '2' + defaultFilterSplit + 'name'},
          ],
        },
      },
      {
        prop: 'gender',
        label: '性别',
        contentSlot: 'genderContent',
        props: {
          width: columnWidth.w200,
          filters: [
            {text: 1, value: 11 + defaultFilterSplit + 'gender'},
            {text: 2, value: 22 + defaultFilterSplit + 'gender'},
          ],
        },
      },
      {
        prop: 'age',
        label: '年龄',
        contentSlot: 'ageContent',
        headerSlot: 'ageHeader',
      },
      {
        prop: 'customAge',
        label: 'custom年龄',
        props: {
          width: columnWidth.w120,
        },
      },
      {
        prop: 'address',
        label: '地址',
        // contentSlot: 'address',
        props: {
          width: columnWidth.w200,
          formatter (row, col, value) {
            return value.repeat(4).slice(0, 6)
          },
        },
      },
      {
        prop: 'birthday',
        label: '生日',
        props: {
          formatter (row, col, value) {
            return value ? format(value, 'YYYY-MM-DD HH:mm:ss') : ''
          },
          width: columnWidth.dateTimeAll,
        },
      },
      {
        label: '操作',
        contentSlot: 'op',
        props: {
          width: columnWidth.w160,
        },
      },
    ]
    // 监听表格的各种事件
    public tableAttrs = {
      on: {
        'row-click' () {
        },
      },
    }
    public handleResult = (data: any) => {
      return data.results.map((item: any) => ({...item, customAge: item.age}))
    }

    public handleClick () {
      this.$router.push({name: 'demo-form-detail'})
    }

    public del (row: any) {
      this.$req(this.$urls.demo.table.del, {id: row.id}).then((res: HttpRes) => {
        if (res.head.errCode === 0) {
          // 从第一页查询
          // this.form._uuid = guid();
          // 从当前页查询
          (this.$refs.table as any).search()
        }
        // 根据请求结果进行提示
        this.$tip(res)
      })
    }

    public toEdit (row: any) {
      this.$router.push({name: 'demo-form-detail', params: {pattern: 'edit', id: row.id}})
    }

    public beforeList () {
      // 满足某些条件时才进行查询
      return this.form.keyword.length < 10
    }
  }
</script>
<style scoped lang="less">

</style>
