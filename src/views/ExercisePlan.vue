<template>
  <div class="container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <h3>分类</h3>
      <ul>
        <li 
          v-for="(category, index) in categories" 
          :key="index" 
          :class="{ active: activeCategory === category }"
          @click="changeCategory(category)"
        >
          {{ category }}
        </li>
      </ul>
    </div>
    
    <!-- 主要内容 -->
    <div class="content">
      <h2>💪 运动计划</h2>

      <h3 class="section-title">{{ activeCategory === "推荐计划" ? "🏆 推荐计划" : "📌 我的计划" }}</h3>
      <div class="plan-list">
        <el-card v-for="(plan, index) in displayedPlans" :key="index" class="plan-card">
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
          <el-button 
            v-if="activeCategory === '推荐计划'" 
            type="primary" 
            @click="selectPlan(plan)"
          >
            设定为我的计划
          </el-button>
          <el-button 
            v-else 
            type="danger" 
            @click="removePlan(plan)"
          >
            移除
          </el-button>
        </el-card>
      </div>
  
      <!-- 确认弹窗 -->
      <el-dialog title="确认设定" :visible.sync="dialogVisible" width="30%" >
        <p>是否设定 "{{ selectedPlan ? selectedPlan.title : '' }}" 为你的运动计划？</p>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPlan">确认</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 右上角按钮 -->
    <div class="action-buttons">
      <el-button type="danger" @click="openExerciseDialog">添加自定义计划</el-button>
    </div>
    
     <!-- 运动计划选择组件 -->
     <SelectExercisePlan 
      ref="selectExercisePlan"
      @add-plan="handleAddPlan"
    />
  </div>
</template>

<script>
import SelectExercisePlan from "@/components/SelectExercisePlan.vue"; 

export default {
  components: {
    SelectExercisePlan, // 注册组件
  },
  data() {
    return {
      dialogVisible: false,
      selectedPlan: null,
      activeCategory: "推荐计划",
      categories: ["进行中的计划","推荐计划", "我的计划"],
      plans: [
        { title: "每日晨跑", description: "每天早晨跑步 30 分钟，提高心肺功能。" },
        { title: "跳绳训练", description: "每日 15 分钟跳绳，提高协调性与燃脂。" },
        { title: "健身房力量训练", description: "每周 3 次力量训练，增强肌肉力量。" },
        { title: "深蹲 & 硬拉", description: "下半身力量训练，增强肌肉耐力。" },
        { title: "瑜伽拉伸", description: "每天 20 分钟瑜伽，提高柔韧性和放松身心。" }
      ],
      myPlans: [] // 存储用户选择的计划
    };
  },
  computed: {
    displayedPlans() {
      return this.activeCategory === "推荐计划" ? this.plans : this.myPlans;
    }
  },
  methods: {
    changeCategory(category) {
      this.activeCategory = category;
    },
    selectPlan(plan) {
      this.selectedPlan = plan;
      this.dialogVisible = true;
    },
    confirmPlan() {
      if (!this.myPlans.includes(this.selectedPlan)) {
        this.myPlans.push(this.selectedPlan);
      }
      this.dialogVisible = false;
      this.$message.success(`已设定 "${this.selectedPlan.title}" 为你的运动计划！`);
    },
    removePlan(plan) {
      this.myPlans = this.myPlans.filter(p => p !== plan);
      this.$message.warning(`已移除 "${plan.title}"`);
    },
    openExerciseDialog() {
      this.$refs.selectExercisePlan.dialogVisible = true;
    },
    handleAddPlan(plan) {
      this.myPlans.push({ title: plan.sport, description: plan.description });
      this.$message.success(`已添加 "${plan.sport}" 计划`);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  overflow-y: auto;
  position: relative;
}

.sidebar {
  width: 130px;
  background: rgba(91, 185, 200, 0.2);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  margin-bottom: 15px;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.sidebar li:hover, .sidebar li.active {
  background: #409eff;
  color: white;
}

.content {
  flex: 1;
  padding: 20px;
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
  color: #333;
  text-align: left;
}

.plan-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

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

.action-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.action-buttons .el-button {
  min-width: 140px;
}
</style>
