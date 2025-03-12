<template>
  <div class="auth-page">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/background.mp4" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
    <div class="auth-container">
      <h2>注册</h2>
      <input v-model="username" type="text" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <input v-model="confirmPassword" type="password" placeholder="确认密码" />
      <button @click="register">注册</button>
      <p class="switch">已有账号？<span @click="goToLogin">去登录</span></p>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (!this.username || !this.password || !this.confirmPassword) {
        alert("请填写所有字段！");
        return;
      }

      if (this.username.length < 3 || this.username.length > 20) {
        alert("用户名长度必须是3到20个字！");
        return;
      }

      if (this.password.length < 6 || this.password.length > 32) {
        alert("密码长度必须是6到32个字！");
        return;
      }

      try {
        const response = await api.post("/user/signup", {
          username: this.username,
          password: this.password,
        });

        if (response.data.code === 200) {
          alert("注册成功！");
          this.$router.push("/login");
        } else {
          alert(response.data.msg || "注册失败，请稍后再试");
        }
      } catch (error) {
        alert(error.response.data.msg);
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* 样式保持不变 */
.auth-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-color: black;
}

.auth-container {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  text-align: center;
  color: white;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 18px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #369e75;
}

.switch {
  margin-top: 10px;
  font-size: 14px;
}

.switch span {
  color: #ff9800;
  cursor: pointer;
}

.switch span:hover {
  text-decoration: underline;
}
</style>
