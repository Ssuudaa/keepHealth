<template>
  <el-dialog title="设定膳食计划" :visible.sync="dialogVisible" width="60%" @open="fetchCategories">
    <div class="dialog-container">
      <!-- 左侧分类菜单 -->
      <el-menu :default-active="selectedCategoryId ? selectedCategoryId.toString() : ''" 
               @select="handleCategorySelect" 
               class="category-menu">
        <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
          {{ category.BName }}
        </el-menu-item>
      </el-menu>

      <!-- 右侧膳食列表 -->
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
            <el-col v-for="diet in diets" :key="diet.id" :span="8" class="diet-card">
              <el-card shadow="hover">
                <div class="diet-name">{{ diet.SName }}</div>
                <el-image :src="diet.image || defaultLogo" class="diet-logo" fit="contain" lazy />
                <el-button type="primary" size="mini" @click="toggleDiet(diet)">
                  {{ isSelected(diet) ? "已添加" : "添加" }}
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="button-container">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="success" @click="savePlan">保存</el-button>
        </div>      </div>
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
      diets: [], // 当前选中分类的膳食类型
      selectedCategoryId: null, // 当前选中的分类 ID
      selectedDiets: [], // 选中的膳食类型
      planName: "",
      planDescription: "",
      defaultLogo: require("@/assets/avatar.png"), // 默认图片
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await api.get("/bigtype/list");
        this.categories = response.data || [];
      } catch (error) {
        console.error("获取分类失败", error);
      }
    },

    async fetchDiets(categoryId) {
      if (!categoryId) return;
      try {
        const response = await api.get("/smalltype/list", { params: { bigTypeId: categoryId } });
        this.diets = response.data || [];
      } catch (error) {
        console.error("获取膳食类型失败", error);
      }
    },

    handleCategorySelect(categoryId) {
      if (this.selectedCategoryId !== Number(categoryId)) {
        this.selectedCategoryId = Number(categoryId);
        this.fetchDiets(this.selectedCategoryId);
      }
    },

    toggleDiet(diet) {
      const index = this.selectedDiets.findIndex(s => s.id === diet.id);
      if (index === -1) {
        this.selectedDiets.push({ ...diet }); // 确保引用不变
      } else {
        this.selectedDiets.splice(index, 1);
      }
    },

    isSelected(diet) {
      return this.selectedDiets.some(s => s.id === diet.id);
    },

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
        if(this.planId){
          await api.put('/plan/update' ,{
          id:this.planId,
          planName: this.planName,
          description: this.planDescription,
          smallTypeIds: this.selectedDiets.map(s => s.id),
        });
      }else{
        await api.put("/plan/add", {
          planName: this.planName,
          description: this.planDescription,
          smallTypeIds: this.selectedDiets.map(s => s.id),
        });
      }

        this.$message.success("计划保存成功！");
        this.dialogVisible = false;
        this.planName = "";
        this.planDescription = "";
        this.selectedDiets = [];
        this.$emit("add-plan")
      } catch (error) {
        console.error("保存计划失败", error);
        this.$message.error("保存失败，请重试！");
      }
    },
    openDialog(planData = null) {
  // 先清空旧数据，避免残留
  this.planId = null;
  this.planName = "";
  this.planDescription = "";
  this.selectedDiets = [];

  this.dialogVisible = true;

  // 如果是编辑模式，填充数据
  if (planData) {
    this.planId = planData.id || null;
    this.planName = planData.name;
    this.planDescription = planData.description;

    // 处理 smalltypes 数据，确保数据结构匹配
    this.selectedDiets = planData.smalltypes
      ? planData.smalltypes.map(type => ({
          id: type.id,
          SName: type.name,  // API 返回的是 name，但前端使用的是 SName
          image: type.image || this.defaultLogo, // 处理默认图片
        }))
      : [];
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
  justify-content: center;
  gap: 20px;
}

.diet-card {
  width: calc(33.333% - 20px);
  min-width: 200px;
  text-align: center;
}

.diet-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.diet-logo {
  width: 130px;
  height: 80px;
  margin-bottom: 10px;
}

.save-button {
  width: 100%;
  margin-top: 20px;
}
.button-container {
  display: flex;
  padding: 20px;
  position: absolute;
  bottom: 10px;
  right: 0;
  background: #fff;
}
</style>
