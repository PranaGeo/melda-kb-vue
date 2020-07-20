import Vue from "vue";
import Vuex from "vuex";
import VueResource from "vue-resource"

import '@fortawesome/fontawesome-free/css/all.css';
import "bootstrap/dist/css/bootstrap.css";

import store from "./store.js";

Vue.use(Vuex);
Vue.use(VueResource)
import App from "./app.vue";

const render = createElement => createElement(App);

new Vue({ render, store }).$mount("main");