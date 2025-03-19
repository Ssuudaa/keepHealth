<template>
  <div class="diet-plans-container">
    <div class="sidebar">
      <h3>分类</h3>
      <ul>
        <li
          :class="{ active: selectedCategory === '进行中的计划' }"
          @click="selectCategory('进行中的计划')"
        >
          进行中的计划
        </li>
        <li
          :class="{ active: selectedCategory === '推荐计划' }"
          @click="selectCategory('推荐计划')"
        >
          推荐计划
        </li>
        <li
          :class="{ active: selectedCategory === '我的计划' }"
          @click="selectCategory('我的计划')"
        >
          我的计划
        </li>
      </ul>
    </div>

    <div class="diet-plans">
      <h2>🥗 {{ selectedCategory }}</h2>
      <div class="plan-list">
        <el-card v-for="(plan, index) in plans" :key="index" class="plan-card">
          <div class="plan-title">{{ plan.planName }}</div>
          <p>{{ plan.description }}</p>
          <div class="card-actions">
            <el-button style="margin-bottom: 10px;" type="success" @click="getPlanDetail(plan)">查看计划具体内容</el-button>

            <el-button
              v-if="selectedCategory === '推荐计划'"
              type="primary"
              @click="confirmPlan(plan)"
            >
              设定为我的计划
            </el-button>
            <el-button
              v-if="selectedCategory === '我的计划'"
              type="warning"
              @click="editPlan(plan)"
            >
              编辑
            </el-button>
            <el-button
              v-if="selectedCategory === '我的计划'"
              type="danger"
              @click="deletePlan(plan)"
            >
              删除
            </el-button>
            <el-button
              style="margin-top: 5px"
              v-if="selectedCategory === '我的计划'"
              type="primary"
              @click="confirmPlan(plan)"
            >
              设定为我的计划
            </el-button>
          </div>
        </el-card>
      </div>
      <div class="action-buttons">
        <el-button type="danger" @click="openMealDialog"
          >添加自定义计划</el-button
        >
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="确认选择" width="40%">
      <p>
        你确定要设定
        <strong>{{ selectedPlan ? selectedPlan.planName : "" }}</strong>
        为你的膳食计划吗？
      </p>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setMyPlan">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="detailDialogVisible" title="计划详情" width="50%">
      <div class="plan-detail-list">
        <el-card v-for="(item, index) in planDetails" :key="index" class="detail-card">
          <img :src="item.image" class="plan-image" />
          <div class="detail-title">{{ item.name }}</div>
        </el-card>
      </div>
    </el-dialog>
    <SelectMealPlan ref="selectMealPlan" @add-plan="fetchPlans" />
  </div>
</template>

<script>
import SelectMealPlan from "@/components/SelectMealPlan.vue";
import api from "../api";

export default {
  components: {
    SelectMealPlan, // 注册组件
  },
  data() {
    return {
      detailDialogVisible:false,
      dialogVisible: false,
      selectedPlan: null,
      selectedCategory: "我的计划",
      plans: [],
    };
  },
  watch: {
    selectedCategory: "fetchPlans",
  },
  mounted() {
    this.fetchPlans();
  },
  methods: {
    async fetchPlans() {
      let url = "";
      if (this.selectedCategory === "进行中的计划") {
        url = "/userCplan/get";
      } else if (this.selectedCategory === "推荐计划") {
        url = "/plan/getSuggestPlan";
      } else if (this.selectedCategory === "我的计划") {
        url = "/plan/list";
      }
      try {
        const response = await api.get(url);
        if (url === "/userCplan/get") {
          if (response.data && response.data.planVo) {
            this.$nextTick(() => {
              this.plans = [response.data.planVo];
            });
          }
        }
        if (url === "/plan/getSuggestPlan") {
          this.plans = response.data;
        } else {
          this.plans = response.rows;
        }
      } catch (error) {
        console.error("获取计划失败", error);
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    confirmPlan(plan) {
      this.selectedPlan = plan;
      this.dialogVisible = true;
    },
    async setMyPlan() {
      try {
        await api.put(`/common/setcplanByplan/${this.selectedPlan.id}`);
        console.log(this.selectedPlan.id);
        this.dialogVisible = false;
        this.$message.success("计划设定成功！");
        this.fetchPlans();
      } catch (error) {
        console.error("设定失败", error);
        this.$message.error("设定失败，请重试！");
      }
    },
    async editPlan(plan) {
  try {
    const response = await api.get(`/plan/getDetail`, { params: { id: plan.id } });
    if (response.code===200) {
      this.$refs.selectMealPlan.openDialog(response.data); // 传递数据到组件
    }
  } catch (error) {
    console.error("获取计划详情失败", error);
    this.$message.error("获取计划详情失败，请重试！");
  }
},
    openMealDialog() {
      console.log("打开添加计划对话框");
      this.$refs.selectMealPlan.openDialog(); // 传递数据到组件
    },
    async deletePlan(plan) {
  try {
    await this.$confirm(`确定要删除 "${plan.planName}" 计划吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await api.delete(`/plan/delete/${plan.id}`);
    this.fetchPlans();
    this.$message.success("计划已删除！");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除计划失败", error);
      this.$message.error("删除失败，请重试！");
    }
  }
},
async getPlanDetail(plan) {
      try {
        const response = await api.get(`/plan/getDetail`, { params: { id: plan.id } });
        this.planDetails = response.data.smalltypes.map(item => ({ name: item.name, image: item.image }));
        this.detailDialogVisible = true;
      } catch (error) {
        console.error("获取计划详情失败", error);
        this.$message.error("获取计划详情失败，请重试！");
      }
    },
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
.plan-detail-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; /* 控制卡片间距 */
  justify-content: center;
  padding: 10px;
  max-height: 500px; /* 避免超出 */
  overflow-y: auto; /* 允许滚动 */
}

.detail-card {
  width: 100%;
  text-align: center;
  padding: 10px;
  margin: 5px; /* 额外增加间距 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plan-image {
  width: 100px; /* 固定宽度 */
  height: 100px; /* 固定高度 */
  object-fit: cover; /* 防止图片变形 */
  border-radius: 5px;
}


.detail-title {
  margin-top: 10px;
  font-weight: bold;
}
</style>
