<template>
  <div class="diet-plans-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <h3>分类</h3>
      <ul>
        <li :class="{ active: selectedCategory === '进行中的计划' }" @click="selectCategory('进行中的计划')">
          进行中的计划
        </li>
        <li :class="{ active: selectedCategory === '推荐计划' }" @click="selectCategory('推荐计划')">
          推荐计划
        </li>
        <li :class="{ active: selectedCategory === '我的计划' }" @click="selectCategory('我的计划')">
          我的计划
        </li>
      </ul>
    </div>

    <!-- 主要内容区域 -->
    <div class="diet-plans">
      <h2 v-if="selectedCategory === '推荐计划'">🥗 推荐计划</h2>
      <h2 v-if="selectedCategory === '我的计划'">🥗 我的计划</h2>
      <h2 v-if="selectedCategory === '进行中的计划'">🥗 进行中的计划</h2>
      <div class="plan-list">
        <el-card v-for="(plan, index) in filteredPlans" :key="index" class="plan-card">
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
          <el-button v-if="selectedCategory === '推荐计划'" type="primary" @click="confirmPlan(plan)">
            设定为我的计划
          </el-button>
        </el-card>
      </div>
      <div class="action-buttons">
      <el-button type="danger" @click="openMealDialog">添加自定义计划</el-button>
    </div>
    </div>

    <!-- 确认弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="确认选择" width="40%">
      <p>
        你确定要设定 <strong>{{ selectedPlan ? selectedPlan.title : "" }}</strong> 为你的膳食计划吗？
      </p>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setMyPlan">确认</el-button>
      </span>
    </el-dialog>
    
     <!-- 运动计划选择组件 -->
     <SelectMealPlan
      ref="selectMealPlan"
    />
  </div>
</template>

<script>
import SelectMealPlan from "@/components/SelectMealPlan.vue"; 

export default {
  components: {
    SelectMealPlan, // 注册组件
  },
  data() {
    return {
      dialogVisible: false,
      selectedPlan: null,
      selectedCategory: "推荐计划", // 默认选中推荐计划
      plans: [
        { title: "低脂高蛋白餐", description: "适合减脂人士。", isMyPlan: false },
        { title: "轻食沙拉餐", description: "新鲜蔬菜搭配优质蛋白。", isMyPlan: false },
        { title: "高热量增肌餐", description: "帮助肌肉生长和恢复。", isMyPlan: false },
        { title: "力量训练餐", description: "专为健身者设计的膳食。", isMyPlan: false },
        { title: "均衡营养套餐", description: "适合日常健康饮食。", isMyPlan: false },
        { title: "家庭健康餐", description: "营养均衡，适合全家享用。", isMyPlan: false },
        { title: "我的减肥餐", description: "为我专门定制的减肥餐。", isMyPlan: true },
        { title: "我的增肌餐", description: "适合我增肌的膳食。", isMyPlan: true },
      ],
    };
  },
  computed: {
    filteredPlans() {
      return this.plans.filter((plan) => plan.isMyPlan === (this.selectedCategory === "我的计划"));
    },
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category;
    },
    confirmPlan(plan) {
      this.selectedPlan = plan;
      this.dialogVisible = true;
    },
    setMyPlan() {
      this.selectedPlan.isMyPlan = true;
      this.dialogVisible = false;
    },
    openMealDialog(){
      this.$refs.selectMealPlan.dialogVisible=true
    }

  },
};
</script>

<style scoped>
.diet-plans-container {
  display: flex;
  height: 100vh;
  overflow-y: auto;
}

.sidebar {
  flex-shrink: 0;
  width: 130px;
  background-color: rgba(91, 185, 200, 0.2);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  text-align: center;
  margin-bottom: 15px;
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

.sidebar li:hover,
.sidebar li.active {
  background: #409eff;
  color: white;
}

.diet-plans {
  position: relative;
  flex-grow: 1;
  padding: 20px;
  text-align: center;
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
