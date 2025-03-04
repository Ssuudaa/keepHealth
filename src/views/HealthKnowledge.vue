<template>
  <div class="bookshelf">
    <h2>📖 养生知识</h2>

    <!-- 书籍列表 -->
    <div class="book-list">
      <el-card
        v-for="(book, index) in books"
        :key="index"
        class="book-card"
        @click.native="openBook(books[index])"
      >
        <div class="book-title">{{ book.title }}</div>
      </el-card>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="养生知识详情" width="50%">
      <div v-if="selectedBook">
        <h3>{{ selectedBook.title }}</h3>
        <p>{{ selectedBook.content }}</p>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示
      selectedBook: null, // 选中的书籍
      books: [
        { title: "中医基础", content: "中医讲究阴阳平衡，五行相生相克..." },
        { title: "养生饮食", content: "饮食养生关键在于均衡，少油少盐..." },
        { title: "经络养生", content: "经络疏通有助于气血运行，常按足三里..." },
        { title: "中医基础", content: "中医讲究阴阳平衡，五行相生相克..." },
        { title: "养生饮食", content: "饮食养生关键在于均衡，少油少盐..." },
        { title: "经络养生", content: "经络疏通有助于气血运行，常按足三里..." },
        { title: "中医基础", content: "中医讲究阴阳平衡，五行相生相克..." },
        { title: "养生饮食", content: "饮食养生关键在于均衡，少油少盐..." },
        { title: "经络养生", content: "经络疏通有助于气血运行，常按足三里..." },
      ],
    };
  },
  methods: {
    openBook(book) {
      this.selectedBook = book;
      this.dialogVisible = true;
    },
  },
};
</script>
  
  <style scoped>
.bookshelf {
  text-align: center;
  padding: 20px;
}

/* 书籍列表 */
.book-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

/* 书籍卡片 */
.book-card {
  width: 200px;
  cursor: pointer;
  text-align: center;
  padding: 15px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: scale(1.05);
}

/* 书籍标题 */
.book-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
  