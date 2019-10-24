<template>
  <el-container class="h" id="app">
    <el-main class="h">
      <lang-setting :class="['lang-setting', {dn: !$store.state.showLangSetting}]" id="js-lang-setting"></lang-setting>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
