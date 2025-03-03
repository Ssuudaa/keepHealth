<template>
    <div class="auth-page">
      <video autoplay loop muted playsinline class="background-video">
        <source src="@/assets/background.mp4" type="video/mp4" />
        您的浏览器不支持视频标签。
      </video>
      <div class="auth-container">
        <h2>登录</h2>
        <input type="text" placeholder="用户名" />
        <input type="password" placeholder="密码" />
        <button @click="login">登录</button>
        <p class="switch">还没有账号？<span @click="goToRegister">去注册</span></p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      login() {
        alert("登录成功！");
        this.$router.push("/home");
      },
      goToRegister() {
        this.$router.push("/register");
      }
    }
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
  