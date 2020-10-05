<template>
  <div class = "container">
    <div class="loading" v-if="loading">
      <i class="fa fa-cog fa-spin"></i>
    </div>
    
    <div  v-else>
      <div  v-if="route != 'search-all'">
        <nav aria-label = "breadcrumb">
          <ol class="breadcrumb">
            <li>
              <a class="breadcrumb-item"
                  v-for="(item,index) in breadcrumb"
                  @click="goto({ 'to': item.route })"
                  v-bind:class = "{ 'active': index + 1 == breadcrumb.length }"
                  >
                {{ item.name }}
              </a>
            </li>
          </ol>
        </nav>
      </div>

      <div ref="main">
        <div v-if="route === 'search-all'">
          <input type="text"
                placeholder="Search in Packages, Methods, Authors"
                class="form-control form-control-md mb-3"
                @keydown.enter="goto({ 'to': 'search-all', 'search': search })"
                v-model="search"
          >

          <Table :tableName="'Packages'"
                  :tableData="getSlicedPackages"
                  :count="packageCount"
                  :to="'package-detail'"
                  :viewAll="'search-package-only'"
          />

          <Table :tableName="'Methods'"
                :tableData="getSlicedMethods"
                :count="methodCount"
                :to="'method-detail'"
                :viewAll="'search-method-only'"
          />

          <Table :tableName="'authors'"
                  :tableData="getSlicedAuthors"
                  :count="authorCount"
                  :to="'package-detail'"
                  :viewAll="'search-author-only'"
          />  
        </div>
                
        <div class="container" v-else-if="route === 'search-package-only'">
            <table-list :searchIn="'package'"
                        :tableData='getPackages'
                        :to="'package-detail'"
                        :tableName="'Packages'"
            /> 
        </div>

        <div class="container" v-if="route === 'search-method-only'">
            <table-list :searchIn="'method'"
                        :tableData='getMethods'
                        :to="'method-detail'"
                        :tableName="'Methods'"
            /> 
        </div>

        <div class="container" v-else-if="route === 'search-author-only'">
            <table-list :searchIn="'author'"
                        :tableData='getAuthors'
                        :to="'package-detail'"
                        :tableName="'Authors'"
            /> 
        </div>
        
        <div class="table-responsive" v-else-if="route === 'package-detail'">
          <package-detail :packageInfo="getSortedPackageInfo"
                          :packageMethods="packageMethods"
                          :to="'method-detail'"
                            
          > 
          </package-detail>
        </div>

        <div v-else-if="route === 'method-detail'">
          <method-detail :methodInfo="getSortedMethodInfo"> 
          </method-detail>            
        </div>
    </div>
  </div>
</div>
</template>

<script>
import Table from "./Table.vue"
import TableList from "./TableList.vue"
import PackageDetail from "./PackageDetail.vue"
import MethodDetail from "./MethodDetail.vue"

import Clipboard from 'v-clipboard'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'meldakb',
  components: {
    Table,
    TableList,
    PackageDetail,
    MethodDetail
  },

  props: {
    emitOnGoto: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableName: null,
      loading: false,
    }
  },

  beforeMount(){
    this.$store.dispatch('search', { searchIn:'package' })
    this.$store.dispatch('search', { searchIn:'method' })
    this.$store.dispatch('search', { searchIn:'author' })
  },

  computed : {
    ...mapState([
      "route",
      "packages",
      "packageCount",
      "methods",
      "methodCount",
      "authors",
      "authorCount",
      "packageMethods",
      "breadcrumb"      
    ]),

    ...mapGetters([
      "getPackages",
      "getMethods",
      "getAuthors",
      "getSlicedPackages",
      "getSlicedMethods",
      "getSlicedAuthors",
      "getSortedPackageInfo",
      "getSortedMethodInfo",
    ]),

    search: {
      get() {
         return this.$store.state.search
      },
      set(searchInput) {
        this.$store.commit('updateSearch', searchInput)
      }
    }
  },

}
</script>

<style scoped>
</style>