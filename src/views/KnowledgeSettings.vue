<template>
    <div class="health-knowledge-management">
      <!-- 搜索框 -->
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索标题"
          class="search-input"
        />
        <el-input
          v-model="contentQuery"
          placeholder="搜索内容"
          class="search-input"
        />
        <el-button @click="searchHealthKnowledge" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="resetFilters" type="warning">重置</el-button>
      </div>
  
      <!-- 新增养生知识按钮 -->
      <el-button @click="addHealthKnowledge" type="primary" class="add-button">新增养生知识</el-button>
  
      <!-- 养生知识表格 -->
      <el-table :data="currentPageHealthKnowledge" border>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="summary" label="描述" />
        <el-table-column prop="content" label="内容" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editHealthKnowledge(scope.row)">编辑</el-button>
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
        :total="filteredHealthKnowledge.length"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
      />
  
      <!-- 编辑弹窗 -->
      <el-dialog :visible.sync="isEditDialogVisible" title="设置养生知识" width="40%">
        <el-form :model="currentHealthKnowledge" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="currentHealthKnowledge.title" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="currentHealthKnowledge.summary" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="currentHealthKnowledge.content" />
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="isEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveHealthKnowledge">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 养生知识数据
        healthKnowledge: [
          { title: '养生第一课', summary: '关于养生的基础知识', content: '详细内容...', status: 1 },
          { title: '饮食与健康', summary: '介绍饮食与健康的关系', content: '详细内容...', status: 0 },
          { title: '健身方法', summary: '常见的健身方法介绍', content: '详细内容...', status: 1 },
        ],
        searchQuery: '',
        contentQuery: '',
        filteredHealthKnowledge: [], // 筛选后的养生知识
        currentPageHealthKnowledge: [], // 当前页养生知识数据
        pageSize: 10, // 每页显示的养生知识数量
        currentPage: 1, // 当前页码
        isEditDialogVisible: false, // 编辑弹窗的可见性
        currentHealthKnowledge: {}, // 当前正在编辑的养生知识
      };
    },
    mounted() {
      // 初始化时展示所有养生知识
      this.filteredHealthKnowledge = [...this.healthKnowledge];
      this.updateCurrentPageHealthKnowledge();
    },
    methods: {
      // 搜索过滤函数
      searchHealthKnowledge() {
        this.filteredHealthKnowledge = this.healthKnowledge.filter(knowledge => {
          const matchesTitle =
            !this.searchQuery || knowledge.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesContent =
            !this.contentQuery || knowledge.content.toLowerCase().includes(this.contentQuery.toLowerCase());
  
          return matchesTitle && matchesContent;
        });
        this.updateCurrentPageHealthKnowledge();
      },
  
      // 重置过滤器
      resetFilters() {
        this.searchQuery = '';
        this.contentQuery = '';
        this.filteredHealthKnowledge = [...this.healthKnowledge];
        this.updateCurrentPageHealthKnowledge();
      },
  
      // 更新当前页显示的养生知识
      updateCurrentPageHealthKnowledge() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.currentPageHealthKnowledge = this.filteredHealthKnowledge.slice(startIndex, startIndex + this.pageSize);
      },
  
      // 页码变化时的处理函数
      handlePageChange(page) {
        this.currentPage = page;
        this.updateCurrentPageHealthKnowledge();
      },
  
      // 编辑养生知识
      editHealthKnowledge(knowledge) {
        this.currentHealthKnowledge = { ...knowledge }; // 创建当前编辑养生知识的副本
        this.isEditDialogVisible = true; // 打开编辑弹窗
      },
  
      // 保存编辑的养生知识信息
      saveHealthKnowledge() {
        const index = this.healthKnowledge.findIndex(
          knowledge => knowledge.title === this.currentHealthKnowledge.title
        );
        if (index !== -1) {
          this.healthKnowledge.splice(index, 1, { ...this.currentHealthKnowledge });
          this.filteredHealthKnowledge = [...this.healthKnowledge]; // 更新筛选后的养生知识列表
        }
        this.isEditDialogVisible = false; // 关闭弹窗
        this.updateCurrentPageHealthKnowledge();
      },
  
      // 启用/停用养生知识
      toggleStatus(knowledge) {
        knowledge.status = knowledge.status === 0 ? 1 : 0;
        this.filteredHealthKnowledge = [...this.healthKnowledge]; // 更新筛选后的养生知识列表
        this.updateCurrentPageHealthKnowledge();
      },
  
      // 新增养生知识
      addHealthKnowledge() {
        this.currentHealthKnowledge = { title: '', summary: '', content: '', status: 1 };
        this.isEditDialogVisible = true; // 打开新增弹窗
      },
    },
  };
  </script>
  
  <style scoped>
  .health-knowledge-management {
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
  
  .el-button {
    margin-left: 10px;
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
  