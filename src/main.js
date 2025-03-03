import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // 这里引入 router.js

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
