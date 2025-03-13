<template>
    <el-dialog title="新增膳食计划" :visible.sync="dialogVisible" width="60%" @open="fetchCategories">
      <div class="dialog-container">
        <!-- 左侧分类菜单 -->
        <el-menu :default-active="selectedCategoryId ? selectedCategoryId.toString() : ''" 
                 @select="handleCategorySelect" 
                 class="category-menu">
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
            {{ category.BName }}
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
  
          <div class="diet-list" v-if="selectedCategoryId">
            <el-row :gutter="20">
              <el-col v-for="Diet in Diets" :key="Diet.id" :span="8" class="Diet-card">
                <el-card shadow="hover">
                  <div class="Diet-name">{{ Diet.SName }}</div>
                  <el-image :src="Diet.image || defaultLogo" class="Diet-logo" fit="contain" lazy />
                  <el-button type="primary" size="mini" @click="toggleDiet(Diet)">
                    {{ selectedDiets.includes(Diet) ? "已添加" : "添加" }}
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
        diets: [], // 当前选中分类的运动类型
        selectedCategoryId: null, // 当前选中的分类 ID
        selectedDiets: [], // 选中的运动类型
        planName: "",
        planDescription: "",
        defaultLogo: require("@/assets/avatar.png"), // 默认图片
      };
    },
    methods: {
      // 获取所有分类
      async fetchCategories() {
        try {
          const response = await api.get("/bigtype/list");
          this.categories = response.data || []; // 确保数据正确
        } catch (error) {
          console.error("获取分类失败", error);
        }
      },
  
      // 根据选中的分类 ID 获取对应的运动类型
      async fetchDiets(categoryId) {
        if (!categoryId) return;
        try {
          const bigTypeId = categoryId
          const response = await api.get("/smalltype/list", { params: { bigTypeId } });
          this.Diets = response.data || []; // 只加载该分类下的运动类型
        } catch (error) {
          console.error("获取运动类型失败", error);
        }
      },
  
      // 处理分类选择
      handleCategorySelect(categoryId) {
        this.selectedCategoryId = Number(categoryId);
        this.fetchDiets(this.selectedCategoryId);
      },
  
      // 切换运动的选择状态
      toggleDiet(Diet) {
        const index = this.selectedDiets.findIndex((s) => s.id === Diet.id);
        if (index === -1) {
          this.selectedDiets.push(Diet);
        } else {
          this.selectedDiets.splice(index, 1);
        }
      },
  
      // 保存计划
      async savePlan() {
        if (!this.planName || !this.planDescription) {
          this.$message.error("请填写完整的计划信息！");
          return;
        }
        if (this.selectedDiets.length === 0) {
          this.$message.error("请至少选择一个膳食计划！");
          return;
        }
  
        try {
          await api.post("/api/plans", {
            name: this.planName,
            description: this.planDescription,
            Diets: this.selectedDiets.map((s) => s.id),
          });
  
          this.$message.success("计划保存成功！");
          this.dialogVisible = false;
          this.planName = "";
          this.planDescription = "";
          this.selectedDiets = [];
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
  
  .diet-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 居中 */
  gap: 20px;
}

.Diet-card {
  width: calc(33.333% - 20px);
  min-width: 200px; /* 确保小屏幕下最小宽度 */
  text-align: center;
}
  .Diet-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .Diet-logo {
    width: 130px;
    height: 80px;
    margin-bottom: 10px;
  }
  
  .save-button {
    width: 100%;
    margin-top: 20px;
  }
  </style>
  