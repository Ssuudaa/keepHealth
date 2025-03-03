<template>
    <div class="admin">
      <!-- 侧边导航栏 -->
      <aside :class="['sidebar', { collapsed: isCollapsed }]">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
        </div>
  
        <nav>
          <router-link to="/admin/users">
            <i class="el-icon-user"></i>
            <span v-show="!isCollapsed">用户管理</span>
          </router-link>
          <router-link to="/admin/knowledge">
            <i class="el-icon-notebook-2"></i>
            <span v-show="!isCollapsed">设置养生知识</span>
          </router-link>
          <router-link to="/admin/meal">
            <i class="el-icon-food"></i>
            <span v-show="!isCollapsed">发布膳食计划</span>
          </router-link>
          <router-link to="/admin/exercise">
            <i class="el-icon-soccer"></i>
            <span v-show="!isCollapsed">配置运动计划</span>
          </router-link>
          <router-link to="/admin/assistant">
            <i class="el-icon-cpu"></i>
            <span v-show="!isCollapsed">智能助手配置</span>
          </router-link>
        </nav>
  
        <!-- 侧边栏折叠按钮 -->
        <el-button class="toggle-btn" type="primary" @click="toggleSidebar">
          <i :class="isCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
        </el-button>
      </aside>
  
      <!-- 主要内容区域 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script>
  export default {
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
  .admin {
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
    padding: 12px;
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
  
  /* 侧边栏折叠按钮 */
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
    padding: 20px;
  }
  </style>
  