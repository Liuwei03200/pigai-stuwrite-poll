<template>
    <div class="home">
        <div class="searchDiv">
            <el-input size="large" placeholder="搜索任务号答题" v-model.number="rid" class="input-with-select">
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
            rid:'',
            requestUrl:null, // 获取要求的url
            query:null, // get上获取的json数据
        }
    },
    created(){
        if(this.$route.query.query!=undefined){
            this.query = JSON.parse(this.$route.query.query);
            this.rid = this.query.rid != undefined?this.query.rid:null;
            if(this.rid!=null){
                this.$router.push({
                    path:'/write',
                    query:{
                        query:JSON.stringify(this.query)
                    }
                })
                return;
            }
        }
        console.log(this.query);
        if(this.query !=null){
            this.requestUrl = query.requestUrl!=undefined?query.requestUrl:null;
        }
    },
    methods:{
        gowrite(){
            getRidRequest(this.rid,this.requestUrl).then(res=>{
                console.log(res);
                if(res.error != 0){
                    this.$message.error(res.error_des);
                    return;
                }
                this.$router.push({
                    path:'/write',
                    query:{
                        rid:this.rid,
                        query:this.query!=null?this.query:undefined
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