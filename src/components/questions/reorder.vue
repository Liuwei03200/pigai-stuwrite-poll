<template>
  <div class="reorder">
    <el-card class="info" shadow="hover">
      <p class="nav_bar">题目：</p>
      <p>
        {{ data.title }}
      </p>
      <p class="nav_bar">答题：</p>
      <div>
        <el-input
          type="textarea"
          :rows="5"
          :placeholder="data.input"
          v-model="textarea"
        >
        </el-input>
      </div>
      <div class="btn">
        <el-button type="primary" @click="subscore">提交</el-button>
      </div>
    </el-card>
    <el-card class="score" shadow="hover">
      <div class="nav_bar">分数：</div>
      <div class="circle" v-if="data.score!=undefined ">
        <el-progress stroke-width="10"  type="circle" :percentage="data.score*100" :format="formatScore" ></el-progress>
        <p v-if="data.score == 1">答对了，你真棒！</p>
        <p v-else>别灰心，继续努力！</p>
     </div>
      <div class="tips" v-else>答题后，点击提交查看分数</div>
    </el-card>
  </div>
</template>
<script>
import { getScore } from "@/api/index.js";
export default {
  data() {
    return {
      textarea: "",
    };
  },
  props: {
    data: {
      type: Object,
    },
  },
  created(){
        console.log(this.data.score);
  },
  methods: {
    subscore() {
      let data = this.data.score_input.replace("__input__", this.textarea);
      getScore(this.data.score_func, data).then((res) => {
        console.log(res);
        this.$emit('updateScore',res);
      });
    },
    formatScore(val){
      console.log(val);
      return val+'';
    }
  },
};
</script>
<style lang="scss">
.reorder {
  width: 100%;
  height: 100%;
  display: flex;
  text-align: left;
  padding: 0;
  .nav_bar {
    font-size: 18px;
    padding-left: 10px;
    border-left: 5px solid #409eff;
  }
  .info {
    flex: 3;
    height: 100%;
    margin-right: 5px;
    p {
      line-height: 150%;
      font-size: 16px;
    }
    .btn {
      margin: 15px;
      text-align: right;
    }
  }
  .score {
    flex: 2;
    margin-left: 5px;
    .tips, .circle {
      margin-top: 50px;
      text-align: center;
    }
  }
}
</style>
