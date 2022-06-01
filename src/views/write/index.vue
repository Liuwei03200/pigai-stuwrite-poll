<template>
    <div class="write">
        <div class="topNav"> 
            <div v-if="infoshow">
                完善个人信息
            </div>
            <div v-else>
                <template v-if="query  && query.uid">
                    姓名：{{query.uid}}
                </template>
                <template v-else>
                    姓名：{{info.uid}} 学号：{{info.num}} 班级：{{info.class}} 学校：{{info.school}} 
                </template>
            </div>
            <div>
                <i class="el-icon-s-home"></i>
            </div>
        </div>
        <el-card class="card" body-style="padding:15px 30px">
            <p class="rquest_text">{{rid}}号任务要求:</p>
            <div class="request_topic">
                <div v-html="essay_topic"></div>
            </div>
        </el-card>
        <el-card v-if="infoshow"  class="card" body-style="padding:15px 30px;">
            <el-form label-width="80px" style="width:400px;margin:0 auto">
                <el-form-item label="姓名">
                    <el-input v-model="info.uid"></el-input>
                </el-form-item>
                  <el-form-item label="学号">
                    <el-input v-model="info.num"></el-input>
                </el-form-item>
                  <el-form-item label="班级">
                    <el-input v-model="info.class"></el-input>
                </el-form-item>
                  <el-form-item label="学校">
                    <el-input v-model="info.school"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="startWrite">开始答题</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-else  class="card" body-style="padding:15px 30px;">
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
import {getRidRequest,xadd,saveData,getData} from "../../api/index"
export default {
    data(){
        return{
            rid:null,
            query:null,
            essay_topic:'',
            info:{
                uid:'',
                num:'',
                class:'',
                school:''
            },
            infoshow:false,
            essay_title:'',
            old_essay_or_snts:'',
            essay_or_snts:'',
            settime:10,
            setInterval:null
        }
    },
    created(){
        console.log(this.$route.query);
        if(this.$route.query.query!=undefined){
            this.query = JSON.parse(this.$route.query.query);
            this.rid = this.query.rid != undefined?this.query.rid:null;
        }
        if(this.rid == null){
            this.rid = this.$route.query.rid!= undefined? this.$route.query.rid:null;
            if(this.rid == null){
                this.$message.error('请传参rid！');
                this.$router.push('/')
                return;
            }
        }
        console.log(this.rid);
        if(this.query==null){
            this.infoshow = true;
        }else{
            if(this.query.uid == undefined){
                 this.infoshow = true;
            }else{
                this.initWrite();
            }
        }
        this.init();
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
    methods:{
        init(){
            this.getRequest();
            this.readData()
        },
        getRequest(){
            let posturl=null;
            if(this.query !=null){
                posturl = this.query.requestUrl!=undefined?this.query.requestUrl:null;
            }
             getRidRequest(this.rid,posturl).then(res=>{
                // console.log(res);
                if(res.error != 0){
                    this.$message.error(res.error_des);
                    return;
                }
                this.essay_topic = res.data.request.essay_topic;
            });
        },
        startWrite(){
            if(this.info.uid=='' || this.info.num=='' || this.info.class=='' || this.info.school==''){
                this.$message.error('请填写完整信息！');
                return
            }
            this.infoshow =false;
            this.initWrite();
        },
        initWrite(){
            // 正式开始答题  ，初始化。
            if(this.query !=null){
                this.settime = this.query.time!=undefined?this.query.time:10;
            }
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
            if(this.essay_or_snts != this.old_essay_or_snts){
                this.old_essay_or_snts = this.essay_or_snts;
                this.goSubmit();
            }else{
                if(this.query!=null){
                    this.settime = this.query.time!=undefined?this.query.time:10;
                }else{
                    this.settime =10;
                }
            }
        },
         goSubmit(state){
            if(state){
                clearInterval(this.setInterval);
            };
            let data = {
                rid:this.rid,
                essay_title:this.essay_title,
                essay_or_snts:this.essay_or_snts
            };
            // uid
            if(this.info.uid!=''){
                data.uid = this.info.uid;
                data.num = this.info.uid; 
                data.class = this.info.class;
                data.school = this.info.school;
            }else{
                data.uid = this.query.uid;
            }

            let postUrl = null;
            if(this.query!=null){
                postUrl = this.query.xaddUrl!=undefined?this.query.xaddUrl:null
            }
            // xadd(JSON.stringify(data), postUrl).then(res=>{
            //     console.log(res);
            //     if(this.query != null){
            //         this.settime = this.query.time!=undefined?this.query.time:10;
            //     }else{
            //          this.settime =10;
            //     }
            //     if(state){
            //         this.$message.success('提交成功！'); 
            //     }
            // }).catch(error=>{
            //       if(this.query != null){
            //         this.settime = this.query.time!=undefined?this.query.time:10;
            //     }else{
            //          this.settime =10;
            //     }
            // })
            saveData(JSON.stringify(data)).then(res=>{
                console.log(res);
            })
        },
        readData(){
            getData(4).then(res=>{
                console.log(JSON.parse(res.data));

            })
        }
    }
}
</script>
<style lang="scss">
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
      .rquest_text{
            text-align: left;
            margin: 0px;
      }
      .request_topic{
            display: flex;
            justify-content: center;
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