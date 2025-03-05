<template>
  <div class="user">
    <!-- 侧边导航栏 -->
    <aside :class="['sidebar', { collapsed: isCollapsed }]">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
      </div>

      <nav>
        <router-link to="/user/data">
          <i class="el-icon-data-line"></i>
          <span v-show="!isCollapsed">健康分析</span>
        </router-link>
        <router-link to="/user/knowledge">
          <i class="el-icon-notebook-2"></i>
          <span v-show="!isCollapsed">养生知识</span>
        </router-link>
        <router-link to="/user/meal">
          <i class="el-icon-food"></i>
          <span v-show="!isCollapsed">膳食计划</span>
        </router-link>
        <router-link to="/user/exercise">
          <i class="el-icon-soccer"></i>
          <span v-show="!isCollapsed">运动计划</span>
        </router-link>
        <router-link to="/user/assistant">
          <i class="el-icon-cpu"></i>
          <span v-show="!isCollapsed">智能助手</span>
        </router-link>
      </nav>

      <!-- 侧边栏折叠按钮（Element UI 提供的按钮） -->
      <el-button class="toggle-btn" type="primary" @click="toggleSidebar">
        <i :class="isCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
      </el-button>
    </aside>

    <!-- 主要内容区域 -->
    <main class="content">
      <!-- 顶部导航栏 -->
      <Header />
      <!-- 主要内容 -->
      <router-view>
      </router-view>
      
    </main>
  </div>
</template>



<script>
import Header from '@/views/Header.vue';

export default {
  components: {
    Header,  // 注册 Header 组件
  },
  data() {
    return {
      isCollapsed: false, // 是否折叠
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
/* 页面整体布局 */
.user {
  display: flex;
  height: 100vh;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  padding-top: 20px;
  position: relative;
}

/* 折叠状态 */
.sidebar.collapsed {
  width: 70px;
}

/* Logo */
.logo {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
}

/* 菜单导航 */
nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

nav a {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 30px;
  transition: 0.3s;
  width: 80%;
  justify-content: flex-start;
  border-radius: 10px;
  font-family: "Arial Black", "Microsoft YaHei", sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 图标 */
nav i {
  font-size: 22px;
  margin-right: 10px;
}

/* 折叠状态下，仅显示图标 */
.sidebar.collapsed nav i {
  margin-right: 0;
  text-align: center;
  width: 100%;
}

/* 侧边栏折叠按钮（Element UI 按钮） */
.toggle-btn {
  position: absolute;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: 0.3s;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主要内容 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
    background-image:url('../assets/backgroundImage.png');
    background-size: cover;  /* 使背景图片覆盖整个页面 */
    background-position: center center;  /* 让背景图片居中 */
    background-repeat: no-repeat;  /* 防止背景图片重复 */
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.navbar-left {
  font-size: 20px;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
}
</style>