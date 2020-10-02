<template>
  <div class="container-fluid">
    <div class="mt-2">
      <meldakb ref="mainComp" @goto="updateKbUrl" :emitOnGoto="false"/>
    </div>  
  </div>
</template>

<script>
  import Meldakb from "./components/melda-kb.vue";

  export default {
    components: {
      Meldakb,
    },

    data () {
      return {
        route: null
      }
    },

    watch: {
      "$route": function() {
        this.$refs.mainComp.$store.dispatch('setRoute',{})
      }

    },
    methods: {
      updateKbUrl(route) {
        if (route.packageName) {
          uri = '/' + route.packageName
        }
        if (route.methodName) {
          uri += '/' + route.methodName
        }
        this.$router.push('/' + route.to + uri)
      }    
    },

  }
</script>

<style scoped>
</style>