<template>
    <div class="task">
        <div class="leftIcon">
            <el-card body-style="padding:25px">
                <div class="iconItem" :class="item==1?'iconItemColor':''" @click="item = 1">
                    <i class="el-icon-s-home"></i>
                    <p>概述</p>
                </div>
                <div class="iconItem" :class="item==2?'iconItemColor':''" @click="item = 2">
                    <i class="el-icon-s-management"></i>
                    <p>编辑</p>
                </div>
                <div class="iconItem" :class="item==3?'iconItemColor':''" @click="item = 3">
                    <i class="el-icon-s-grid"></i>
                    <p>数据</p>
                </div>
                <div class="iconItem" :class="item==4?'iconItemColor':''" @click="item = 4">
                    <i class="el-icon-s-data"></i>
                    <p>报表</p>
                </div>
            </el-card>
        </div>
        <div class="content">
            <el-card class="contentCard" body-style="padding:15px 20px;">
                <div v-if="item==1">
                    <el-form ref="form" label-width="80px">
                        <el-form-item label="任务名">
                            <el-input v-model="intro.title" placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="导 学">
                            <el-input type="textarea" rows="5"  placeholder="请输入任务简介" v-model="intro.info"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="item++">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="config" v-if="item==2">
                    <div>   
                        <div class="btns">
                            新增任务：
                            <el-button type="default" @click="addContent('composition')">写作</el-button>
                            <el-button type="default" @click="addContent('underline')">划词</el-button>
                        </div>
                        <template v-if="content.length>0">
                            <el-card class="itemContent" shadow="hover" v-for="v,n in content" :key="n">
                                <div class="head">
                                    <div>{{n+1}}. 写作
                                         <el-button type="primary" style="margin-left:10px" plain size="mini" icon="el-icon-close" circle @click="delContent(n)" >
                                        </el-button>
                                    </div>
                                    <div>
                                        <el-button type="primary" plain size="mini" icon="el-icon-upload2" circle @click="updownContent(n,0)" >
                                        </el-button>
                                        <el-button type="primary" plain size="mini" icon="el-icon-download" circle @click="updownContent(n,1)" >
                                        </el-button>
                                    </div>
                                </div>
                                <el-form v-if="v.type == 'composition'" ref="form" >
                                    <el-form-item required="">
                                        <el-input v-model="content[n].title" placeholder="请输入标题"></el-input>
                                    </el-form-item>
                                    <el-form-item required="">
                                        <el-input type="textarea" rows="5" placeholder="请输入任务要求" v-model="content[n].request"></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item label="提交次数">
                                        <el-input style="width:200px;" v-model.number="content[n].submitNum"></el-input>
                                        0 为不限制
                                    </el-form-item> -->
                                    <el-form-item label="打分公式">
                                        <el-select v-model="content[n].gongshi" placeholder="请选择活动区域">
                                            <el-option :label="v[0]" :value="v[1]" v-for="v in gongshi" :key="v[1]"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="最小字数">
                                        <el-input style="width:200px;" v-model.number="content[n].minWord"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最大字数">
                                        <el-input style="width:200px;" v-model.number="content[n].maxWord"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分制">
                                        <el-input style="width:200px;" v-model.number="content[n].score"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </template>
                    </div>
                    <div>
                        <div class="peizhi">
                            配置：
                        </div>
                        <el-card class="configcss" shadow="hover">
                            <el-form ref="form" label-width="80px">
                                <el-form-item label="开始时间"> 
                                   <el-date-picker
                                    v-model="config.startTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="截止时间"> 
                                     <el-date-picker
                                        v-model="config.endTime"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                                 <el-form-item label="一页一题"> 
                                    <el-switch v-model="config.onePage"></el-switch>
                                </el-form-item>
                                 <el-form-item label="答题卡"> 
                                    <el-switch v-model="config.showCard"></el-switch>
                                </el-form-item>
                                <el-form-item label="需要登录"> 
                                    <el-switch v-model="config.info.show"></el-switch>
                                    <p>选择不需要登录，需要补充信息，登录用批改网帐号</p>
                                </el-form-item>
                                <el-form-item inline-message label="补充信息"  v-if="config.info.show==false">
                                姓名: <el-switch v-model="config.info.name"></el-switch>&nbsp;&nbsp;
                                学号: <el-switch v-model="config.info.number"></el-switch>&nbsp;&nbsp;
                                班级: <el-switch v-model="config.info.class"></el-switch>&nbsp;&nbsp;
                                专业: <el-switch v-model="config.info.profession"></el-switch>
                                学校: <el-switch v-model="config.info.school"></el-switch>
                                </el-form-item>
                                <el-form-item label="答题内容">
                                    <el-input style="width:200px;" v-model.number="config.autoSave"></el-input>
                                    秒自动保存
                                </el-form-item>
                                <el-form-item label="答题时限">
                                    <el-input style="width:200px;" v-model.number="config.allTime"></el-input>
                                    分钟 （进入答题页面开始计时，0 为不限制）
                                </el-form-item>
                                <!-- <el-form-item label="提交次数">
                                    <el-input style="width:200px;" v-model.number="config.submitNum"></el-input>
                                    0 为不限制
                                </el-form-item> -->
                                <el-form-item>
                                    <el-button type="primary" @click="saveForm()">提交</el-button>
                                </el-form-item>
                            </el-form>
                            <div v-if="id>0">
                                <div class="urlbtn">
                                    <p>答题链接：</p>
                                    <div class="urltext">
                                        http://py.jukuu.com:8080/zhihui/#/taswrite?id={{id}}
                                    </div>
                                    <el-button type="primary" class="btn" @click="gohref()">打开</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import {saveData} from "../../api/index"
