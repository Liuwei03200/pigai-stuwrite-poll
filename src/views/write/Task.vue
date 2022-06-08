<template>
  <div class="task" v-if="publish">
    <div v-if="item == 1">
      <el-card class="card">
        <div v-if="showTimeAlert">
          <p>任务 {{ id }}</p>
          <p>
            开始时间：{{ timeformat(this.publish.config.startTime) }} ——
            结束时间：{{ timeformat(this.publish.config.endTime) }}
          </p>
        </div>
        <div class="intro" v-else>
          <p class="title">{{ publish.intro.title }}</p>
          <p class="ftitle">任务号：{{ id }}</p>
          <p class="info" v-html="publish.intro.info"></p>
          <div class="me" v-if="publish.config.info.show == false">
            <p>完善个人信息：</p>
            <el-form label-width="80px" style="width: 400px; margin: 0 auto">
              <el-form-item label="姓名" v-if="publish.config.info.name">
                <el-input v-model="user.uid"></el-input>
              </el-form-item>
              <el-form-item label="学号" v-if="publish.config.info.number">
                <el-input v-model="user.number"></el-input>
              </el-form-item>
              <el-form-item label="班级" v-if="publish.config.info.class">
                <el-input v-model="user.class"></el-input>
              </el-form-item>
              <el-form-item label="专业" v-if="publish.config.info.profession">
                <el-input v-model="user.profession"></el-input>
              </el-form-item>
              <el-form-item label="学校" v-if="publish.config.info.school">
                <el-input v-model="user.school"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="nextBtn">
            <el-button type="primary" @click="startWrite()">做任务</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class="content" v-else>
      <el-card class="card">
        <div class="contentCard">
          <div style="flex: 1">
            <div v-for="(v, n) in content" :key="n">
              <template
                v-if="publish.config.onePage == true ? n == contentNum : true"
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <p class="title">{{ n + 1 }}. 写作</p>
                  <div style="margin-right: 20px">
                    <template
                      v-if="
                        publish.config.onePage == true && content.length > 1
                      "
                    >
                      <el-button
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-arrow-left"
                        circle
                        @click="contentNum > 0 ? contentNum-- : false"
                      >
                      </el-button>
                      <el-button
                        type="primary"
                        plain
                        size="mini"
                        icon="el-icon-arrow-right"
                        circle
                        @click="
                          contentNum < content.length - 1 ? contentNum++ : false
                        "
                      >
                      </el-button>
                    </template>
                  </div>
                </div>
                <div>
                  <el-card
                    class="card request"
                    shadow="hover"
                    body-style="padding:15px 20px;"
                  >
                    <p>要求：</p>
                    <div>
                      <p style="text-align: center">
                        {{ publish.content[n].title }}
                      </p>
                      <p style="text-align: left; text-indent: 10px">
                        {{ publish.content[n].request }}
                      </p>
                    </div>
                  </el-card>
                  <el-card
                    class="card"
                    shadow="hover"
                    body-style="padding:15px;"
                  >
                    <div class="titlesW">
                      <el-input
                        v-model="content[n].essay_title"
                        placeholder="请输入标题"
                      ></el-input>
                    </div>
                    <div id="contentsW">
                      <div id="contentsW_bar">
                        <div class="contentsW_bar_left">请在下方写入 正文</div>
                        <div class="contentsW_bar_right">
                          {{ publish.config.allTime }}分钟后自动提交：{{
                            alltimeSecond
                          }}（秒）
                        </div>
                      </div>
                      <textarea
                        style="margin-bottom: -5px"
                        placeholder="请输入正文......."
                        class="textarea content_line"
                        cols="70"
                        rows="10"
                        v-model="content[n].essay_or_snts"
                      ></textarea>
                      <!-- 草稿自动保存底部栏 -->
                      <div class="from_bar">
                        <div>
                          <span
                            >字数:<span id="init_wc"
                              >{{ spss_countwords(content[n].essay_or_snts) }}
                            </span>
                            词</span
                          >
                          &nbsp;
                        </div>
                        <div class="fr">
                          <span>{{ settime }} 秒后保存</span>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </template>
            </div>
            <div class="footBtn">
              <el-button v-if="isDone" type="success" disabled
                >已完成答题</el-button
              >
              <el-button v-else type="primary" @click="goSubmit(true)"
                >提交</el-button
              >
            </div>
          </div>
          <div class="answerCard" v-if="publish.config.showCard">
            <!-- 答题卡 -->
            <p>答题卡：</p>
            <div style="display: flex; flex-wrap: wrap">
              <div
                class="answerItem"
                :class="isshowAnswerColor(n)"
                @click="contentNum = n"
                v-for="(v, n) in content.length"
                :key="v"
              >
                {{ v }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getData, subWriteData } from "../../api/index";
