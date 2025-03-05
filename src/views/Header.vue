<template>
    <header class="top-navbar">
      <div class="navbar-left">
        <img src="../assets/logo.png" alt="Logo" style="width: 30px; height: 26px; vertical-align: middle; margin-right: 5px;">
        <span style="font-family: 'SimHei', sans-serif; font-size: 20px;vertical-align: middle;">养生管理系统</span>
        <el-button style="margin-left: 20px;" type="danger" @click="gotouser">点击跳转到user页面，测试用</el-button>
        <el-button style="margin-left: 20px;" type="danger" @click="gotoadmin">点击跳转到admin页面，测试用</el-button>
      </div>
      <div class="navbar-right">
        <el-avatar size="small" :src="require('@/assets/avatar.png')"></el-avatar>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goToUserSetting">个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
    data() {
      return {
      };
    },
    methods: {
     gotouser(){
      this.$router.push("/user");
     },
     loginOut(){
      this.$router.push("/");
     },
     goToUserSetting(){
      this.$router.push("/user/data");
     },
     gotoadmin(){
      this.$router.push("/admin");

    },
    },
  };
  </script>
  
  <style scoped>
  .top-navbar {
    display: flex;
    height: 50px;
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
  