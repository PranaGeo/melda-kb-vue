import Vue from "vue";
import Vuex from "vuex";
import VueResource from "vue-resource"

import store from "./store.js";
import mixins from "./mixins.js"

import '@fortawesome/fontawesome-free/css/all.css';
import "bootstrap/dist/css/bootstrap.css";

Vue.use(Vuex);
Vue.use(VueResource)
Vue.mixin(mixins)

import App from "./app.vue";

const render = createElement => createElement(App);

new Vue({ render, store }).$mount("main");