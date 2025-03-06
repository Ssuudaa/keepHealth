<template>
  <div class="exercise-plan-management">
    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索标题"
        class="search-input"
      />
      <el-select
        v-model="categoryFilter"
        placeholder="选择分类"
        class="category-select"
      >
        <el-option label="力量训练" value="力量训练" />
        <el-option label="有氧训练" value="有氧训练" />
        <el-option label="灵活性训练" value="灵活性训练" />
        <el-option label="恢复训练" value="恢复训练" />
      </el-select>
      <el-button
        @click="searchExercisePlan"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button @click="resetFilters" type="warning">重置</el-button>
    </div>

    <!-- 新增运动计划按钮 -->
    <el-button
      @click="backToExercisePlan"
      type="warning"
      class="add-button"
      icon="el-icon-caret-left">返回运动计划页面</el-button
    >

    <el-button @click="addExercisePlan" type="primary" class="add-button"
      >新增运动计划</el-button
    >

    <!-- 运动计划表格 -->
    <el-table :data="currentPageExercisePlans" border>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="summary" label="描述" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="content" label="内容" />
      <el-table-column label="计划状态">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? "已停用" : "已发布" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editExercisePlan(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            :type="scope.row.status === 0 ? 'success' : 'danger'"
            @click="toggleStatus(scope.row)"
          >
            {{ scope.row.status === 0 ? "启用" : "停用" }}
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

    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="isEditDialogVisible"
      title="设置运动计划"
      width="40%"
    >
      <el-form :model="currentExercisePlan" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentExercisePlan.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentExercisePlan.summary" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="currentExercisePlan.category">
            <el-option label="力量训练" value="力量训练" />
            <el-option label="有氧训练" value="有氧训练" />
            <el-option label="灵活性训练" value="灵活性训练" />
            <el-option label="恢复训练" value="恢复训练" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="currentExercisePlan.content" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExercisePlan">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      // 运动计划数据
      exercisePlans: [
        {
          title: "力量训练计划1",
          summary: "描述1",
          category: "力量训练",
          content: "内容1",
          status: 1,
        },
        {
          title: "有氧训练计划2",
          summary: "描述2",
          category: "有氧训练",
          content: "内容2",
          status: 1,
        },
        {
          title: "灵活性训练计划3",
          summary: "描述3",
          category: "灵活性训练",
          content: "内容3",
          status: 0,
        },
        // 可以继续添加更多数据
      ],
      searchQuery: "",
      categoryFilter: "",
      filteredExercisePlans: [], // 筛选后的运动计划数据
      currentPageExercisePlans: [], // 当前页运动计划数据
      pageSize: 10, // 每页显示的运动计划数量
      currentPage: 1, // 当前页码
      isEditDialogVisible: false, // 编辑弹窗的可见性
      currentExercisePlan: {}, // 当前正在编辑的运动计划
    };
  },
  mounted() {
    // 初始化时展示所有运动计划
    this.filteredExercisePlans = [...this.exercisePlans];
    this.updateCurrentPageExercisePlans();
  },
  methods: {
    // 搜索过滤函数
    searchExercisePlan() {
      this.filteredExercisePlans = this.exercisePlans.filter((plan) => {
        const matchesQuery =
          !this.searchQuery ||
          plan.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          !this.categoryFilter || plan.category === this.categoryFilter;

        return matchesQuery && matchesCategory;
      });
      this.updateCurrentPageExercisePlans();
    },

    // 重置筛选条件
    resetFilters() {
      this.searchQuery = "";
      this.categoryFilter = "";
      this.filteredExercisePlans = [...this.exercisePlans];
      this.updateCurrentPageExercisePlans();
    },

    // 更新当前页显示的运动计划
    updateCurrentPageExercisePlans() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.currentPageExercisePlans = this.filteredExercisePlans.slice(
        startIndex,
        startIndex + this.pageSize
      );
    },

    // 页码变化时的处理函数
    handlePageChange(page) {
      this.currentPage = page;
      this.updateCurrentPageExercisePlans();
    },

    // 编辑运动计划
    editExercisePlan(plan) {
      this.currentExercisePlan = { ...plan }; // 创建当前编辑运动计划的副本
      this.isEditDialogVisible = true; // 打开编辑弹窗
    },

    // 保存编辑的运动计划信息
    saveExercisePlan() {
      const index = this.exercisePlans.findIndex(
        (plan) => plan.title === this.currentExercisePlan.title
      );
      if (index !== -1) {
        this.exercisePlans.splice(index, 1, { ...this.currentExercisePlan });
        this.filteredExercisePlans = [...this.exercisePlans]; // 更新筛选后的运动计划列表
      }
      this.isEditDialogVisible = false; // 关闭弹窗
      this.updateCurrentPageExercisePlans();
    },

    // 启用/停用运动计划
    toggleStatus(plan) {
      plan.status = plan.status === 0 ? 1 : 0;
      this.filteredExercisePlans = [...this.exercisePlans]; // 更新筛选后的运动计划列表
      this.updateCurrentPageExercisePlans();
    },

    // 新增运动计划
    addExercisePlan() {
      this.currentExercisePlan = {
        title: "",
        summary: "",
        category: "",
        content: "",
        status: 1,
      }; // 清空表单
      this.isEditDialogVisible = true; // 打开编辑弹窗
    },
    backToExercisePlan(){
      this.$router.push("/user/exercise")
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

.category-select {
  width: 200px;
  margin-right: 20px;
}

.el-table .el-table__body {
  height: 400px;
  overflow-y: auto;
}

.el-pagination {
  margin-top: 20px;
}

.add-button {
  margin-bottom: 20px;
}

.el-dialog {
  width: 50%;
}
</style>
  