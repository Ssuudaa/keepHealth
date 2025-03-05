<template>
    <div class="user-management">
      <!-- 搜索框 -->
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名"
          class="search-input"
        />
        <el-select v-model="roleFilter" placeholder="选择角色">
          <el-option label="管理员" value="管理员" />
          <el-option label="用户" value="用户" />
        </el-select>
        <el-button @click="filterUsers" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button @click="reset" type="primary" icon="el-icon-search">重置</el-button>

      </div>
  
      <!-- 用户表格 -->
      <el-table :data="currentPageUsers" border>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="height" label="身高 (cm)" />
        <el-table-column prop="weight" label="体重 (kg)" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 0 ? "启用" : "停用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        :page-size="pageSize"
        :total="filteredUsers.length"
        :current-page="currentPage"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
      />
  
      <!-- 编辑弹窗 -->
      <el-dialog :visible.sync="isEditDialogVisible" title="编辑用户" width="30%">
        <el-form :model="currentUser" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="currentUser.username" disabled />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="currentUser.gender">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="currentUser.role">
              <el-option label="管理员" value="管理员" />
              <el-option label="用户" value="用户" />
            </el-select>
          </el-form-item>
          <el-form-item label="身高 (cm)">
            <el-input v-model="currentUser.height" />
          </el-form-item>
          <el-form-item label="体重 (kg)">
            <el-input v-model="currentUser.weight" />
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="isEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 用户数据
        users: [
          { username: 'user1', gender: '男', role: '管理员', height: 175, weight: 70, status: 1 },
          { username: 'user2', gender: '女', role: '用户', height: 160, weight: 50, status: 1 },
          { username: 'user3', gender: '男', role: '用户', height: 180, weight: 80, status: 0 },
          { username: 'user4', gender: '女', role: '管理员', height: 165, weight: 55, status: 1 },
          { username: 'user5', gender: '男', role: '用户', height: 170, weight: 75, status: 1 },
          { username: 'user6', gender: '女', role: '管理员', height: 160, weight: 50, status: 0 },
          { username: 'user7', gender: '男', role: '管理员', height: 180, weight: 85, status: 1 },
          { username: 'user8', gender: '女', role: '用户', height: 155, weight: 45, status: 1 },
          { username: 'user1', gender: '男', role: '管理员', height: 175, weight: 70, status: 1 },
          { username: 'user2', gender: '女', role: '用户', height: 160, weight: 50, status: 1 },
          { username: 'user3', gender: '男', role: '用户', height: 180, weight: 80, status: 0 },
          { username: 'user4', gender: '女', role: '管理员', height: 165, weight: 55, status: 1 },
          { username: 'user5', gender: '男', role: '用户', height: 170, weight: 75, status: 1 },
          { username: 'user6', gender: '女', role: '管理员', height: 160, weight: 50, status: 0 },
          { username: 'user7', gender: '男', role: '管理员', height: 180, weight: 85, status: 1 },
          { username: 'user8', gender: '女', role: '用户', height: 155, weight: 45, status: 1 },
        ],
        searchQuery: '',
        roleFilter: '',
        filteredUsers: [], // 筛选后的用户数据
        currentPageUsers: [], // 当前页用户数据
        pageSize: 10, // 每页显示的用户数量
        currentPage: 1, // 当前页码
        isEditDialogVisible: false, // 编辑弹窗的可见性
        currentUser: {}, // 当前正在编辑的用户
      };
    },
    mounted() {
      // 初始化时展示所有用户
      this.filteredUsers = [...this.users];
      this.updateCurrentPageUsers();
    },
    methods: {
      // 搜索过滤函数
      filterUsers() {
        this.filteredUsers = this.users.filter(user => {
          const matchesQuery =
            !this.searchQuery ||
            user.username.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesRole = !this.roleFilter || user.role === this.roleFilter;
  
          return matchesQuery && matchesRole;
        });
        this.updateCurrentPageUsers();
      },
      reset(){
         this.searchQuery="",
         this.roleFilter=""
         this.filterUsers()
      },
  
      // 更新当前页显示的用户
      updateCurrentPageUsers() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.currentPageUsers = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
      },
  
      // 页码变化时的处理函数
      handlePageChange(page) {
        this.currentPage = page;
        this.updateCurrentPageUsers();
      },
  
      // 编辑用户
      editUser(user) {
        this.currentUser = { ...user }; // 创建当前编辑用户的副本
        this.isEditDialogVisible = true; // 打开编辑弹窗
      },
  
      // 保存编辑的用户信息
      saveUser() {
        const index = this.users.findIndex(user => user.username === this.currentUser.username);
        if (index !== -1) {
          this.users.splice(index, 1, { ...this.currentUser });
          this.filteredUsers = [...this.users]; // 更新筛选后的用户列表
        }
        this.isEditDialogVisible = false; // 关闭弹窗
        this.updateCurrentPageUsers();
      },
  
      // 启用/停用账户
      toggleStatus(user) {
        user.status = user.status === 0 ? 1 : 0;
        this.filteredUsers = [...this.users]; // 更新筛选后的用户列表
        this.updateCurrentPageUsers();
      },
    },
  };
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-input {
    margin-right: 20px;
    width: 200px;
  }
  
  .el-select {
    width: 200px;
    margin-right: 20px;
  }
  
  .el-button {
    margin-left: 10px;
  }
  
  .el-table .el-table__body {
    height: 400px;
    overflow-y: auto;
  }
  
  .el-pagination {
    margin-top: 20px;
  }
  
  .el-dialog {
    width: 40%;
  }
  </style>
  