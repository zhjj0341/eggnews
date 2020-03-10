<template>
  <div class="login-container">
    <el-form
      @keyup.enter.native="handleLogin"
      autocomplete="on"
      :status-icon="true"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form"
    >
      <h3 class="title">登录</h3>
      <el-form-item prop="name">
        <el-input
          name="name"
          type="text"
          v-model="loginForm.name"
          autocomplete="on"
          placeholder="请输入账号"
        >
          <i slot="prefix" class="iconfont icon-profile"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          name="pass"
          type="pass"
          v-model="loginForm.pass"
          autocomplete="new-pass"
          placeholder="请输入密码"
        >
          <i slot="prefix" class="iconfont icon-password"></i>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        name: '',
        pass: ''
      },
      // GetMaintain: null, // 维护的轮询接口，暂不用
      loginRules: {
        name: [{ required: true, trigger: 'blur', message: '请填写' }],
        pass: [{ required: true, trigger: 'blur', message: '请填写' }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return false
        this.loading = true
        this.$store
          .dispatch('Login', this.loginForm)
          .then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  .el-form-item {
    input.el-input__inner {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 25px;
      color: $light_gray;
    }
    .el-input {
      display: inline-block;
      width: 100% !important;
    }
    .el-input__prefix {
      line-height: 47px;
    }
  }

  .el-input__inner,
  .el-button {
    font-size: 15px;
    height: 47px !important;
    line-height: normal !important;
  }
  .el-input__prefix {
    line-height: 47px;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    width: 350px;
    margin-bottom: 15vh;
    .maintrin-title {
      color: #f65757;
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  .el-form-item {
    margin-bottom: 22px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .captcha {
    display: block;
    cursor: pointer;
  }
}
</style>
