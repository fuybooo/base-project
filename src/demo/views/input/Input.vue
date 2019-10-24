<template>
  <div>
    <h3>测试input的双向绑定</h3>
    <el-input v-model="row.width" placeholder="placeholder" @change="changeInput"></el-input>
    <hr>
    <h3>测试循环中input的双向绑定</h3>
    {{list}}
    <ul>
      <li v-for="(item, i) of list" :key="i" class="flex-box">
        <span>{{i}}</span>
        <el-input v-model="item.width" placeholder="placeholder" @change="changeListInput(item, $event)"></el-input>
      </li>
    </ul>
    <h3>测试绑定值的一个机制</h3>
    list: {{testList}}
    <el-button type="primary" @click="testListClick(1)">改变list的第一项</el-button>
    <el-button type="primary" @click="testListClick(2)">给list的第二项增加一个字符串属性</el-button>
    <el-button type="primary" @click="testListClick(3)">给list的第三项增加一个对象属性</el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({})
  export default class Input extends Vue {
    public row = {
      width: 'auto',
    }
    public list = [
      {
        width: '1',
      },
      {},
      {
        width: 'auto',
      },
      {
        width: '',
      },
    ]
    public testList: any[] = [
      {
        a: 1,
      },
      {
        a: 2,
      },
      {
        a: 3,
      },
    ]

    public testListClick (type: number) {
      if (type === 1) {
        this.testList[0].a = 'test'
      } else if (type === 2) {
        this.testList[1].b = 'test b'
      } else if (type === 3) {
        this.testList[2].b = {newProperty: 'test new Property'}
      }
      // 上述 type = 2 与 3 无效
      if (type === 2) {
        this.testList[1] = {...this.testList[1], b: 'test: b'}
      } else if (type === 3) {
        this.testList[2] = {...this.testList[1], b: {newProperty: 'test new Property'}}
      }
      // 上述也无效，需要下面这行代码才能生效
      this.testList = [...this.testList]
    }
    public changeInput (value: string) {
      if (isNaN(+value)) {
        this.row.width = 'auto'
      } else {
        this.row.width = value || 'auto'
      }
    }

    public changeListInput (item: any, value: string) {
      if (isNaN(+value)) {
        item.width = 'auto'
      } else {
        item.width = value || 'auto'
      }
    }
  }
</script>
<style scoped lang="less">

</style>
