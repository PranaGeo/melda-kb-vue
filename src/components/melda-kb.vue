<template>
  <div class = "container">
    <div class="loading" v-if="loading">
      <i class="fa fa-cog fa-spin"></i>
    </div>
    
    <div  v-else>
      <div  v-if="route != 'search-all'">
         <nav>BREADCRUMB AREA</nav>
      </div>

      <div ref="main">
        <div v-if="route === 'search-all'">
          <input type="text"
                  placeholder="Search in Packages, Methods, Authors"
                  class="form-control form-control-md mb-3"
                  @keydown.enter="searchInHome()"
                  v-model="search"
          />

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
                          :packageMethods="getPackageMethods"
                            
          > 

          </package-detail>
        </div>

        <div v-else-if="route === 'method-detail'">
          <h2> Method Detail page</h2>
          <method-detail> </method-detail>            
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
import {mapGetters, mapState, mapActions} from 'vuex'

export default {
  name: 'meldakb',
  components: {
    Table,
    TableList,
    PackageDetail,
    MethodDetail
  },

  data() {
    return {
      tableName: null,
      loading: false,
    }
  },

  beforeMount(){
    this.$store.dispatch('search',"package")
    this.$store.dispatch('search',"method")
    this.$store.dispatch('search',"author")
  },

  computed : {
    ...mapState(["route","packages","packageCount","methods","methodCount","authors","authorCount"]),
    ...mapGetters(["getPackages","getMethods","getAuthors","getSlicedPackages","getSlicedMethods","getSlicedAuthors","getSortedPackageInfo","getPackageMethods"]),

    search: {
      get () {
         return this.$store.state.search
      },
      set (searchInput) {
        this.$store.commit('updateSearch', searchInput)
      }
    }
  },

  watch:{
    sortBy(){
      if (this.state == "search-package-only"){
        this.searchAll(this.search, this.searchIn="package" , this.sortBy = this.sortBy)

      }else if ( this.state == "search-method-only") {
        this.searchAll(this.search, this.searchIn = "method" , this.sortBy = this.sortBy)

      }else if ( this.state == "search-author-only")
        this.searchAll(this.search, this.this.searchIn="author" , this.sortBy = this.sortBy)    
    }
  },
  
  methods: {
    ...mapActions(["getMethod"]),
    escapeText (text) {
      var span = document.createElement('span')
      span.innerHTML = text
      span.innerText = span.innerText.replace(/\\n|\n/g," ")   
      return span.innerText
    },

    openUrl (url) {
      url = SERVER + url
      window.open(url,"_blank")
    },
    
    setCount (count) {
      if( count < 1000 ) {
        return count
      } else if ( count > 1000 ) {
        return Math.round(count / 1000) + "K"
      }
    },

    setState (state) {
      this.state = state
      if (state == 'search-all')
        this.breadcrumb = this.breadcrumb.filter(p => p.state == 'search-all')

      else if (state == 'package-detail')
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'package-detail' ||
          p.state == 'search-method-only' || p.state == 'search-all' ||
          p.state == 'search-author-only')

      else if ( state == "search-method-only" )
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'search-method-only' || p.state == 'search-all')
      
      else if ( state == "search-package-only" )
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'search-package-only' || p.state == 'search-all')
      
      else if ( state == "search-author-only" )
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'search-author-only' || p.state == 'search-all')
    },

    showPackageMethods (name) {
      this.getPackageMethods(name)
    },

    showMethod (name) {
      this.getMethod(this.packageName, name)
    },

    searchHandler (searchIn) {
      switch ( searchIn ) {
      case "method":
        if( this.showButton ){
          this.page =  this.page + 1
          this.size = 30
        }
        
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        + "&size=" + this.size + "&page=" + this.page )  
        .then( ({body}) => {
          body.methods.forEach((pkg) => {
                this.methods.push(pkg);
            });    
        })

        if(this.totalCount > this.methods.length){
          this.showButton = true;
        }else{
          this.showButton = false;
        }
        break;
      case "package":
         if( this.showButton ){
          this.page =  this.page + 1
          this.size = 30
        }
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        + "&size=" + this.size + "&page=" + this.page )  
        .then( ({body}) => {
          body.packages.forEach((func) => {
                this.packages.push(func);
            });    
        })
        
        if(this.totalCount > this.packages.length){
          this.showButton = true;
        }else{
          this.showButton = false;
        }
        
        break;
      case "author":
         if( this.showButton ){
          this.page =  this.page + 1
          this.size = 30
        }
        
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        + "&size=" + this.size + "&page=" + this.page )  
        .then( ({body}) => {
          body.packages.forEach((auth) => {
                this.authors.push(auth);
            });    
        })
        if(this.totalCount > this.authors.length){
          this.showButton = true;
        }else{
          this.showButton = false;
        }
        break;
      default:
        break;
      }
     
    },

    getPackageMethods (name) {
      this.loading = true
      this.$http
        .get(BASE  + `/cran-package-detail?package=${name}`)
        .then(({ body }) => {
          this.methods = body.methods
          this.packageInfo = this.sortPackage(body.package)
          this.packageProjects = body.projects
          this.state = 'package-detail'
          this.loading = false

          this.breadcrumb = [
            {
              state: 'search-all',
              name: 'Home'
            },
            {
              state: 'search-package-only',
              name: 'R Package List'
            },
            {
              state: 'package-detail',
              name
            }
          ]
        })
        .catch( () => {
          this.loading = false
        })
    },

    getMethod (packageName, method) {
      this.loading = true
      this.$http
        .get(BASE +`/cran-method-detail?package=${packageName}&method=${method}`)
        .then(({ body }) => {
          this.methods = body.package.methods
          var breadcrumb = [
            {
              state: 'search-all',
              name: 'Home'
            },
            {
              state:'search-method-only',
              name: 'Method List'
            }
          ]
          if (body.package) {
            this.packageInfo = body.package
            this.packageInfo = this.sortPackage(this.packageInfo)
            breadcrumb.push({
              state: 'package-detail',
              name: this.packageName
            })
          }
          
          if (body.method) {
            this.methodInfo = this.sortMethod( body.method )
            this.methodInfo.usageWLib = `library(${this.packageName}) \n${this.methodInfo.Usage}`
            this.methodInfo.exampleWLib = `library(${this.packageName}) \n${this.methodInfo.Example}`
            breadcrumb.push({
              state: 'method-detail',
              name: this.methodInfo.Name
            })
          }
          if ( body.projects ){
            this.methodProjects = body.projects
          }

          this.state = 'method-detail'
          this.breadcrumb = breadcrumb
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    sortMethod (mth) {
      let orderedAndNamedKeys  = mth.order
      let sortedMethodInfo = {}

      orderedAndNamedKeys.forEach( (key,index)=> {
        orderedAndNamedKeys[ index ] = key.replace(/^./, key[0].toUpperCase())
        sortedMethodInfo[ orderedAndNamedKeys[ index ] ] = mth[ key ]
      })
      return sortedMethodInfo
    },
  }
}

</script>

<style scoped>
section {
  background:whitesmoke;
}

.loading {
  text-align: center;
  color: #999;
  font-size: 22px;
  padding: 20px;
}

.list {
  font-size: 12px;
}

.search-card {
  border: none;
  margin-bottom:20px;
}
.nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

pre {
  overflow: auto;
}

.table-responsive { 
  margin:0.1em;
 }
.package-name {
  font-weight: 300;
}

.breadcrumb-item {
color:#007bff !important;
}

.breadcrumb-item.active  {
color:black !important;
}

.package-table td:hover {
  cursor: pointer;
}

.package-meta th {
  max-width: 200px;
}

.table th {
  padding:0.30em !important;

}

.table-borderless {
  margin-bottom: 0.3em;
}

.table td{
  padding:0.30em !important;
}
.package-meta td:before {
  content: ':';
  padding-right: 1rem;
  font-weight: bold;
}
</style>