<template>
    <div class="write">
       <el-card v-if="config" class="card" body-style="padding:15px 30px">
           <el-row :gutter="10">
               <el-col :span="4">
                   <p class="colright">标题:</p> 
                </el-col>
               <el-col :span="20">
                   <p class="colleft">{{config.title}}</p>
                </el-col>
           </el-row>
            <el-row :gutter="10">
               <el-col :span="4">
                   <p class="colright">作文要求:</p> 
                </el-col>
               <el-col :span="20">
                   <p class="colleft">{{config.request}}</p>
                </el-col>
           </el-row>
            <el-row :gutter="10" v-if="config.info.show==false"> 
               <el-col :span="4">
                   <p class="colright">完善个人信息:</p> 
                </el-col>
               <el-col :span="20">
                   <el-form label-width="80px" style="width:400px;margin:0 auto">
                        <el-form-item label="姓名" v-if="config.info.name">
                            <el-input :disabled="infoDisable" v-model="uid"></el-input> 
                        </el-form-item>
                        <el-form-item label="学号"  v-if="config.info.number">
                            <el-input :disabled="infoDisable" v-model="number"></el-input>
                        </el-form-item>
                        <el-form-item label="班级" v-if="config.info.class">
                            <el-input :disabled="infoDisable" v-model="uclass"></el-input>
                        </el-form-item>
                        <el-form-item label="专业" v-if="config.info.profession">
                            <el-input :disabled="infoDisable" v-model="profession" v-if="config.info.profession"></el-input>
                        </el-form-item>
                        <el-form-item v-if="infoDisable==false">
                            <el-button type="primary" @click="startWrite">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
           </el-row>
        </el-card>
        <el-card v-if="infoDisable" class="card" body-style="padding:15px 30px;">
            <div class="titlesW">
               <el-input v-model="essay_title" placeholder="请输入标题"></el-input>
            </div>
            <div id="contentsW">
					<div id="contentsW_bar">
						<div class="contentsW_bar_left">请在下方写入 正文</div>
					</div>
					<textarea style="margin-bottom: -5px;" placeholder="请输入正文......." class="textarea content_line" cols="70" rows="10" v-model="essay_or_snts"></textarea>
					<!-- 草稿自动保存底部栏 -->
					<div class="from_bar">
                        <div>
                            <span>字数:<span id="init_wc">{{spss_countwords}} </span> 词</span> &nbsp;
                        </div>
						<div class="fr">
							<span>{{settime}} 秒后保存</span>
						</div>
					</div>

				</div>
                <div class="footBtn">
                    <el-button type="primary" @click="goSubmit(true)">提交批改</el-button>
                </div>
        </el-card>   
    </div>