export default {
    data(){
        return{
            item:1,
            id:0,
            intro:{
                title:'',
                info:'',
            },
            content:[],
            config:{
                startTime:'', //开始时间
                endTime:'', // 结束时间
                submitNum:0, //  可以提交几次 0 为不限制
                autoSave:10, // 自动保存 时间间隔 默认 10秒
                allTime:0,// 答题时间 
                onePage:false, // 是否为一页一题
                showCard:false, //是否显示答题卡
                info:{
                    show:false,
                    name:true,
                    number:true,
                    class:true,
                    profession:true,
                    school:true
                }
            },
            gongshi:[
                ['默认打分公式',861612],
                ['雅思大作文',861584],
                ['雅思小作文',861589],
                ['四级',861591],
                ['六级',861593],
                ['托福',861601],
                ['本科专四打分公式',861613],
                ['本科小作文',861616],
                ['本科专八',861617],
                ['本科考研',861621],
                ['应用文书信',861623],
                ['高中SAT',861627],
                ['高中',861634],
                ['初中',861676],
                ['高职三级',861703],
                ['高职B级',861705],
                ['高职A级',861706],
                ['读后续写',862269],
                ['研究生长论文',862310]
            ]
        }
    },
    methods:{
        addContent(val){
            if(val == 'composition'){
                this.content.push(
                    {   
                        type:'composition',
                        title:'', //  写作标题
                        request:'', // 写作要求
                        gongshi:'',
                        minWord:10, // 最小字数
                        maxWord:200, // 最大字数
                        score:100, // 分制  100分
                    }
                )
            }
            if(val == 'underline'){
                this.$message.error('暂不支持');
            }
        },
        saveForm(){
            console.log(new Date(this.config.endTime).getTime());
            let data = {
                intro:this.intro,
                content:this.content,
                config:this.config
            }
              saveData(JSON.stringify(data)).then(res=>{
                console.log(res);
                if(res.code != 1){
                    this.$message.error('配置存储失败，请重新调取')
                    return;
                }
                this.$message.success('生成答题页面成功，点击下面按钮打开写作页面');
                this.id = res.id;
            })
        },
        updownContent(n , type){
            // 调整上下任务
            // type 0=上 1=下
            if(type == 0){
                if(n == 0){
                    this.$message.error('已经是第一个了')
                    return;
                }
                [this.content[n],this.content[n-1]] = [this.content[n-1],this.content[n]]
            }else{
                if(n == (this.content.length-1)){
                    this.$message.error('已经是最后一个了')
                    return;
                }
                [this.content[n+1],this.content[n]] = [this.content[n],this.content[n+1]]
            }
            this.$forceUpdate();
        },
        delContent(n){
            this.content.splice(n,1);
        },
        gohref(){
            window.open(`http://py.jukuu.com:8080/zhihui/#/taswrite?id=${this.id}`,'_blank')
        }
    }
}
</script>
<style lang="scss" scoped>
    .task{
        width: 96%;
        padding: 15px 2%;
        display: flex;
        .leftIcon{
            width: 100px;
            margin-right: 15px;
            .iconItem{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-bottom: 30px;
                cursor: pointer;
                color: #ccc;
                i{
                    font-size: 30px;
                }
                p{
                    margin: 5px;
                }
            }
            .iconItemColor{
                color: #2f2f2f;
            }
        }
        .content{
            flex: 1;
            .contentCard{
                .config{
                    display: flex;
                    text-align:left;
                    .itemContent{
                        margin-top:15px;
                        .head{
                            margin-bottom: 10px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                    }
                    &>div{
                        flex: 1;
                        margin: 0 5px;
                    }
                    .configcss{
                        margin-top: 30px;
                        .urlbtn{
                            margin:  40px auto;
                            text-align: right;
                            .urltext{
                                background-color: #f4f4f4;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                padding: 0 30px;
                                border: 1px solid #ccc;
                               border-radius: 4px;
                            }
                            .btn{
                                margin-top: 15px;
                            }
                        }
                    }
                    .peizhi{
                       position: relative;
                       top: 7px;
                    }
                }
            }
          
        }
    }
</style>