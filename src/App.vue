<template>
  <div id="app">
    <div class="header">
      <img src="./assets/logo.png" alt="" srcset="" />
      <p class="webName">
        <span>i+1课堂</span>
      </p>
      <div v-if="show" class="teacherHeaderChoose">
        <p @click="goRouter('/task')">课堂任务</p>
        <p @click="goRouter('/task/publish')">发布任务</p>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data(){
    return{
      show:false,
    }
  },
  created(){
    //判断是老师还是学生
    console.log(document.URL)
    if(document.URL.indexOf('task')>0){
      this.show = true;
    }
  },
  methods:{
    goRouter(value){
      this.$router.push(value);
    }
  }
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
    font-size: 25px;
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
  .teacherHeaderChoose{
    display: flex;
    color: #fff;
    margin-left: 100px;
    font-size: 18px;
    p{
      cursor: pointer;
      margin: 0 15px;
    }
  }
}
</style>
