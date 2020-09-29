<template>
  <div class="login-page">
    <div class="login-page-form">
      <div class="login-page-title">登录开发者工具</div>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        :hideRequiredMark="true"
        ref="form"
      >
        <a-form-model-item label="开发者后台域名" prop="domain">
          <a-input v-model="form.domain" placeholder="http://10.0.0.1:21006" />
        </a-form-model-item>
        <a-form-model-item label="开发者账号" prop="username">
          <a-input v-model="form.username" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input type="password" v-model="form.password" />
        </a-form-model-item>
      </a-form-model>

      <div class="login-page-btns">
        <a-button type="primary" class="login-page-btn" @click="handleLogin"
          >登录</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { login } from '@/services'
import { NORMAL_MINI_APP_TYPE } from '@/constants'

export default {
  name: 'login-page',
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        domain: 'http://baas.uban360.net:21006',
        username: 'zhuwei',
        password: '1234567'
      },
      rules: {
        domain: [
          { required: true, message: '开发者后台域名不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '开发者账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.form.validate(valid => {
        if (valid) {
          login(this.form.domain, {
            username: this.form.username.trim(),
            password: md5(this.form.password.trim()),
            validateCode: 'openLoginWithoutCheckCode'
          }).then(res => {
            this.$router.push({
              name: 'mp-list',
              params: { type: NORMAL_MINI_APP_TYPE }
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-page {
  &-title {
    font-size: 20px;
    margin-bottom: 30px;
    text-align: center;
  }
  &-form {
    width: 500px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  &-btns {
    text-align: center;
  }

  &-btn {
    width: 100px;
  }
}
</style>