export default {
  data() {
    return {
      item: 1,
      showTimeAlert: false,
      id: -1,
      publish: null,
      user: {
        uid: "", // 等于name
        number: "",
        class: "",
        profession: "",
        school: "",
      },
      content: null,
      oldContent: "",
      contentNum: 0,
      settime: 10,
      setInterval: null, //
      alltimeSecond: 0, // 设置了时间限制 秒
      alltimeSetInterval: null, // 时间倒计时；
      isDone: false, // 是否已经完成答题。
    };
  },
  created() {
    this.id = this.$route.query.id;
    if (this.id == undefined || this.id == null) {
      this.$message.error("请填写正确链接进行答题！");
      return;
    }
    this.init();
  },
  methods: {
    init() {
      this.getDataFunc();
    },
    getDataFunc() {
      console.log(this.id);
      getData(this.id).then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.publish = JSON.parse(res.data);
        console.log(this.publish);
        //判断是否到了开始时间
        if (this.publish.config.startTime > Date.now()) {
          this.$message.error("未到开始时间！");
          this.showTimeAlert = true;
        }
        //判断是否到了截止时间
        if (Date.now() > this.publish.config.endTime) {
          this.$message.error("任务已截止！");
          this.showTimeAlert = true;
        }
        //判断是否需要登录
        // if(this.config.info.show == true){
        //     this.changePigaiLogin();
        // }
      });
    },
    startWrite() {
      if (this.publish.config.info.name && this.user.uid == "") {
        this.$message.error("请填写完整个人信息！");
        return;
      }
      if (this.publish.config.info.number && this.user.number == "") {
        this.$message.error("请填写完整个人信息！");
        return;
      }
      if (this.publish.config.info.class && this.user.class == "") {
        this.$message.error("请填写完整个人信息！");
        return;
      }
      if (this.publish.config.info.profession && this.user.profession == "") {
        this.$message.error("请填写完整个人信息！");
        return;
      }
      if (this.publish.config.info.school && this.user.school == "") {
        this.$message.error("请填写完整个人信息！");
        return;
      }
      //初始化 答题内容
      let arr = [];
      for (let key in this.publish.content) {
        let obj = {
          essay_title: "",
          essay_or_snts: "",
          type: this.publish.content[key].type,
        };
        arr.push(obj);
      }
      this.content = arr;
      this.oldContent = JSON.stringify(arr);

      // 切换写作页面
      this.item = 2;
      this.initWrite();
    },
    initWrite() {
      this.settime = this.publish.config.autoSave;
      this.setInterval = setInterval(() => {
        if (this.settime > 0) {
          this.settime--;
          if (this.settime == 0) {
            this.autosubmit();
          }
        }
      }, 1000);
      // 如果设置了答题时限，需要在时限内答题。
      if (this.publish.config.allTime != 0) {
        this.alltimeSecond = this.publish.config.allTime * 60;
        this.alltimeSetInterval = setInterval(() => {
          this.alltimeSecond--;
          if (this.alltimeSecond == 0) {
            this.goSubmit(true);
          }
        }, 1000);
      }
    },
    autosubmit() {
      if (JSON.stringify(this.constent) != this.oldContent) {
        this.oldContent = JSON.stringify(this.constent);
        this.goSubmit();
      } else {
        this.settime = this.publish.config.autoSave;
      }
    },
    goSubmit(state) {
      if (state) {
        // 字数限制 最大词最小词
        for (let key in this.content) {
          if (
            this.spss_countwords(this.content[key].essay_or_snts) <
            this.publish.content[key].minWord
          ) {
            this.$message.error(
              `第${Number(key) + 1}题正文内容请大于${
                this.publish.content[key].minWord
              }个词`
            );
            return;
          }
          if (
            this.spss_countwords(this.content[key].essay_or_snts) >
            this.publish.content[key].maxWord
          ) {
            this.$message.error(
              `第${Number(key) + 1}题正文内容请小于${
                this.publish.content[key].maxWord
              }个词`
            );
            return;
          }
        }
        clearInterval(this.setInterval);
        clearInterval(this.alltimeSetInterval);
      }
      let successAlert = false;
      let promiseall = [];
      for (let key in this.content) {
        let data = {
          content: this.content[key],
          user: this.user,
          rid: this.id,
          tid: key,
          uid: this.user.uid,
          essay_or_snts: this.content[key].essay_or_snts,
          type: this.content[key].type,
        };
        promiseall[key] = subWriteData(
          `${this.id}-${key}`,
          JSON.stringify(data)
        );
      }
      Promise.all(promiseall)
        .then((res) => {
          console.log(res);
          this.settime = this.publish.config.autoSave;
          if (state) {
            if (res[0].code == 1) {
              this.$message.success("提交成功！");
              this.isDone = true;
            } else {
              this.$message.error(res.msg);
            }
          }
        })
        .catch((error) => {
          this.settime = this.publish.config.autoSave;
        });
    },
    spss_countwords(text) {
      // 计算字数
      if (!text) {
        return 0;
      }
      let content = "";
      content = text.trim(); // $( "#"+id ).val());
      if (content == "") {
        return 0;
      } else {
        var arr = new Array();
        arr = content.match(
          /([a-zA-Z'\d]+[a-zA-Z'\d-]*[a-zA-Z'\d]+|[a-zA-Z'\d]+)/g
        );
        if (arr == null) {
          return 0;
        } else {
          return arr.length;
        }
      }
    },
    isshowAnswerColor(n) {
      if (this.content[n].essay_or_snts != "") {
        return "darkColor";
      }
    },
    timeformat(time) {
      // 格式化时间
      const date = new Date(time);
      const Y = date.getFullYear();
      const M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const D = date.getDate();
      const H = date.getHours(); // 小时
      const Mi = date.getMinutes(); // 分钟
      const S = date.getSeconds(); // 秒
      return `${Y}-${M}-${D} ${H}:${Mi}:${S}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.task {
  .intro {
    display: inline-block;
    padding: 50px;
    p {
      margin: 10px;
      line-height: 150%;
    }
    .title {
      font-size: 18px;
    }
    .ftitle {
      font-size: 14px;
    }
    .info {
      margin-top: 30px;
      text-align: left;
      white-space: pre;
    }
    .me {
      margin-top: 50px;
      & > p {
        text-align: left;
        margin-bottom: 15px;
      }
    }
    .nextBtn {
      margin-top: 50px;
    }
  }
  .content {
    text-align: left;
    .contentCard {
      display: flex;
    }
    .answerCard {
      width: 100px;
      padding: 0 10px;
      .answerItem {
        width: 40px;
        height: 40px;
        background-color: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        font-size: 18px;
        margin: 10px;
        cursor: pointer;
      }
      .darkColor {
        background-color: #81cbfa;
        color: #fff;
      }
    }
    .title {
      padding: 0 15px;
      font-size: 18px;
      border-left: 3px solid #4b97d7;
    }
    .titlesW {
      margin: 15px auto;
    }
    #contentsW {
      border-radius: 5px;
      #contentsW_bar {
        background-color: #f6f7f8;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        height: 35px;
        display: flex;
        justify-content: space-between;
        .contentsW_bar_left {
          text-align: left;
          padding-left: 15px;
          font-size: 15px;
          color: #8b9ec1;
          line-height: 35px;
          font-weight: bold;
        }
        .contentsW_bar_right {
          text-align: right;
          padding-right: 15px;
          font-size: 15px;
          color: #8b9ec1;
          line-height: 35px;
          font-weight: bold;
        }
      }
      .textarea {
        -webkit-appearance: none;
        border-left: 2px solid #f6f7f8;
        border-right: 2px solid #f6f7f8;
        // border-color: #3a3a2b #cccccc #cdcdcd #9a9a9a;
        border-top: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #000000;
        display: inline-block;
        font-size: 16px;
        height: 500px;
        -webkit-transition: border-color 0.2s
          cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        background-color: #fff;
        background: url("https://www.pigai.org/res/css/mail_line.gif") repeat;
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
    .footBtn {
      margin: 30px 10px;
      text-align: right;
    }
  }
}
.card {
  margin: 10px;
  // min-height: 300px;
  .request {
    p {
      margin: 5px;
    }
  }
}
</style>
