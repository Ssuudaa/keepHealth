  import Vue from "vue";
  import Router from "vue-router";

  // 用户端页面
  import User from "./views/User.vue";
  import DataAnalysis from "./views/DataAnalysis.vue";
  import HealthKnowledge from "./views/HealthKnowledge.vue";
  import MealPlan from "./views/MealPlan.vue";
  import ExercisePlan from "./views/ExercisePlan.vue";
  import SmartAssistant from "./views/SmartAssistant.vue";

  // 管理员端页面
  import Admin from "@/views/Admin.vue";
  import UserManagement from "./views/UserManagement.vue";
  import KnowledgeSettings from "./views/KnowledgeSettings.vue";
  import MealPublishing from "./views/MealPublishing.vue";
  import ExerciseConfig from "./views/ExerciseConfig.vue";
  import AssistantConfig from "./views/AssistantConfig.vue";

  // 公共页面
  import Landing from "./views/Landing.vue";
  import Login from "./views/Login.vue";
  import Register from "./views/Register.vue";
  import Welcome from "./views/Welcome.vue";

  Vue.use(Router);

  // ✅ **先创建 router 实例**
  const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
      { path: "/", component: Landing },
      { path: "/login", component: Login }, 
      { path: "/register", component: Register },

      // 用户端路由
      {
        path: "/user",
        meta: { requiresAuth: true },
        component: User,
        children: [
          { path: "", component: Welcome },
          { path: "data", component: DataAnalysis },
          { path: "knowledge", component: HealthKnowledge },
          { path: "meal", component: MealPlan },
          { path: "exercise", component: ExercisePlan },
          { path: "assistant", component: SmartAssistant },
        ],
      },

      // 管理员端路由
      {
        path: "/admin",
        component: Admin,
        meta: { requiresAuth: true },
        children: [
          { path: "", component: Welcome },
          { path: "users", component: UserManagement },
          { path: "knowledge", component: KnowledgeSettings },
          { path: "meal", component: MealPublishing },
          { path: "exercise", component: ExerciseConfig },
          { path: "assistant", component: AssistantConfig },
        ],
      },

      { path: "*", redirect: "/" }, // ✅ 404 处理
    ],
  });

  // ✅ **在 router 上添加导航守卫**
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("jwt_token");
    const role = localStorage.getItem("user_role"); // 获取角色
    // 1. 未登录时，拦截需要权限的页面
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
      alert("请先登录！");
      return next("/login");
    }
  
    // 2. 角色权限控制
    if (role == "0" && to.path.startsWith("/admin")) {
      // 普通用户不能访问 /admin
      alert("权限不足，无法访问管理员页面！");
      return next("/user/data"); // 跳转到用户主页
    } else if (role == "1" && to.path.startsWith("/user")) {
      // 管理员不能访问 /user
      alert("权限不足，无法访问用户页面！");
      return next("/admin/users"); // 跳转到管理员主页
    }
  
    next(); // 放行
  });

  export default router;
