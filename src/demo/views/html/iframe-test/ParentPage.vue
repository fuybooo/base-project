<template>
  <div class="h">
    <el-button @click="handleClick">发送事件</el-button>
    <hr>
    <iframe ref="iframe" name="iframe" id="iframe" src="http://localhost:8000/iframe.html" frameborder="0" width="100%"
            height="200px"></iframe>
    <!--    <iframe src="" frameborder="0"></iframe>-->
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({})
  export default class ParentPage extends Vue {
    public created () {
      window.addEventListener('message', (event) => {
        // console.log('parent:', event)
      }, false)
    }

    public handleClick = () => {
      (this.$refs.iframe as any).contentWindow.postMessage({
        name: 'postMessage parent name',
        type: 'postMessage parent type',
        from: 'postMessage parent from',
      }, 'http://localhost:8000')
    }
  }
</script>
<style scoped lang="less">

</style>
