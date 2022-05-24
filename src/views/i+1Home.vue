<template>
  <div class="home">
    <div class="header">
      <img src="../assets/logo.png" alt="" srcset="" />
      <p class="webName">
        <span> i+1课堂</span>
        <!-- <span class="clickSpan span1 nowView">同写</span>
        <span class="clickSpan" @click="pushView('/allAssess')">共评</span>
        <span class="clickSpan" @click="pushView('/allAssess')">分学</span> -->
      </p>
    </div>
    <div class="content">
      <div class="card">
        <el-card class="box-card" body-style="padding:15px;">
          <div slot="header" class="box-header">
            <div class="name" v-if="tidsData && intro">
              第{{ num + 1 }}题 {{ typeName[tidsData[intro.tids[num]].type] }}
            </div>
            <div>00:00:00</div>
            <div class="btns">
              <el-button type="primary" @click="setChooseTid(0)">
                上一题
              </el-button>
              <el-button type="primary" @click="setChooseTid(1)">
                下一题
              </el-button>
              <!-- <el-button type="primary">【】</el-button> -->
            </div>
          </div>
          <div class="info">
            <div style="height: 100%" v-if="tidsData">
              <template v-for="(v, k, n) in tidsData" v-if="n == num">
                <Reorder v-if="v.type == 'reorder'" :data="v" @updateScore="updateScore" />
              </template>
            </div>
            <!-- <Score
                v-if="tids[chooseTid] == 'scoring'"
                :rid="rid"
                :tid="chooseTid"
              />
              <Select
                v-if="tids[chooseTid] == 'select'"
                :rid="rid"
                :tid="chooseTid"
              />
              <Underline
                v-if="tids[chooseTid] == 'underline'"
                :rid="rid"
                :tid="chooseTid"
              />
              <Polish
                v-if="tids[chooseTid] == 'polish'"
                :rid="rid"
                :tid="chooseTid"
              />
              <Reorder
                v-if="tids[chooseTid] == 'reorder'"
                :rid="rid"
                :tid="chooseTid"
              />
              <Sntupgrade
                v-if="tids[chooseTid] == 'sntupgrade'"
                :rid="rid"
                :tid="chooseTid"
              /> -->
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { geRidIntro, geRidTids } from "@/api/index.js";
import Reorder from "../components/questions/reorder.vue";
export default {
  name: "Home",
  data() {
    return {
      rid: "2642549",
      num: 0, //当前tid
      tidsData: null, // 当前rid 的所有tid信息
      intro: {
        tids: null,
        mode: "step",
        title: "",
      },
      typeName: {
        select: "选择",
        scoring: "打分",
        underline: "划词",
        polish: "润色",
        reorder: "连词成句",
        sntupgrade: "句式升格",
      },
    };
  },
  components: { Reorder },
  created() {
    this.init();
  },
  methods: {
    setChooseTid(n) {},
    // 初始化 获取两个接口
    async init() {
      await this.geRidIntroFunc();
      this.geRidTidsFunc();
    },
    geRidIntroFunc() {
      return geRidIntro(this.rid).then((res) => {
        this.intro.tids = JSON.parse(res.tids);
        this.intro.title = res.title;
        this.intro.mode = res.mode;
        return true;
      });
    },
    geRidTidsFunc() {
      geRidTids(this.rid).then((res) => {
        let data = {};
        for (let value of res) {
          data[value.tid + ""] = value;
        }
        console.log(data);
        this.tidsData = data;
      });
    },
    updateScore(val){
      this.$set(this.tidsData[this.intro.tids[this.num]],'score',val);
      // this.tidsData[this.intro.tids[this.num]].score = val;
      console.log(this.tidsData);
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  margin: 0 auto;
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
.content {
  display: flex;
  justify-content: center;
  .card {
    padding: 15px 30px;
    //width: 96vw;
    flex: 6;
    .box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-weight: 700;
        padding-left: 10px;
        border-left: 5px solid #409eff;
      }
      .btns {
        display: flex;
        button {
          font-size: 20px;
          //font-weight: 700;
          padding: 6px 14px;
        }
      }
    }
    .info {
      padding: 5px 15px;
      height: 78vh;
    }
  }
  .logs {
    flex: 1;
    padding: 15px 0px;
  }
}
</style>
