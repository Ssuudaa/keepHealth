<template>
  <div class="diet-plans-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <h3>分类</h3>
      <ul>
        <li
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </li>
      </ul>
    </div>

    <!-- 主要内容区域 -->
    <div class="diet-plans">
      <h2>🥗 推荐计划</h2>
      <div class="plan-list">
        <el-card
          v-for="(plan, index) in filteredRecommendedPlans"
          :key="index"
          class="plan-card"
        >
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
          <el-button type="primary" @click="confirmPlan(plan)"
            >设定为我的计划</el-button
          >
        </el-card>
      </div>

      <h2>🥗 我的计划</h2>
      <div class="plan-list">
        <el-card
          v-for="(plan, index) in filteredMyPlans"
          :key="index"
          class="plan-card"
        >
          <div class="plan-title">{{ plan.title }}</div>
          <p>{{ plan.description }}</p>
        </el-card>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="确认选择" width="40%">
      <p>
        你确定要设定
        <strong>{{ selectedPlan ? selectedPlan.title : "" }}</strong>
        为你的膳食计划吗？
      </p>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setMyPlan">确认</el-button>
      </span>
    </el-dialog>

    <!-- 右上角按钮 -->
    <div class="action-buttons">
      <el-button type="danger" @click="goToUserMeal">添加自定义计划</el-button>
      <!-- <el-button type="success" @click="checkInDaily">计划每天打卡</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 控制弹窗
      selectedPlan: null, // 选中的计划
      selectedCategory: "全部", // 默认选中分类
      categories: ["全部", "健康轻食", "增肌饮食", "均衡膳食"], // 计划分类
      plans: [
        {
          title: "低脂高蛋白餐",
          description: "适合减脂人士。",
          category: "健康轻食",
          isMyPlan: false,
        },
        {
          title: "轻食沙拉餐",
          description: "新鲜蔬菜搭配优质蛋白。",
          category: "健康轻食",
          isMyPlan: false,
        },
        {
          title: "高热量增肌餐",
          description: "帮助肌肉生长和恢复。",
          category: "增肌饮食",
          isMyPlan: false,
        },
        {
          title: "力量训练餐",
          description: "专为健身者设计的膳食。",
          category: "增肌饮食",
          isMyPlan: false,
        },
        {
          title: "均衡营养套餐",
          description: "适合日常健康饮食。",
          category: "均衡膳食",
          isMyPlan: false,
        },
        {
          title: "家庭健康餐",
          description: "营养均衡，适合全家享用。",
          category: "均衡膳食",
          isMyPlan: false,
        },
        {
          title: "我的减肥餐",
          description: "为我专门定制的减肥餐。",
          category: "健康轻食",
          isMyPlan: true,
        },
        {
          title: "我的增肌餐",
          description: "适合我增肌的膳食。",
          category: "增肌饮食",
          isMyPlan: true,
        },
      ],
    };
  },
  computed: {
    // 过滤推荐计划
    filteredRecommendedPlans() {
      return this.plans.filter(
        (plan) =>
          !plan.isMyPlan &&
          (this.selectedCategory === "全部" ||
            plan.category === this.selectedCategory)
      );
    },
    // 过滤我的计划
    filteredMyPlans() {
      return this.plans.filter(
        (plan) =>
          plan.isMyPlan &&
          (this.selectedCategory === "全部" ||
            plan.category === this.selectedCategory)
      );
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
      this.selectedPlan.isMyPlan = true; // 将选中的计划设为我的计划
      console.log("已设定膳食计划：", this.selectedPlan);
      this.dialogVisible = false;
    },
    goToUserMeal() {
      this.$router.push("/user/setMeal"); // 这里可以添加自定义计划的功能
    },
    checkInDaily() {
      console.log("计划每天打卡");
      // 这里可以添加每天打卡的功能
    },
  },
};
</script>

<style scoped>
.diet-plans-container {
  display: flex;
  height: 100vh;
  overflow-y: auto;
  /* 添加这行，确保容器内容超出时会滚动 */
  position: relative; /* 添加相对定位，以便绝对定位按钮 */
}

.sidebar {
  flex-shrink: 0;
  width: 130px;
  background: #f5f5f5;
  padding: 20px;
  background-color: rgba(91, 185, 200, 0.2);
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

.sidebar li:hover,
.sidebar li.active {
  background: #409eff;
  color: white;
}

.diet-plans {
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

.plan-title {
  font-size: 18px;
  font-weight: bold;
}

/* 右上角按钮样式 */
.action-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.action-buttons .el-button {
  min-width: 120px; /* 设置按钮最小宽度 */
}
</style>
