<template>
  <header class="top-navbar">
    <div class="navbar-left">
      <img
        src="../assets/logo.png"
        alt="Logo"
        style="width: 30px; height: 26px; vertical-align: middle; margin-right: 5px"
      />
      <span style="font-family: 'SimHei', sans-serif; font-size: 20px; vertical-align: middle">
        养生管理系统
      </span>
    </div>
    <div class="navbar-right">
      <el-avatar size="small" :src="require('@/assets/avatar.png')"></el-avatar>
      <!-- <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <i class="el-icon-caret-bottom"></i>
        </span> -->
        <!-- <el-dropdown-menu slot="dropdown"> -->
          <!-- <el-dropdown-item v-if="userRole === '0'" @click.native="openPasswordDialog">
            修改个人密码
          </el-dropdown-item> -->
          <el-dropdown-item @click.native="logout" class="logout-item">退出</el-dropdown-item>
        <!-- </el-dropdown-menu> -->
      <!-- </el-dropdown> -->
    </div>

    <!-- 🔹 修改密码弹窗 -->
    <el-dialog title="修改个人密码" :visible.sync="dialogVisible" width="400px">
      <el-form ref="passwordForm" :model="passwordData" :rules="passwordRules">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordData.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordData.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPassword">确认修改</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      userRole: localStorage.getItem("user_role"), // 获取用户角色
      dialogVisible: false, // 控制弹窗显示
      passwordData: {
        newPassword: "",
        confirmPassword: "",
      },
      passwordRules: {
        newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: (rule, value, callback) => {
            if (value !== this.passwordData.newPassword) {
              callback(new Error("两次输入的密码不一致"));
            } else {
              callback();
            }
          }, trigger: "blur" }
        ],
      },
    };
  },
  methods: {
    openPasswordDialog() {
      this.dialogVisible = true;
    },
    submitPassword() {
      const { newPassword, confirmPassword } = this.passwordData;

      // 1. 检查密码长度是否 >= 6
      if (newPassword.length < 6) {
        this.$message.error("密码长度至少6位！");
        return;
      }

      // 2. 确保两次输入一致
      if (newPassword !== confirmPassword) {
        this.$message.error("两次输入的密码不一致！");
        return;
      }

      console.log("提交新密码:", newPassword);
      this.$message.success("密码修改成功！");
      this.dialogVisible = false; // 关闭弹窗
    },
    logout() {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_role"); // 清除 Token
      this.$router.push("/login"); // 退回到登录页
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
.el-dropdown-menu__item:hover {
  background-color: transparent !important;
}
::v-deep(.logout-item) {
  color:white !important;
}
</style>
