<template>
  <transition name="fade" mode="out-in">
    <!-- <keep-alive :include='cachedViews'> -->
      <div class="app-container welcome-layout">
        <div  class="welcome">Welcome!</div>
        <img :src="ailabs_icon_png" class="logo">
      </div>
  </transition>
</template>

<script>
import ailabs_icon_png from "@/assets/ailabs_images/ailabs_logo.png";

export default {
  data() {
    return {
      ailabs_icon_png
    };
  }
};
</script>

<style>
/* @import url('https://fonts.googleapis.com/css?family=Black+Han+Sans'); */
@import url('https://fonts.googleapis.com/css?family=Raleway');

.welcome-layout {
  padding: 10%;
  margin: 40px;
}

.welcome {

  font-size: 50px;
  /* font-family: 'Black Han Sans', sans-serif; */
  font-family: 'Raleway', sans-serif;
  /* color: #F6416C; */
  display: block;
  /* margin: 10px 0; */
  text-align: center;
  font-size: 150px;
  /* font-weight: 500; */
}

.logo {
  display: block; 
  margin: auto;
  width: 256px;
}

</style>
