<template>
    <div class="write">
        <el-card class="card" body-style="padding:20px">
            <div v-html="essay_topic"></div>
        </el-card>        
    </div>
</template>
<script>
export default {
    data(){
        return{
            essay_topic:''
        }
    },
    created(){
        this.essay_topic = this.$route.query.essay_topic;
        this.init();
    },
    methods:{
        init(){

        },
    }
}
</script>
<style lang="scss">
.write {
  width: 100%;
  margin: 0 auto;
  .card{
      margin: 15px 25px;
  }
   
}
</style>