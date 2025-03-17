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

    <!-- 分类筛选 -->
    <!-- <div class="category-filter">
      <el-select
        v-model="selectedCategory"
        placeholder="选择分类"
        @change="filterByCategory"
      >
        <el-option
          v-for="category in categories"
          :key="category"
          :label="category"
          :value="category"
        />
      </el-select>
    </div> -->

    <!-- 养生知识列表 -->
    <div
      class="knowledge-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isLoading"
      :infinite-scroll-distance="10"
    >
      <div
        v-for="(item, index) in displayedKnowledge"
        :key="index"
        class="knowledge-item"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.summary }}</p>
        <el-button type="text" @click="viewDetails(item)">查看详情</el-button>
      </div>
    </div>

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
export default {
  data() {
    return {
      knowledgeData: [
      { title: "健康饮食的重要性", summary: "健康饮食是保持良好身体状态的关键。", content: "详细内容：健康饮食有助于维持理想体重、降低慢性疾病风险并增强免疫系统。保持均衡饮食..." , category: "饮食" },
        { title: "常见运动的健康益处", summary: "运动能够增强体力，提升免疫力。", content: "详细内容：运动有助于改善心血管健康，增加体力，并有助于减轻压力和焦虑..." , category: "运动" },
        { title: "心理健康与压力管理", summary: "良好的心理健康有助于身体健康。", content: "详细内容：心理健康是个人整体健康的重要组成部分，管理压力可以帮助预防抑郁症和焦虑..." , category: "心理健康" },
        // 更多内容...
      ],
      categories: ["饮食", "运动", "心理健康", "睡眠", "养生习惯"], // 分类
      selectedCategory: "", // 当前选择的分类
      searchQuery: "", // 搜索关键词
      isLoading: false, // 是否正在加载
      displayedKnowledge: [], // 当前显示的养生知识
      dialogVisible: false, // 弹窗显示状态
      dialogTitle: "", // 弹窗标题
      dialogContent: "", // 弹窗内容
      knowledgeIndex: 0, // 当前显示到哪条知识
      loadLimit: 5, // 每次加载的条目数
    };
  },
  created() {
    this.displayedKnowledge = this.knowledgeData.slice(0, this.loadLimit);
  },
  mounted() {
  this.loadMore();
  window.addEventListener("scroll", this.handleScroll);
},
  methods: {
    searchKnowledge() {
      const query = this.searchQuery.trim().toLowerCase();
      this.displayedKnowledge = this.knowledgeData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)
      );
      this.knowledgeIndex = this.displayedKnowledge.length;
    },
  loadMore() {
    // 只有在数据没有完全加载的情况下才允许加载
    if (this.isLoading || this.knowledgeIndex >= this.knowledgeData.length) return;

    this.isLoading = true;

    // 获取下一个批次的内容
    const newItems = this.knowledgeData.slice(this.knowledgeIndex, this.knowledgeIndex + this.loadLimit);

    if (newItems.length > 0) {
      this.displayedKnowledge = [...this.displayedKnowledge, ...newItems];
      this.knowledgeIndex += newItems.length; // 更新已加载的内容索引
    }

    this.isLoading = false; // 恢复加载状态
  },

  handleScroll() {
    // 判断滚动是否接近底部
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 当滚动到接近底部时加载更多
    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.loadMore();
    }
  },
    viewDetails(item) {
      this.dialogTitle = item.title;
      this.dialogContent = item.content;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.dialogTitle = "";
      this.dialogContent = "";
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

.category-filter {
  margin-bottom: 20px;
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

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-dialog .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
