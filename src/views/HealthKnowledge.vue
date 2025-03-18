<template>
  <div class="knowledge">
    <!-- 页面标题 -->
    <h2>养生知识</h2>

    <!-- 搜索框 -->
    <el-input
      v-model="searchQuery"
      placeholder="请输入关键词搜索"
      @input="searchKnowledge"
      clearable
      class="search-input"
    ></el-input>

    <!-- 养生知识列表 -->
    <div
      class="knowledge-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isLoading || noMoreData"
      :infinite-scroll-distance="10"
    >
      <div
        v-for="item in displayedKnowledge"
        :key="item.id"
        class="knowledge-item"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.summary }}</p>
        <el-button type="text" @click="viewDetails(item)">查看详情</el-button>
      </div>
    </div>

    <!-- 加载中提示 -->
    <p v-if="isLoading" class="loading-text">加载中...</p>
    <p v-if="noMoreData" class="loading-text">没有更多数据了</p>

    <!-- 弹窗详情 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="50%"
      @close="resetDialog"
    >
      <div v-html="dialogContent"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      knowledgeData: [], // 所有数据
      displayedKnowledge: [], // 当前显示的数据
      searchQuery: "", // 搜索关键词
      isLoading: false, // 是否正在加载
      noMoreData: false, // 是否没有更多数据
      dialogVisible: false, // 弹窗显示状态
      dialogTitle: "", // 弹窗标题
      dialogContent: "", // 弹窗内容
      page: 1, // 当前页数
      pageSize: 5, // 每次加载的数量
    };
  },
  created() {
    this.fetchKnowledgeData();
  },
  methods: {
    // 从 API 获取数据
    async fetchKnowledgeData() {
  if (this.isLoading || this.noMoreData) return;

  this.isLoading = true;

  try {
    const response = await api.get("/yszs/getYszs");

    if (response && response.length > 0) {
      this.knowledgeData = response.map(item => ({
        id: item.id,
        title: item.name,
        summary: item.note ? item.note.split("。")[0] + "。" : "", // 只取第一个句号之前的内容
        fullNote: item.note || "", // 详情弹窗显示完整内容
      }));

      this.displayedKnowledge = [...this.knowledgeData];

      this.noMoreData = true;
    } else {
      this.noMoreData = true;
    }
  } catch (error) {
    console.error("获取养生知识数据失败", error);
  } finally {
    this.isLoading = false;
  }
},


    // 触底加载更多数据
    loadMore() {
  if (!this.noMoreData) {
    this.fetchKnowledgeData();
  }
},

    // 查看详情
    viewDetails(item) {
      this.dialogTitle = item.title;
      this.dialogContent = item.summary; // 这里没有 content，就显示 note
      this.dialogVisible = true;
    },

    // 关闭弹窗时清空内容
    resetDialog() {
      this.dialogTitle = "";
      this.dialogContent = "";
    },
    async searchKnowledge() {
    const query = this.searchQuery.trim();
    
    if (!query) {
      // 如果搜索框为空，恢复全部数据
      this.displayedKnowledge = [...this.knowledgeData];
      return;
    }

    try {
      const response = await api.get("/admin/getByname", {
        params: { name: query },
      });

      if (response && response.length > 0) {
        this.displayedKnowledge = response.map(item => ({
          id: item.id,
          title: item.name,
          summary: item.note ? item.note.split("。")[0] + "。" : "",
          fullNote: item.note || "",
        }));
      } else {
        this.displayedKnowledge = [];
      }
    } catch (error) {
      console.error("搜索失败", error);
      this.$message.error("搜索失败，请稍后重试");
    }
  },
  },
};
</script>

<style scoped>
.knowledge {
  padding: 20px;
}

h2 {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.search-input {
  margin-bottom: 20px;
  width: 100%;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
}

.knowledge-item {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.knowledge-item h3 {
  font-size: 18px;
  font-weight: bold;
}

.knowledge-item p {
  margin: 10px 0;
}

.loading-text {
  text-align: center;
  color: #888;
  font-size: 14px;
}

.el-dialog .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
