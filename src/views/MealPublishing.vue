<template>
  <div class="diet-plan-management">
    <SelectMealPlan ref="selectMealPlan" @add-plan="fetchDietPlans" />

    <!-- 搜索框 -->
    <!-- <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索计划名称"
        class="search-input"
      />
      <el-button @click="searchDietPlan" type="primary" icon="el-icon-search"
        >搜索</el-button
      >
      <el-button @click="resetFilters" type="warning">重置</el-button>
    </div> -->

    <!-- 新增膳食计划按钮 -->
    <el-button @click="addDietPlan" type="primary" class="add-button"
      >新增膳食计划</el-button
    >

    <!-- 膳食计划表格 -->
    <el-table :data="currentPageDietPlans" border>
      <el-table-column prop="planName" label="计划名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="content" label="计划内容" />
      <el-table-column label="状态" :formatter="formatStatus" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editDietPlan(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            :type="Number(scope.row.status) === 1 ? 'danger' : 'success'"
            @click="toggleStatus(scope.row)"
          >
            {{ Number(scope.row.status) === 1 ? "停用" : "启用" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :total="filteredDietPlans.length"
      :current-page="currentPage"
      @current-change="handlePageChange"
      layout="prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import api from "../api";
import SelectMealPlan from "@/components/SelectMealPlan.vue";

export default {
  components: {
    SelectMealPlan, // 注册组件
  },
  data() {
    return {
      dietPlans: [], // 从 API 获取的膳食计划数据
      searchQuery: "",
      filteredDietPlans: [],
      currentPageDietPlans: [],
      pageSize: 10,
      currentPage: 1,
      isEditDialogVisible: false,
      currentDietPlan: {},
    };
  },
  mounted() {
    this.fetchDietPlans();
  },
  methods: {
    async fetchDietPlans() {
      try {
        // 获取推荐的膳食计划
        const response = await api.get("/plan/list");
        if (response.code === 200) {
          this.currentPageDietPlans = response.rows;

          // 遍历每个膳食计划，依次获取详情
          for (let plan of this.currentPageDietPlans) {
            try {
              const detailResponse = await api.get(`/plan/getDetail`, {
                params: { id: plan.id },
              });

              if (detailResponse.code === 200 && detailResponse.data) {
                const smalltypes = detailResponse.data.smalltypes || [];
                this.$set(
                  plan,
                  "content",
                  smalltypes.length > 0
                    ? smalltypes.map((item) => item.name).join("，")
                    : "无内容"
                );
              } else {
                plan.content = "无内容";
              }
            } catch (detailError) {
              console.error(`获取 ID ${plan.id} 详情失败:`, detailError);
              plan.content = "加载失败";
            }
          }

          console.log(this.currentPageDietPlans);
        }
      } catch (error) {
        console.error("获取膳食计划失败:", error);
      }
    },
    async editDietPlan(plan) {
      try {
        const response = await api.get(`/plan/getDetail`, {
          params: { id: plan.id },
        });
        if (response.data) {
          this.$refs.selectMealPlan.openDialog(response.data); // 传递数据到组件
        }
      } catch (error) {
        console.error("获取计划详情失败", error);
        this.$message.error("获取计划详情失败，请重试！");
      }
    },
    saveDietPlan() {
      this.isEditDialogVisible = false;
    },
    addDietPlan() {
      console.log("打开添加计划对话框");
      this.$refs.selectMealPlan.openDialog(); // 传递数据到组件
    },
    async toggleStatus(plan) {
  try {
    const apiUrl = plan.status === "0" ? "/admin/setsuggestplan" : "/admin/removesuggestplan";
    
    const response = await api.put(apiUrl, null, { params: { id: plan.id } });

    if (response.code === 200) {
      plan.status = plan.status === "0" ? "1" : "0"; // 直接切换状态
      this.$message.success(`计划已${plan.status === "1" ? "启用" : "停用"}`);
    } else {
      this.$message.error("操作失败，请重试");
    }
  } catch (error) {
    console.error("状态切换失败:", error);
    this.$message.error("状态切换失败");
  }
},
formatStatus(row) {
    return Number(row.status) === 1 ? "已启用" : "未启用";
  }
  },
};
</script>

<style scoped>
.diet-plan-management {
  padding: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
}
.search-input {
  margin-right: 20px;
  width: 200px;
}
.add-button {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>