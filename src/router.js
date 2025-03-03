import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import DataAnalysis from "./views/DataAnalysis.vue";
import HealthKnowledge from "./views/HealthKnowledge.vue";
import MealPlan from "./views/MealPlan.vue";
import ExercisePlan from "./views/ExercisePlan.vue";
import SmartAssistant from "./views/SmartAssistant.vue";
import Landing from "./views/Landing.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", component: Landing },
    {
      path: "/home",
      component: Home,
      children: [
        { path: "data", component: DataAnalysis },
        { path: "knowledge", component: HealthKnowledge },
        { path: "meal", component: MealPlan },
        { path: "exercise", component: ExercisePlan },
        { path: "assistant", component: SmartAssistant },
      ],
    },
  ]
});
