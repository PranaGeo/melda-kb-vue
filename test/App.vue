<template>
  <div id="app">
    <vue-component></vue-component>
  </div>
</template>

<script>
import Component from '../src/Component.vue'

export default {
  name: 'app',
  components: { 'vue-component': Component },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style></style>
