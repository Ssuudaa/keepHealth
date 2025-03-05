<template>
    <div class="exercise-plan">
      <h2>💪 运动计划</h2>
  
      <!-- 运动计划列表 -->
      <div class="plan-list">
        <el-card 
          v-for="(plan, index) in plans" 
          :key="index" 
          class="plan-card"
        >
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
          <el-button type="primary" @click="selectPlan(plan)">设定为我的计划</el-button>
        </el-card>
      </div>
  
      <!-- 确认弹窗 -->
      <el-dialog title="确认设定" :visible.sync="dialogVisible" width="30%" >
        <p>是否设定 "{{ selectedPlan.title }}" 为你的运动计划？</p>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPlan">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialogVisible: false, // 控制弹窗
        selectedPlan: {}, // 选中的计划
        plans: [
          { title: "每日晨跑", description: "每天早晨跑步 30 分钟，提高心肺功能。" },
          { title: "健身房训练", description: "每周 3 次力量训练，增强肌肉力量。" },
          { title: "瑜伽拉伸", description: "每天 20 分钟瑜伽，提高柔韧性和放松身心。" }
        ]
      };
    },
    methods: {
      selectPlan(plan) {
        this.selectedPlan = plan;
        this.dialogVisible = true;
      },
      confirmPlan() {
        this.dialogVisible = false;
        this.$message.success(`已设定 "${this.selectedPlan.title}" 为你的运动计划！`);
      }
    }
  };
  </script>
  
  <style scoped>
  .exercise-plan {
    text-align: center;
    padding: 20px;
  }
  
  /* 运动计划列表 */
  .plan-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  /* 计划卡片 */
  .plan-card {
    width: 250px;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .plan-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  </style>
  