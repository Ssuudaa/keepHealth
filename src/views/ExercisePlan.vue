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

      <h3 class="section-title">{{ getCategoryTitle }}</h3>
      <div class="plan-list">
        <el-card v-for="(plan, index) in displayedPlans" :key="index" class="plan-card">
          <div class="plan-title">{{ plan.EPlanName }}</div>
          <p>{{ plan.description }}</p>
          
          <el-button v-if="activeCategory !== '进行中的计划' && activeCategory !=='推荐计划'" class="list-button" type="primary" @click="editPlan(plan)">编辑</el-button>
          <el-button v-if="activeCategory !== '进行中的计划' && activeCategory !=='推荐计划'" class="list-button" type="danger" @click="deletePlan(plan)">删除</el-button>
          <el-button v-if="activeCategory !== '进行中的计划'" class="list-button" type="success" @click="confirmPlan(plan)">设为当前计划</el-button>
        </el-card>
      </div>

    </div>

    <el-dialog :visible.sync="dialogVisible" title="确认选择" width="40%">
      <p>你确定要设定<strong>{{ selectedPlan ? selectedPlan.planname : '' }}</strong>为你的运动计划吗？</p>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setMyPlan">确认</el-button>
      </span>
    </el-dialog>

    <!-- 右上角按钮 -->
    <div class="action-buttons">
      <el-button type="danger" @click="openExerciseDialog">添加自定义计划</el-button>
    </div>
    
     <!-- 运动计划选择组件 -->
     <SelectExercisePlan 
      ref="selectExercisePlan"
      @add-plan="fetchPlans"
    />
  </div>
</template>

<script>
import api from "@/api";
import SelectExercisePlan from "@/components/SelectExercisePlan.vue"; 

export default {
  components: {
    SelectExercisePlan,
  },
  data() {
    return {
      dialogVisible: false,
      editDialogVisible: false,
      selectedPlan: null,
      editedPlan: {},
      activeCategory: "进行中的计划",
      categories: ["进行中的计划", "推荐计划", "我的计划"],
      ongoingPlans: [],
      suggestedPlans: [],
      myPlans: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
    };
  },
  computed: {
    getCategoryTitle() {
      return this.activeCategory === "推荐计划" ? "🏆 推荐计划" : this.activeCategory === "进行中的计划" ? "⏳ 进行中的计划" : "📌 我的计划";
    },
    displayedPlans() {
      return this.activeCategory === "推荐计划" ? this.suggestedPlans : 
             this.activeCategory === "进行中的计划" ? this.ongoingPlans : 
             this.myPlans;
    }
  },
  methods: {
    async fetchPlans() {
      let apiUrl = "";
    if (this.activeCategory === "推荐计划") {
      apiUrl = "/ePlan/getSuggestPlan";
    } else if (this.activeCategory === "进行中的计划") {
      apiUrl = "/userCplan/get";
    } else {
      apiUrl = "/ePlan/list";
    }
    try {
      const response = await api.get(apiUrl, { params: { pageNum: this.currentPage, pageSize: this.pageSize } });
      if (this.activeCategory === "推荐计划") {
        this.suggestedPlans = response.data || [];
      } else if (this.activeCategory === "进行中的计划") {
        this.ongoingPlans = [response.data.EPlanVo]
      }else {
          this.myPlans = response.rows || [];
        }
        this.total = response.total;
      } catch (error) {
        console.error("获取计划失败", error);
      }
    },
    changeCategory(category) {
      this.activeCategory = category;
      this.fetchPlans();
    },
    async editPlan(plan) {
  try {
    const response = await api.get(`/ePlan/getDetail`, { params: { id: plan.id } });
    this.$refs.selectExercisePlan.openDialog(response.data); // 传递数据到组件
  } catch (error) {
    console.error("获取计划详情失败", error);
    this.$message.error("获取计划详情失败，请重试！");
  }
},
    async setAsCurrentPlan(plan) {
      try {
        await api.post("/ePlan/add", { planId: plan.id });
        this.ongoingPlans.push(plan);
        this.$message.success(`已设定 "${plan.EPlanName}" 为当前计划！`);
      } catch (error) {
        console.error("设定计划失败", error);
        this.$message.error("设定失败，请重试！");
      }
    },
    async deletePlan(plan) {
  try {
    await this.$confirm(`确定要删除 "${plan.EPlanName}" 吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await api.delete(`/ePlan/delete/${plan.id}`);
    this.fetchPlans();
    this.$message.success("计划已删除！");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除计划失败", error);
      this.$message.error("删除失败，请重试！");
    }
  }
},
    openExerciseDialog() {
      this.$refs.selectExercisePlan.openDialog(); // 传递数据到组件
    },
      confirmPlan(plan) {
      this.selectedPlan = plan;
      this.dialogVisible = true;
    },
    async setMyPlan() {
  try {
    await api.put(`/common/setcplanByeplan/${this.selectedPlan.id}`);
    console.log(this.selectedPlan.id)
    this.dialogVisible = false;
    this.$message.success("计划设定成功！");
    this.fetchPlans();
  } catch (error) {
    console.error("设定失败", error);
    this.$message.error("设定失败，请重试！");
  }
},
  },
  mounted() {
    this.fetchPlans();
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
.action-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}
.list-button {
  margin-top: 5px;
}

.action-buttons .el-button {
  min-width: 140px;
}
</style>
