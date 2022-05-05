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
      <div class="tips">答题后，点击提交查看分数</div>
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
  methods: {
    subscore() {
      let data = this.data.score_input.replace("__input__", this.textarea);
      getScore(this.data.score_func, data).then((res) => {
        console.log(res);
      });
    },
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
    .tips {
      margin-top: 50px;
      text-align: center;
    }
  }
}
</style>
