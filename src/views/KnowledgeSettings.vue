<template>
  <div class="health-knowledge-management">
    <!-- 搜索框 -->
    <!-- <div class="search-bar">
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
      <el-button
        @click="searchHealthKnowledge"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button @click="resetFilters" type="warning">重置</el-button>
    </div> -->

    <!-- 新增养生知识按钮 -->
    <el-button @click="addHealthKnowledge" type="primary" class="add-button"
      >新增养生知识</el-button
    >

    <!-- 养生知识表格 -->
    <el-table :data="currentPageHealthKnowledge" border>
      <el-table-column prop="name" label="标题" />
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ getShortNote(scope.row.note) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editHealthKnowledge(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="delete scope.row"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      @current-change="handlePageChange"
      layout="prev, pager, next, jumper"
    />

    <!-- 编辑弹窗 -->
    <el-dialog
      :visible.sync="isEditDialogVisible"
      title="设置养生知识"
      width="40%"
    >
      <el-form :model="currentHealthKnowledge" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentHealthKnowledge.name" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" rows="9" v-model="currentHealthKnowledge.note" />
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
import api from "../api";
export default {
  data() {
    return {
      // 养生知识数据
      healthKnowledge: [],
      total: 0,
      searchQuery: "",
      contentQuery: "",
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
    this.fetchKnowledgeData();
    this.getShortNote();
  },
  methods: {
    getShortNote(note) {
      if (!note) return "";
    return note.length > 20 ? note.substring(0, 20) + "..." : note;
    },
    async fetchKnowledgeData() {
      try {
        const response = await api.get("/yszs/getYszs");
        this.currentPageHealthKnowledge = response;
      } catch (error) {
        console.error("获取养生知识数据失败", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 搜索过滤函数
    searchHealthKnowledge() {
      this.filteredHealthKnowledge = this.healthKnowledge.filter(
        (knowledge) => {
          const matchesTitle =
            !this.searchQuery ||
            knowledge.title
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());
          const matchesContent =
            !this.contentQuery ||
            knowledge.content
              .toLowerCase()
              .includes(this.contentQuery.toLowerCase());

          return matchesTitle && matchesContent;
        }
      );
      this.updateCurrentPageHealthKnowledge();
    },

    // 重置过滤器
    resetFilters() {
      this.searchQuery = "";
      this.contentQuery = "";
      this.filteredHealthKnowledge = [...this.healthKnowledge];
      this.updateCurrentPageHealthKnowledge();
    },

    // 更新当前页显示的养生知识
    updateCurrentPageHealthKnowledge() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.currentPageHealthKnowledge = this.filteredHealthKnowledge.slice(
        startIndex,
        startIndex + this.pageSize
      );
    },

    // 页码变化时的处理函数
    handlePageChange(page) {
      this.currentPage = page;
      this.updateCurrentPageHealthKnowledge();
    },

    async addHealthKnowledge() {
    this.currentHealthKnowledge = {
      name: "",
      note: "",
    };
    this.isEditDialogVisible = true;
  },

  // 保存养生知识（新增或编辑）
  async saveHealthKnowledge() {
    try {
      if (this.currentHealthKnowledge.id) {
        // 如果有 ID，则执行编辑
        const response = await api.put("/admin/setYszs", this.currentHealthKnowledge);
        if(response.code===200){
          this.$message.success("编辑成功")
        }
      } else {
        // 没有 ID，则执行新增
        await api.post("/admin/add", this.currentHealthKnowledge);
        if(response.code===200){
          this.$message.success("新增成功")
        }
      }
      this.isEditDialogVisible = false;
      this.fetchKnowledgeData(); // 重新获取数据，更新列表
    } catch (error) {
      console.error("保存养生知识失败", error);
    }
  },

  // 编辑养生知识
  editHealthKnowledge(knowledge) {
    this.currentHealthKnowledge = { ...knowledge }; // 复制对象，避免修改原数据
    this.isEditDialogVisible = true;
  },
  },
};
</script>
  
  <style scoped>
.health-knowledge-management {
  padding: 20px;
  overflow-y: auto;
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
  