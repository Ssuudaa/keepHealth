<template>
  <div class="landing">
    <video autoplay loop muted playsinline class="background-video">
      <source src="@/assets/background.mp4" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
    <div class="content">
      <h1>欢迎来到AI养生管理系统</h1>
      <p>您的养生管理助手</p>
      <button @click="startExperience" round>登录/注册</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startExperience() {
      this.$router.push("/login"); // 跳转到 Home 页面
    },
  },
};
</script>

<style scoped>
.landing {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background: #ff9800;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #e68900;
}
</style>
