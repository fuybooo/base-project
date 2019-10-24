<template>
  <el-container class="h">
    <el-main class="h">
      <el-carousel :interval="4000" class="h">
        <el-carousel-item v-for="item in list" :key="item.key">
          <div class="medium-item" :style="item.style">{{item.value}}</div>
        </el-carousel-item>
      </el-carousel>
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({})
  export default class MainHome extends Vue {
    public list = [
      {
        key: 1,
        style: 'background: #409EFF;',
        value: '#409EFF',
      },
      {
        key: 2,
        style: 'background: #67C23A;',
        value: '#67C23A',
      },
      {
        key: 3,
        style: 'background: #E6A23C;',
        value: '#E6A23C',
      },
      {
        key: 4,
        style: 'background: #F56C6C;',
        value: '#F56C6C',
      },
      {
        key: 5,
        style: 'background: #909399;',
        value: '#909399',
      },
    ]

    public created () {
    }
  }
</script>
<style scoped lang="less">
  /deep/ .el-carousel__container {
    height: 100%;
  }

  .medium-item {
    height: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
