<template>
  <el-container class="h">
    <el-main class="h">
      <div class="login-wrap">
        <div class="login-box">
          <div class="logo"></div>
          <div class="login-form">
            <el-form :model="form" :rules="rules" size="medium" ref="form" label-position="left" label-width="0px">
              <el-form-item>
                <h3 class="title">{{$t('login.title')}}</h3>
              </el-form-item>
              <el-form-item label="" prop="username">
                <el-input v-model="form.username" :placeholder="$t('login.inputUser')">
                  <template slot="prepend"><i class="el-icon-user"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input type="password" v-model="form.password" :placeholder="$t('login.inputPassword')">
                  <template slot="prepend"><i class="el-icon-lock"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="type">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-checkbox v-model="form.remember" checked>{{$t('login.remember')}}</el-checkbox>
                  </el-col>
                  <el-col :span="12" class="tar">
                    <router-link to="/register">{{$t('login.register')}}</router-link>
                    /
                    <router-link to="/forgot">{{$t('login.forgot')}}</router-link>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login()" class="login-button">{{$t('sys.login')}}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import './assets/less/index.less'
  import {transferRules} from '@/util/common/fns/fns-form'
  import {gc} from '@/util/common/fns/fns'
  import {KEY_TOKEN} from '@/model/project/local-storage-keys/keys'
  import {login} from '@/modules/login/login.service'
  import { HttpRes } from '@/model/common/models'

  const rules = {
    username: [
      {required: true},
      {max: 30},
    ],
    password: [
      {required: true},
      {max: 20},
    ],
  }
  @Component({})
  export default class Login extends Vue {
    public form = {
      username: 'fyb',
      password: 'Aa222222',
      remember: true,
    }
    public rules: any = rules

    public created () {
      if (gc(KEY_TOKEN)) {
        // 发送请求是否已经登录了，若登录了，则直接跳转到登录否则
        this.$req(this.$urls.login.hasLogin, {token: gc(KEY_TOKEN)}).then((res: HttpRes) => {
          if (res.head.errCode === 0) {
            // 已经登录，直接跳转
            this.$router.push({name: 'main'})
          }
        })
      }
      this.rules = transferRules.bind(this)(rules)
    }

    public login () {
      (this.$refs.form as any).validate((valid: boolean) => {
        if (!valid) {
          this.$error(this.$t('login.tip.userNameOrPasswordError') as string)
          return false
        } else {
          login.bind(this)(this.form.username, this.form.password)
        }
      })
    }
  }
</script>
