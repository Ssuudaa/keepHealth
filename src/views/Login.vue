<template>
  <div class="auth-page">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/background.mp4" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
    <div class="auth-container">
      <h2>登录</h2>
      <input v-model="username" type="text" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button @click="login">登录</button>
      <p class="switch">
        还没有账号？<span @click="goToRegister">去注册</span>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        if (!this.username) {
          alert("用户名不能为空");
          return;
        }
        if (!this.password) {
          alert("密码不能为空");
          return;
        }
        const response = await api.post("/user/login", {
          username: this.username,
          password: this.password,
        });
        if (response.code === 200) {
          const token = response.data.token;
          localStorage.setItem("jwt_token", token);
          console.log("Token:", token);

          // ✅ 等待 checkRole() 获取用户角色
          const role = await this.checkRole();
          console.log("Role:", role);
          if (role !== null) {
            localStorage.setItem("user_role", role);
            alert("登录成功！");
            if (role === 0) {
              this.$router.push("/user/data");
            } else if (role === 1) {
              this.$router.push("/admin/users");
            }
          }
        } else {
          alert(response.data.msg || "登录失败，请检查用户名和密码");
        }
      } catch (error) {
        console.error("登录失败:", error);
        alert(error.response.data.msg);
      }
    },

    async checkRole() {
      try {
        const response = await api.get("/user/info");

        if (response.code === 200) {
          return response.data.role; // ✅ 直接返回 role
        } else {
          console.error("获取用户角色失败:", response.msg);
          return null;
        }
      } catch (error) {
        console.error("请求失败:", error);
        return null;
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.auth-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
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