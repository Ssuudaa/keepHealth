<template>
    <div class="diet-plans">
      <h2>🥗 膳食计划</h2>
      
      <!-- 计划列表 -->
      <div class="plan-list">
        <el-card v-for="(plan, index) in plans" :key="index" class="plan-card">
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
          <el-button type="primary" @click="confirmPlan(plan)">设定为我的计划</el-button>
        </el-card>
      </div>
  
      <!-- 确认弹窗 -->
      <el-dialog :visible.sync="dialogVisible" title="确认选择" width="40%">
        <p>你确定要设定 <strong>{{ selectedPlan ? selectedPlan.title : '' }}</strong> 为你的膳食计划吗？</p>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="setMyPlan">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialogVisible: false, // 控制弹窗
        selectedPlan: null, // 选中的计划
        plans: [
          { title: "健康轻食", description: "高蛋白低脂肪，适合减脂人群。" },
          { title: "增肌饮食", description: "高热量高蛋白，适合增肌训练者。" },
          { title: "均衡膳食", description: "全面营养，适合日常健康饮食。" },
        ],
      };
    },
    methods: {
      confirmPlan(plan) {
        this.selectedPlan = plan;
        this.dialogVisible = true;
      },
      setMyPlan() {
        console.log("已设定膳食计划：", this.selectedPlan);
        this.dialogVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .diet-plans {
    text-align: center;
    padding: 20px;
  }
  
  .plan-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .plan-card {
    width: 250px;
    padding: 15px;
    text-align: center;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .plan-card:hover {
    transform: scale(1.05);
  }
  
  .plan-title {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  