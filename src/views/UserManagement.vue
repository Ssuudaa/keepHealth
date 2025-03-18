<template>
  <div class="user-management">
    <!-- 搜索框 -->
    <!-- <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名"
        class="search-input"
      />
      <el-select v-model="roleFilter" placeholder="选择角色">
        <el-option label="管理员" value="管理员" />
        <el-option label="用户" value="用户" />
      </el-select>
      <el-button @click="filterUsers" type="primary" icon="el-icon-search"
        >搜索</el-button
      >
      <el-button @click="reset" type="primary">重置</el-button>
    </div> -->

    <!-- 用户表格 -->
    <el-table :data="currentPageUsers" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色">
        <template slot-scope="scope">
          {{ scope.row.role === 1 ? "管理员" : "用户" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="changePassword(scope.row)"
            >修改密码</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :total="totalUsers"
      :current-page="currentPage"
      @current-change="handlePageChange"
      layout="prev, pager, next, jumper"
    />

    <!-- 修改密码弹窗 -->
    <el-dialog
      :visible.sync="isPasswordDialogVisible"
      title="修改密码"
      width="30%"
    >
      <el-form :model="passwordForm" label-width="100px" ref="passwordForm">
        <el-form-item label="新密码" prop="newPassword" :rules="passwordRules">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          :rules="confirmPasswordRules"
        >
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePassword">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      users: [],
      totalUsers: 0,
      searchQuery: "",
      roleFilter: "",
      currentPage: 1,
      pageSize: 10,
      isPasswordDialogVisible: false,
      passwordForm: { id: "", newPassword: "", confirmPassword: "" },
      passwordRules: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { min: 6, message: "密码长度至少6位", trigger: "blur" },
      ],
      confirmPasswordRules: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== this.passwordForm.newPassword) {
              callback(new Error("两次输入密码不一致"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    currentPageUsers() {
      return this.users;
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.get(
          `/admin/users?pageNum=${this.currentPage}&pageSize=${this.pageSize}`
        );
        if (response.code === 200) {
          this.users = response.rows;
          this.totalUsers = response.total;
        }
      } catch (error) {
        console.error("获取用户数据失败", error);
      }
    },
    filterUsers() {
      this.currentPage = 1;
      this.fetchUsers();
    },
    reset() {
      this.searchQuery = "";
      this.roleFilter = "";
      this.fetchUsers();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchUsers();
    },
    changePassword(user) {
      this.passwordForm.id = user.id;
      this.passwordForm.newPassword = "";
      this.passwordForm.confirmPassword = "";
      this.isPasswordDialogVisible = true;
    },
    async savePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await api.put(`/admin/updatePassword?id=${this.passwordForm.id}&password=${this.passwordForm.newPassword}`
        );
            if (response.code === 200) {
              this.$message.success("密码修改成功");
              this.isPasswordDialogVisible = false;
            } else {
              this.$message.error("修改失败: " + response.msg);
            }
          } catch (error) {
            console.error("修改密码失败", error);
            this.$message.error("请求失败");
          }
        }
      });
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
.el-pagination {
  margin-top: 20px;
}
</style>
