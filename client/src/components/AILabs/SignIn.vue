<template>
  <div id="index" class="ailabs-index">
    <div class="ailabs-container">
      <nav class="ailabs-navbar">
        <!-- <a class="" href="/">
          <img :src="ailabs_icon_png" height="30" class="d-inline-block align-top" alt="">
        </a> -->
      </nav>
      <div class="row">
        <div class="col-md-8">
          <img :src="logo_with_bg" class="" height="256">
        </div>
        <!-- <div class="col-md-8 text-left ailabs-title-block">
          <span class="ailabs-subtitle">Welcome to Taiwan AI Labs</span>
          <h2 class="ailabs-title">大數據資料管理平台</h2>
        </div> -->
        <div class="col-md-4">
          <div id="login" class="ailabs-panel">

            <div class="row form-group">
              <label>電話號碼</label>
              <input v-model="phone" type="phone" placeholder="電話號碼" class="form-control" />
            </div>
            <div class="row form-group">
              <label>密碼</label>
              <input v-model="password" type="password" placeholder="密碼" class="form-control" />
            </div>
            <div class="form-group aliabs-text-right">
              <a href="/#/signUp">註冊新帳號</a>
            </div>
            <div class="form-group aliabs-text-right">
              <el-button class="ailabs-btn-red" size="mini" type="primary" @click="signIn()">登入</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    getToken,
    setToken,
    removeToken
  } from '@/utils/auth'
  import ailabs_icon_png from '@/assets/ailabs_images/ailabs_logo.png'
  import logo_with_bg from '@/assets/ailabs_images/logo_with_background.png'
  export default {
    name: "SignIn",
    data() {
      return {
        phone: null,
        password: null,
        ailabs_icon_png,
        logo_with_bg
      }
    },
    methods: {
      signIn() {
        var vm = this
        if (!this.phone) {
          alert('請填寫正確的電話號碼');
          return;
        }
        if (!this.password) {
          alert('請填寫正確的密碼格式');
          return;
        }
        this.$http.post('/signIn', {
          phone: this.phone,
          password: this.password,
        }).then((res) => {
          console.log(res.data)
          localStorage.setItem('token', res.data.access_token)
          // 先通通叫做 admin, 真正的權限在 api 分，因為大家其實都可以進後台
          setToken('admin')
          // 用 vm.$router.push 的話會有機會噴錯，應該是 cookie life cycle 的原因
          // 是因為 FredLogout 的問題
          // window.location.href = '/databases';
          vm.$router.push('/databases')
        }).catch(err => {
          localStorage.setItem('token', null)
          console.log(err.massage)
          const msg = err.response.data.message
          switch (msg) {
            case 'User not exist':
              {
                alert('帳號或密碼填寫不正確');
                break;
              }
            default:
            case 'Wrong password':
              {
                alert('密碼錯誤');
                break;
              }
          }
        })
      }
    }
  }

</script>

<style scoped>
</style>
