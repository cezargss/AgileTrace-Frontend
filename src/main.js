import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import vuetify from "./plugins/vuetify";
import router from "./router";
import http from "./helpers/http";
import translate from "./helpers/translate";
import breadCrumbs from "./helpers/breadCrumbs";
import locale from "element-ui/lib/locale/lang/pt-br";
import axios from "axios";
import Loading from "vue-loading-overlay";
import notificationHandler from "./helpers/notificationHandler";

import "vue-loading-overlay/dist/vue-loading.css";
import Notifications from "vue-notification";
import VueHtml2pdf from "vue-html2pdf";
import VueCurrencyInput from "vue-currency-input";
import VueMask from "v-mask";
import VueApexCharts from "vue-apexcharts";
import moment from "moment";

const pluginOptions = {
  globalOptions: {
    distractionFree: false,
    valueAsInteger: false,
    autoDecimalMode: true,
    currency: null,
    locale: "pt-br",
  },
};

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

Vue.prototype.$breadCrumbs = breadCrumbs;
Vue.prototype.$http = http;
Vue.prototype.$notificationHandler = notificationHandler;
Vue.prototype.$translate = translate;

Vue.use(VueCurrencyInput, pluginOptions);
Vue.use(VueMask);
Vue.use(ElementUI, { locale });
Vue.use(Notifications);
Vue.use(VueHtml2pdf);
Vue.use(Loading);
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

new Vue({
  axios,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
