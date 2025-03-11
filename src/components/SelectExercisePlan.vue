<template>
  <div>
    <el-dialog title="选择运动计划" :visible.sync="dialogVisible" width="60%">
      <div class="dialog-container">
        <!-- 左侧分类 -->
        <el-menu default-active="0" @select="handleCategorySelect" class="category-menu">
          <el-menu-item v-for="(category, index) in categories" :key="index" :index="index.toString()">
            {{ category.name }}
          </el-menu-item>
        </el-menu>
        
        <!-- 右侧运动列表 -->
        <div class="sports-list">
          <el-row :gutter="20">
            <el-col v-for="(sport, index) in filteredSports" :key="index" :span="8" class="sport-card">
              <el-card shadow="hover">
                <div class="sport-name">{{ sport.name }}</div>
                <el-image :src="sport.logo" class="sport-logo" fit="contain" lazy />
                <el-button type="primary" size="mini" @click="openPlanDialog(sport.name)">添加计划</el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    
    <!-- 添加计划弹窗 -->
    <el-dialog title="添加计划" :visible.sync="planDialogVisible" width="30%">
      <el-form>
        <el-form-item label="计划名称">
          <el-input v-model="planName" placeholder="输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="计划描述">
          <el-input v-model="planDescription" type="textarea" placeholder="输入计划描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="planDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addPlan">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      planDialogVisible: false,
      selectedCategoryIndex: 0,
      planName: '',
      planDescription: '',
      currentSport: ''
    };
  },
  computed: {
    filteredSports() {
        return this.categories[this.selectedCategoryIndex].sports.map(sport => ({
    name: sport.name,
    logo: require('@/assets/avatar.png') || '默认图标路径' // 如果没有 logo，就使用默认图标
  }));
    }
  },
  methods: {
    handleCategorySelect(index) {
      this.selectedCategoryIndex = parseInt(index);
    },
    openPlanDialog(sportName) {
      this.currentSport = sportName;
      this.planDialogVisible = true;
    },
    addPlan() {
      this.$emit('add-plan', {
        name: this.planName,
        description: this.planDescription,
        sport: this.currentSport
      });
      this.planDialogVisible = false;
      this.planName = '';
      this.planDescription = '';
    }
  }
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
.sports-list {
  flex: 1;
  padding: 20px;
}
.sport-card {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  text-align: center;
  height: 100%;
  margin-top: 10px;
}
.sport-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}
.sport-card .el-button {
  display: block;
  margin: 10px auto 0; /* 让按钮水平居中 */
}
.sport-logo {
  width: 130px;
  height: 80px;
  margin-bottom: 10px;
  display: block;
}
</style>