</template>
<script>
import {getData,subWriteData} from "../../api/index"
export default {
    data(){
        return{
            config:null,
            id:-1,
            uid:'',
            number:'',
            uclass:'',
            profession:'',
            infoDisable:false,
            essay_title:'',
            old_essay_or_snts:'',
            essay_or_snts:'',
            settime:10,
            setInterval:null
        }
    },
    created(){
        this.id = this.$route.query.id; 
        if(this.id == undefined || this.id == null ){
            this.$message.error('请填写正确链接进行答题！');
            return;
        }
        this.init();
    },
    methods:{
        init(){
            this.getDataFunc();
        },
        getDataFunc(){
            console.log(this.id);
            getData(this.id).then(res=>{
                if(res.code != 1){
                    this.$message.error(res.msg);
                     return;
                }
                this.config = JSON.parse(res.data);
                    console.log(this.config);
                //判断是否需要登录
                if(this.config.info.show == true){
                    this.changePigaiLogin();
                }
            });
        },
        changePigaiLogin(){
            this.$message.error('需要您先进行登录！');
        },
        startWrite(){
            if(this.config.info.name&&this.uid == ''){
                 this.$message.error('请填写完整个人信息！');
                 return;
            }
            if(this.config.info.number&&this.number == ''){
                this.$message.error('请填写完整个人信息！');
                 return;
            }
            if(this.config.info.class&&this.uclass == ''){
                this.$message.error('请填写完整个人信息！');
                 return;
            }
            if(this.config.info.profession&&this.profession == ''){
                this.$message.error('请填写完整个人信息！');
                 return;
            }
            this.infoDisable = true;
            this.initWrite();
        },
         initWrite(){
            // 正式开始答题  ，初始化。
            this.settime = this.config.autoSave;
            this.setInterval = setInterval(()=>{
                if(this.settime>0){
                    this.settime--;
                    if(this.settime == 0){
                        this.autosubmit();
                    }
                }
            },1000);
        },
          autosubmit(){
            if(this.essay_or_snts != this.old_essay_or_snts && this.spss_countwords>this.config.minWord){
                this.old_essay_or_snts = this.essay_or_snts;
                this.goSubmit();
            }else{
                  this.settime = this.config.autoSave;
            }
        },
         goSubmit(state){
            if(state){
                if(this.spss_countwords<this.config.minWord){
                     this.$message.error(`正文内容请大于${this.config.minWord}个词`);
                    return;
                }
                clearInterval(this.setInterval);
            };
            let data = {
                essay_title:this.essay_title,
                essay_or_snts:this.essay_or_snts
            };
             if(this.config.info.name){
                 data.uid =this.uid;
            }
              if(this.config.info.number){
                 data.number =this.number;
            }
              if(this.config.info.class){
                 data.class =this.uclass;
            }
              if(this.config.info.profession){
                 data.profession =this.profession;
            }
            subWriteData(this.id,JSON.stringify(data)).then(res=>{
                console.log(res);
                this.settime = this.config.autoSave;
                if(state){
                    if(res.code == 1){
                        this.$message.success('提交成功！'); 
                    }else{
                        this.$message.error(res.msg);
                    }
                }
            }).catch(error=>{
                  this.settime = this.config.autoSave;
            })
          
        },
    },
    computed:{
        spss_countwords(){
                // 计算字数
                if(!this.essay_or_snts){
                    return 0;
                }
                let content='';
                content = this.essay_or_snts.trim();// $( "#"+id ).val());
                if(content == ''){
                    return 0;
                }else{
                    var arr = new Array();
                    arr = content.match(/([a-zA-Z'\d]+[a-zA-Z'\d-]*[a-zA-Z'\d]+|[a-zA-Z'\d]+)/g);
                    if(arr == null){
                        return 0;
                    }else{
                        return arr.length;
                    }
                }
            }
    },
}
</script>
<style lang="scss" scoped>
.write {
  width: 100%;
  margin: 0 auto;
  .topNav{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 18px;
      padding: 0px 30px;
      color: #999;
      background-color: rgba($color: #eee, $alpha: 1.0);
      i{
          font-size: 25px;
          cursor: pointer;
      }
      i:hover{
          color: #409eff;
      }
  }
  .card{
      margin: 15px 25px;
      font-size: 15px;
        .colright{
            text-align: right;
        }
        .colleft{
            text-align: left;
        }
  }
  .titlesW{
      margin: 15px auto;
  }
  #contentsW{
		border-radius: 5px;
		#contentsW_bar {
			background-color: #f6f7f8;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
			height: 35px;
			.contentsW_bar_left{
                text-align: left;
			    padding-left: 15px;
				font-size: 15px;
			    color: #8b9ec1;
			    line-height: 35px;
			    font-weight: bold;
			}
		}
		.textarea{
		    -webkit-appearance: none;
			border-left: 2px solid #f6f7f8; 
			border-right: 2px solid #f6f7f8; 
			// border-color: #3a3a2b #cccccc #cdcdcd #9a9a9a;
			border-top:none;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			color: #000000;
			display: inline-block;
			font-size: 16px;
			height: 500px;
			-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			width: 100%;
			background-color: #fff;
			background: url('https://www.pigai.org/res/css/mail_line.gif') repeat;
			line-height: 27px;
			outline: none;
			resize: none;
			padding: 0 12px;
		}
        .from_bar {
            height: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            background-color: #f6f7f8;
            border-width: 1px;
            border-style: solid;
            border-color: #f6f7f8;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            // border-color: #cdcdcd #cdcdcd #cdcdcd #9a9a9a;
            font-size: 14px;
            color: #8b9ec1;
        }
	}
    .footBtn{
        margin: 30px 0;
        text-align: right;
    }
}
</style>