<template>
    <div class="diet-plan-management">
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
          <el-option label="早餐" value="早餐" />
          <el-option label="午餐" value="午餐" />
          <el-option label="晚餐" value="晚餐" />
          <el-option label="零食" value="零食" />
        </el-select>
        <el-button @click="searchDietPlan" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="resetFilters" type="warning">重置</el-button>
      </div>
  
      <!-- 新增膳食计划按钮 -->
      <el-button
      @click="backToMealPlan"
      type="warning"
      class="add-button"
      icon="el-icon-caret-left">返回膳食计划页面</el-button
    >
      <el-button @click="addDietPlan" type="primary" class="add-button">新增膳食计划</el-button>
  
      <!-- 膳食计划表格 -->
      <el-table :data="currentPageDietPlans" border>
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
            <el-button size="mini" @click="editDietPlan(scope.row)">编辑</el-button>
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
        :total="filteredDietPlans.length"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
      />
  
      <!-- 编辑弹窗 -->
      <el-dialog :visible.sync="isEditDialogVisible" title="设置膳食计划" width="40%">
        <el-form :model="currentDietPlan" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="currentDietPlan.title" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="currentDietPlan.summary" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="currentDietPlan.category">
              <el-option label="早餐" value="早餐" />
              <el-option label="午餐" value="午餐" />
              <el-option label="晚餐" value="晚餐" />
              <el-option label="零食" value="零食" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="currentDietPlan.content" />
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="isEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDietPlan">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 膳食计划数据
        dietPlans: [
          { title: '早餐计划A', summary: '丰富的营养早餐', category: '早餐', content: '具体内容...', status: 1 },
          { title: '午餐计划B', summary: '丰盛的午餐', category: '午餐', content: '具体内容...', status: 0 },
          { title: '晚餐计划C', summary: '简单的晚餐', category: '晚餐', content: '具体内容...', status: 1 },
          { title: '零食计划D', summary: '健康的小零食', category: '零食', content: '具体内容...', status: 1 },
        ],
        searchQuery: '',
        categoryFilter: '',
        filteredDietPlans: [], // 筛选后的膳食计划
        currentPageDietPlans: [], // 当前页膳食计划数据
        pageSize: 10, // 每页显示的膳食计划数量
        currentPage: 1, // 当前页码
        isEditDialogVisible: false, // 编辑弹窗的可见性
        currentDietPlan: {}, // 当前正在编辑的膳食计划
      };
    },
    mounted() {
      // 初始化时展示所有膳食计划
      this.filteredDietPlans = [...this.dietPlans];
      this.updateCurrentPageDietPlans();
    },
    methods: {
      // 搜索过滤函数
      searchDietPlan() {
        this.filteredDietPlans = this.dietPlans.filter(plan => {
          const matchesTitle =
            !this.searchQuery || plan.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesCategory =
            !this.categoryFilter || plan.category === this.categoryFilter;
  
          return matchesTitle && matchesCategory;
        });
        this.updateCurrentPageDietPlans();
      },
  
      // 重置过滤器
      resetFilters() {
        this.searchQuery = '';
        this.categoryFilter = '';
        this.filteredDietPlans = [...this.dietPlans];
        this.updateCurrentPageDietPlans();
      },
  
      // 更新当前页显示的膳食计划
      updateCurrentPageDietPlans() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.currentPageDietPlans = this.filteredDietPlans.slice(startIndex, startIndex + this.pageSize);
      },
  
      // 页码变化时的处理函数
      handlePageChange(page) {
        this.currentPage = page;
        this.updateCurrentPageDietPlans();
      },
  
      // 编辑膳食计划
      editDietPlan(plan) {
        this.currentDietPlan = { ...plan }; // 创建当前编辑膳食计划的副本
        this.isEditDialogVisible = true; // 打开编辑弹窗
      },
  
      // 保存编辑的膳食计划信息
      saveDietPlan() {
        const index = this.dietPlans.findIndex(
          plan => plan.title === this.currentDietPlan.title
        );
        if (index !== -1) {
          this.dietPlans.splice(index, 1, { ...this.currentDietPlan });
          this.filteredDietPlans = [...this.dietPlans]; // 更新筛选后的膳食计划列表
        }
        this.isEditDialogVisible = false; // 关闭弹窗
        this.updateCurrentPageDietPlans();
      },
  
      // 启用/停用膳食计划
      toggleStatus(plan) {
        plan.status = plan.status === 0 ? 1 : 0;
        this.filteredDietPlans = [...this.dietPlans]; // 更新筛选后的膳食计划列表
        this.updateCurrentPageDietPlans();
      },
  
      // 新增膳食计划
      addDietPlan() {
        this.currentDietPlan = { title: '', summary: '', category: '', content: '', status: 1 };
        this.isEditDialogVisible = true; // 打开新增弹窗
      },
      backToMealPlan(){
        this.$router.push("/user/meal")
      },
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
  
  .category-select {
    margin-right: 20px;
    width: 200px;
  }
  
  .add-button {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .el-table .el-table__body {
    height: 400px;
    overflow-y: auto;
  }
  
  .el-pagination {
    margin-top: 20px;
  }
  
  .el-dialog {
    width: 40%;
  }
  </style>
  