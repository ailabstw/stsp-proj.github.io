<template>
  <div id="index" class="ailabs-index">
    <div class="ailabs-container">
      <nav class="ailabs-navbar">
        <a class="navbar-brand" href="/">
          <img :src="ailabs_icon_png" height="30" class="d-inline-block align-top" alt="">
        </a>
      </nav>
      <div class="row mt-sm">
        <div class="col-md-8 text-left ailabs-title-block">
          
          <h2 class="ailabs-title">大數據資料管理平台</h2>
          <span class="ailabs-subtitle">Welcome to Taiwan AI Labs</span>
        </div>
        <div class="col-md-4">
          <div id="signUp" class="ailabs-panel">

            <div class="row form-group">
              <label>用戶名稱</label>
              <input v-model="name" type="text" placeholder="用戶名稱" class="ailabs-input form-control" />
            </div>
            <div class="row form-group">
              <label>公司名稱</label>
              <input v-model="group" type="text" placeholder="公司名稱" class="ailabs-input form-control" />
            </div>
            <div class="row form-group">
              <label>電話號碼</label>
              <input v-model="phone" type="phone" placeholder="電話號碼" class="ailabs-input form-control" />
            </div>
            <div class="row form-group">
              <label>密碼</label>
              <input v-model="password" type="password" placeholder="密碼" class="ailabs-input form-control" />
            </div>
            <div class="form-group aliabs-text-right">
              <a href="/#/signIn">登入我的帳號</a>
            </div>
            <div class="form-group aliabs-text-right">
              <el-button class="ailabs-btn-red" size="mini" type="primary" @click="signUp()">註冊</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import ailabs_icon_png from '@/assets/ailabs_images/ailabs_logo.png'
  export default {
    name: "SignUp",
    data() {
      return {
        phone: null,
        name: null,
        password: null,
        group: null,
        ailabs_icon_png
      }
    },
    methods: {
      /*
       * All default account is normal permission
       */
      signUp: function () {
        if (this.phone && this.name && this.password && this.group) {
          this.$http.post('/users', {
            name: this.name,
            group: this.group,
            phone: this.phone,
            password: this.password,
          }).then(res => {
            console.log(res.data)
            alert('歡迎加入，請重新登入管理平台。');
            this.$router.push('signIn')
          }).catch(err => {
            console.log(err)
            if (err.hasOwnProperty('response') && err.response.hasOwnProperty('data')) {
              if (err.response.data.message === 'phone has been used') {
                alert('此電話號碼已經被註冊');
              }
            } else {
              alert('註冊錯誤');
            }
          })
        } else {
          alert('欄位請填寫正確。');
        }
      }
    }
  }

</script>

<style>


</style>
