<template>
    <div class="home">
        <div class="searchDiv">
            <el-input size="large" placeholder="搜索任务号答题" v-model="rid" class="input-with-select">
                <el-button slot="append" type="primary" icon="el-icon-search" @click="gowrite()"></el-button>
            </el-input> 
        </div>
    </div>
</template>
<script>
import {getRidRequest} from "../api/index"
export default {
    data(){
        return{
            rid:'2669712',
            essay_topic:'',
        }
    },
    created(){

    },
    methods:{
        gowrite(){
            getRidRequest(this.rid).then(res=>{
                console.log(res);
                this.essay_topic = res.data.request.essay_topic;
                this.$router.push({
                    path:'/write',
                    query:{
                        essay_topic:this.essay_topic
                    }
                })
            });
        }
    }
}
</script>
<style lang="scss">
.home {
  width: 100%;
  margin: 0 auto;
    .searchDiv{
        margin: 100px auto;
        width: 45%;
    }
}
</style>