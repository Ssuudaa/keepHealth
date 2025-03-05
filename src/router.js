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
import Welcome from "./views/Welcome.vue"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", component: Landing },
    { path: "/login", component: Login }, // ✅ 登录页面
    { path: "/register", component: Register }, // ✅ 注册页面

    // 用户端路由
    {
      path: "/user",
      component: User,
      children: [
        { path: '', component: Welcome },
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
      children: [
        { path: '', component: Welcome },
        { path: "users", component: UserManagement },
        { path: "knowledge", component: KnowledgeSettings },
        { path: "meal", component: MealPublishing },
        { path: "exercise", component: ExerciseConfig },
        { path: "assistant", component: AssistantConfig },
      ],
    },

    { path: "*", redirect: "/" }, // ✅ 处理 404，未匹配的路径跳转到首页
  ],
});
