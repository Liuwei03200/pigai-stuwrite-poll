<template>
    <div class="config">
        <el-card class="card" body-style="padding:20px 30px;">
            <div class="title">配置:</div>
            <div class="content">
                <div>
                    <el-form ref="form" label-width="80px">
                        <el-form-item required="" label="标题">
                            <el-input v-model="config.title" placeholder="作文要求"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="要求">
                            <el-input type="textarea" placeholder="作文要求" v-model="config.request"></el-input>
                        </el-form-item>
                        <el-form-item label="最小字数">
                            <el-input style="width:200px;" v-model.number="config.minWord"></el-input>
                        </el-form-item>
                        <el-form-item label="最大字数">
                            <el-input style="width:200px;" v-model.number="config.maxWord"></el-input>
                        </el-form-item>
                         <el-form-item label="分制">
                             <el-input style="width:200px;" v-model.number="config.score"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-form ref="form" label-width="80px">
                        <el-form-item label="答题内容">
                            <el-input style="width:200px;" v-model.number="config.autoSave"></el-input>
                            秒自动保存
                        </el-form-item>
                        <el-form-item label="提交次数">
                            <el-input style="width:200px;" v-model.number="config.submitNum"></el-input>
                            0 为不限制
                        </el-form-item>
                        <el-form-item label="需要登录"> 
                            <el-switch v-model="config.info.show"></el-switch>
                            <p>选择不需要登录，需要补充信息，登录用批改网帐号</p>
                        </el-form-item>
                         <el-form-item inline-message label="补充信息"  v-if="config.info.show==false">
                           姓名: <el-switch disabled='true' v-model="config.info.name"></el-switch>&nbsp;&nbsp;
                           学号: <el-switch v-model="config.info.number"></el-switch>&nbsp;&nbsp;
                           班级: <el-switch v-model="config.info.class"></el-switch>&nbsp;&nbsp;
                           专业: <el-switch v-model="config.info.profession"></el-switch>
                        </el-form-item>
                         <el-form-item label="提交Url">
                            <el-switch v-model="config.writeSaveUrl.show"></el-switch>
                            <p>设置写作页面的提交内容数据保存接口</p>
                        </el-form-item>
                        <el-form-item label="填写url" v-if="config.writeSaveUrl.show">
                          <el-input placeholder="请填写写作页面提价保存的链接" v-model="config.writeSaveUrl.url"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveForm()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div v-if="id>0">
                <div class="urlbtn">
                    <p>答题链接：</p>
                    <div class="urltext">
                        http://py.jukuu.com:8080/zhihui/#/config/write?id={{id}}
                    </div>
                    <el-button type="primary" @click="gohref()">打开</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import {saveData} from "../../api/index"
export default {
    data(){
        return{
            config:{
                title:'', //  写作标题
                request:'', // 写作要求
                submitNum:0, //  可以提交几次 0 为不限制
                minWord:10, // 最小字数
                maxWord:200, // 最大字数
                score:100, // 分制  100分
                autoSave:10, // 自动保存 时间间隔 默认 10秒
                writeSaveUrl:{
                    show:false,
                    url:'',
                },
                info:{
                    show:false,
                    name:true,
                    number:true,
                    class:true,
                    profession:true
                }
            },
            id:-1
        }
    },
    methods:{
        saveForm(){
            saveData(JSON.stringify(this.config)).then(res=>{
                console.log(res);
                if(res.code != 1){
                    this.$message.error('配置存储失败，请重新调取')
                    return;
                }
                this.$message.success('生成答题页面成功，点击下面按钮打开写作页面');
                this.id = res.id;
            })
        },
        gohref(){
            window.open(`http://py.jukuu.com:8080/zhihui/#/config/write?id=${this.id}`,'_blank')
        }
    }
}
</script>
<style lang="scss" scoped>
.config{
    width: 100%;
    margin: 0 auto;
    .card{
      margin: 15px 25px;
      font-size: 15px;
        .title{
            text-align: left;
            font-size: 18px;
            font-weight: 700;
        }
        .content{
            display: flex;
            width: 100%;
            > div {
                flex: 1;
                text-align: left;
            }
        }
        .urlbtn{
            margin:  40px auto;
            display: flex;
            justify-content: center;
            .urltext{
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                // width: 300px;
                padding: 0 30px;
                border: 1px solid #ccc;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border-right:none ;
            }
        }
    }
}
</style>