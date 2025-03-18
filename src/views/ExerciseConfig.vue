<template>
  <div class="exercise-plan-management">
    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索计划名称"
        class="search-input"
      />
      <el-button
        @click="searchExercisePlan"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button @click="resetFilters" type="warning">重置</el-button>
    </div>

    <el-button @click="addExercisePlan()" type="primary" class="add-button"
      >新增运动计划</el-button
    >

    <!-- 运动计划表格 -->
    <el-table :data="currentPageExercisePlans" border>
      <el-table-column prop="EPlanName" label="计划名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="content" label="计划内容" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ Number(scope.row.status) === 0 ? "已停用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editExercisePlan(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            :type="Number(scope.row.status) === 0 ? 'success' : 'danger'"
            @click="toggleStatus(scope.row)"
          >
            {{ Number(scope.row.status) === 0 ? "启用" : "停用" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :total="filteredExercisePlans.length"
      :current-page="currentPage"
      @current-change="handlePageChange"
      layout="prev, pager, next, jumper"
    />
    <SelectExercisePlan
      ref="selectExercisePlan"
      @add-plan="fetchExercisePlans"
    />
  </div>
</template>

<script>
import api from "../api";
import SelectExercisePlan from "@/components/SelectExercisePlan.vue";

export default {
  components: {
    SelectExercisePlan,
  },
  data() {
    return {
      exercisePlans: [],
      searchQuery: "",
      filteredExercisePlans: [],
      currentPageExercisePlans: [],
      pageSize: 10,
      currentPage: 1,
    };
  },
  async mounted() {
    await this.fetchExercisePlans();
  },
  methods: {
    // 获取运动计划数据
    async fetchExercisePlans() {
      try {
        const response = await api.get("/ePlan/list");
        if (response.code === 200) {
          this.currentPageExercisePlans = response.rows;
          for (let plan of this.currentPageExercisePlans) {
            try {
              const detailResponse = await api.get(`/ePlan/getDetail`, {
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

    // 搜索过滤
    searchExercisePlan() {
      this.filteredExercisePlans = this.exercisePlans.filter((plan) =>
        plan.eplanName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.updateCurrentPageExercisePlans();
    },

    // 重置搜索
    resetFilters() {
      this.searchQuery = "";
      this.filteredExercisePlans = [...this.exercisePlans];
      this.updateCurrentPageExercisePlans();
    },

    // 更新分页数据
    updateCurrentPageExercisePlans() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.currentPageExercisePlans = this.filteredExercisePlans.slice(
        startIndex,
        startIndex + this.pageSize
      );
    },

    // 切换状态
    async toggleStatus(plan) {
      try {
    const apiUrl = plan.status === "0" ? "/admin/setsuggesteplan" : "/admin/removesuggesteplan";
    
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

    // 页码变化
    handlePageChange(page) {
      this.currentPage = page;
      this.updateCurrentPageExercisePlans();
    },
    addExercisePlan() {
      this.$refs.selectExercisePlan.openDialog(); // 传递数据到组件
    },
    async editExercisePlan(plan) {
      try {
        const response = await api.get(`/ePlan/getDetail`, {
          params: { id: plan.id },
        });
        this.$refs.selectExercisePlan.openDialog(response.data); // 传递数据到组件
      } catch (error) {
        console.error("获取计划详情失败", error);
        this.$message.error("获取计划详情失败，请重试！");
      }
    },
  },
};
</script>

<style scoped>
.exercise-plan-management {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  margin-right: 20px;
  width: 200px;
}

.el-table {
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: auto;
}

.el-pagination {
  margin-top: 20px;
}
</style>
