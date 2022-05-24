<template>
  <div id="app">
    <div class="header">
      <img src="./assets/logo.png" alt="" srcset="" />
      <p class="webName">
        <span>批改网</span>
      </p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
}
.header {
  height: 50px;
  background-color: rgba(36, 153, 222, 1);
  padding: 0 60px;
  display: flex;
  align-items: center;
  img {
    margin: 0;
    padding: 0;
    height: 50px;
  }
  .webName {
    font-family: "微软雅黑 Bold", 微软雅黑;
    font-style: normal;
    font-size: 18px;
    color: rgba(256, 256, 256, 1);
    margin-left: 10px;
    .clickSpan {
      cursor: pointer;
      font-weight: 800;
      margin-left: 20px;
    }
    .span1 {
      margin-left: 100px;
    }
    .nowView {
      text-decoration: underline;
    }
  }
}
</style>
