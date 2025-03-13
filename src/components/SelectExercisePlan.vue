<template>
  <el-dialog title="新增运动计划" :visible.sync="dialogVisible" width="60%" @open="fetchCategories">
    <div class="dialog-container">
      <!-- 左侧分类菜单 -->
      <el-menu :default-active="selectedCategoryId ? selectedCategoryId.toString() : ''" 
               @select="handleCategorySelect" 
               class="category-menu">
        <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
          {{ category.ebName }}
        </el-menu-item>
      </el-menu>

      <!-- 右侧运动列表 -->
      <div class="content-container">
        <el-form label-width="100px">
          <el-form-item label="计划名称">
            <el-input v-model="planName" placeholder="请输入计划名称" />
          </el-form-item>
          <el-form-item label="计划描述">
            <el-input v-model="planDescription" placeholder="请输入计划描述" />
          </el-form-item>
        </el-form>

        <div class="sports-list" v-if="selectedCategoryId">
          <el-row :gutter="20">
            <el-col v-for="sport in sports" :key="sport.id" :span="8" class="sport-card">
              <el-card shadow="hover">
                <div class="sport-name">{{ sport.esName }}</div>
                <el-image :src="sport.image || defaultLogo" class="sport-logo" fit="contain" lazy />
                <el-button type="primary" size="mini" @click="toggleSport(sport)">
                  {{ selectedSports.includes(sport) ? "已添加" : "添加" }}
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <el-button type="success" @click="savePlan" class="save-button">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      dialogVisible: false,
      categories: [], // 存储所有分类
      sports: [], // 当前选中分类的运动类型
      eSmallTypeIds:{},
      selectedCategoryId: null, // 当前选中的分类 ID
      selectedSports: [], // 选中的运动类型
      planName: "",
      planDescription: "",
      defaultLogo: require("@/assets/avatar.png"), // 默认图片
    };
  },
  methods: {
    // 获取所有分类
    async fetchCategories() {
      try {
        const response = await api.get("/eBigtype/list");
        this.categories = response.data || []; // 确保数据正确
      } catch (error) {
        console.error("获取分类失败", error);
      }
    },

    // 根据选中的分类 ID 获取对应的运动类型
    async fetchSports(categoryId) {
      if (!categoryId) return;
      try {
        const ebigTypeId = categoryId
        const response = await api.get("/eSmalltype/list", { params: { ebigTypeId } });
        this.sports = response.data || []; // 只加载该分类下的运动类型
      } catch (error) {
        console.error("获取运动类型失败", error);
      }
    },

    // 处理分类选择
    handleCategorySelect(categoryId) {
      this.selectedCategoryId = Number(categoryId);
      this.fetchSports(this.selectedCategoryId);
    },

    // 切换运动的选择状态
    toggleSport(sport) {
      const index = this.selectedSports.findIndex((s) => s.id === sport.id);
      if (index === -1) {
        this.selectedSports.push(sport);
      } else {
        this.selectedSports.splice(index, 1);
      }
    },

    // 保存计划
    async savePlan() {
      if (!this.planName || !this.planDescription) {
        this.$message.error("请填写完整的计划信息！");
        return;
      }
      if (this.selectedSports.length === 0) {
        this.$message.error("请至少选择一个运动！");
        return;
      }

      try {
        await api.put("/ePlan/add", {
          ePlanName: this.planName,
          description: this.planDescription,
          eSmallTypeIds: this.selectedSports.map((s) => s.id),
        });

        this.$message.success("计划保存成功！");
        this.dialogVisible = false;
        this.planName = "";
        this.planDescription = "";
        this.selectedSports = [];
      } catch (error) {
        console.error("保存计划失败", error);
        this.$message.error("保存失败，请重试！");
      }
    },
  },
};
</script>

<style scoped>
.dialog-container {
  display: flex;
  height: 500px;
  overflow-y: auto;
}

.category-menu {
  width: 200px;
}

.content-container {
  flex: 1;
  padding: 20px;
}

.sports-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 居中 */
  gap: 20px;
}

.sport-card {
  width: calc(33.333% - 20px);
  min-width: 200px; /* 确保小屏幕下最小宽度 */
  text-align: center;
}

.sport-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.sport-logo {
  width: 130px;
  height: 80px;
  margin-bottom: 10px;
}

.save-button {
  width: 100%;
  margin-top: 20px;
}
</style>
