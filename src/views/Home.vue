<template>
  <div class="home">
    <aside class="sidebar">
      <router-link to="/home/data">数据分析</router-link>
      <router-link to="/home/knowledge">养生知识</router-link>
      <router-link to="/home/meal">膳食计划</router-link>
      <router-link to="/home/exercise">运动计划</router-link>
      <router-link to="/home/assistant">智能助手</router-link>
    </aside>

    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background: #34495e;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.sidebar a {
  color: white;
  text-decoration: none;
  padding: 10px;
  display: block;
}
.sidebar a:hover {
  background: #2c3e50;
}
.content {
  flex: 1;
  padding: 20px;
}
</style>
