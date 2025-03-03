<template>
    <div class="landing">
      <h1>欢迎来到 KeepHealthy</h1>
      <p>您的健康管理助手</p>
      <button @click="startExperience">立即体验</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      startExperience() {
        this.$router.push("/home"); // 跳转到 Home 页面
      },
    },
  };
  </script>
  
  <style scoped>
  .landing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #42b983, #2c3e50);
    color: white;
    text-align: center;
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
  