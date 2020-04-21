<template>
  <div class = "container">
    <div class="loading" v-if="loading">
      <i class="fa fa-cog fa-spin"></i>
    </div>
    
    <div v-else>
      <div  v-if="state != 'search-all'">
        <nav aria-label = "breadcrumb">
          <ol class="breadcrumb">
          <li class="breadcrumb-item"
              v-for="(item,index) in breadcrumb"
              @click="setState(item.state)"
              v-bind:class = "{ 'active': index + 1 == breadcrumb.length }"
              >
              <a>
             {{ item.name }}
              </a>
          </li>
          </ol>
        </nav>
        </a>
      </div>

      <div style="clear: both"></div>

      <div ref="main">
        <div class="table-responsive" v-if="state === 'search-all'">
          <input
            type="text"
            placeholder="Search in Packages, Methods, Authors"
            class="form-control form-control-md mb-3"
            @keydown.enter="searchInHome()"
            v-model="search"
          />
          
          <div class ="card search-card" v-if=" packages.length != 0 ">
            <table class="table table-borderless" style="borderless">
              <tbody>
                <tr class="table-active">
                  <th style="text-align:left;">Packages
                    <span class="badge badge-pill badge-success">
                    {{ setCount(packageCount) }} 
                    </span>
                  </th>
                  <td
                  style="text-align:right;"><button class ="btn btn-primary"
                  @click="searchAll( searchIn = 'package')"> View All </button></td>
                </tr>
            </tbody>
            </table>
            <table
            class="table table-borderless table-hover package-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="packageItem in packages.slice(0,3)"
                @click="showPackageMethods(packageItem.name)"
              >
                <td
                  class="text-primary package-name"
                  style="width: 60px"
                  :title="packageItem.name"
                >
                  {{ packageItem.name }}
                </td>
                <td
                  class="nowrap package-description"
                  style="max-width: 1px"
                  :title="packageItem.description"
                  v-html="packageItem.description"
                ></td>
                <td
                  class="package-version nowrap"
                  style="width: 35px"
                  :title="packageItem.version"
                >
                  {{ packageItem.version }}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          
          <div class ="card search-card" v-if="searchMethods.length != 0">
            <table class="table table-borderless" style="borderless">
              <tbody>
                <tr class="table-active">
                  <th style="text-align:left;">Methods
                  <span class="badge badge-pill badge-success">{{ setCount(methodCount) }}</span>
                  </th>
                  <td  class="package-name"
                  style="text-align:right;">
                  <button class ="btn btn-primary"
                  @click="searchAll( searchIn = 'method' )"> View All </button>
                  </td>
                </tr>
            </tbody>
            </table>
            <table
            class="table table-borderless table-hover package-table">
            <thead>
              <tr>
                <th style="text-align:left;">Name</th>
                <th>Description</th>
                <th style="text-align:right;">Package</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="methodItem in searchMethods.slice(0,3)"
                @click="getMethod(methodItem.packageName,methodItem.name)"
              >
                <td
                  class="text-primary package-name"
                  style="max-width: 1px; text-align:left;" 
                  :title="methodItem.name"
                >
                {{ methodItem.name}}
                </td>
                 <td class="nowrap package-description"
                  style="max-width: 1px;"
                  :title="methodItem.title"
                  v-html="methodItem.title "
                 >
                </td>
                <td
                class="text-primary package-name"
                  style="max-width: 1px; text-align:right;"
                  :title="methodItem.packageName"
                  v-html="methodItem.packageName "
                >
                </td>

              </tr>
            </tbody>
          </table>
          </div>

          <div class="card search-card" v-if="authors.length != 0">
            <table class="table table-borderless" style="borderless">
              <tbody>
                <tr class="table-active">
                  <th style="text-align:left;">Authors
                      <span class="badge badge-pill badge-success">
                    {{ setCount(authorCount) }}
                    </span>
                  </th>
                  <td  class="package-name"
                  style="text-align:right;"><button class ="btn btn-primary"
                  @click="searchAll( searchIn = 'author' )"> View All </button></td>
                </tr>
            </tbody>
            </table>
            <table
            class="table table-borderless table-hover package-table">
            <thead>
              <tr>
                <th style="text-align:left;">Name</th>
                <th></th>
                <th style="text-align:right;">Package</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="packageItem in authors.slice(0,3)"
                @click="showPackageMethods(packageItem.name)"
              >
                <td
                  class="nowrap package-description"
                  style="max-width: 1px; text-align:left;" 
                  :title="packageItem.author"
                >
                {{  packageItem.author}}
                </td>
                <td
                 >
                </td>
                <td
                  class="text-primary package-name"
                  style="width: 60px"
                  :title="packageItem.name"
                >
                  {{ packageItem.name }}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <div v-else>
            <div v-if="( isSearching && searchMethods.length == 0 ) && 
            ( isSearching&& packages.length == 0 ) " class="alert alert-info"
             role="alert">
              Nothing found!
            </div>
          </div>
        </div>
        
        <div v-else-if="state === 'search-method-only'">
          <input
            type="text"
            placeholder="Search in Methods"
            class="form-control form-control-md mb-3"
            @keydown.enter="searchAll( searchIn = 'method' )"
            v-model="search"
          />
            <table
            class="table table-hover package-table">
            <thead>
              <tr>
                <th>Method Name</th>
                <th>Method Description</th>
                <th>Package</th>

              </tr>
            </thead>
            <tbody>
              <tr
                v-for="methodItem in searchMethods"
                @click="getMethod(methodItem.packageName,methodItem.name)"
              >
                <td
                  class="text-primary package-name"
                  :title="methodItem.name"
                >
                  {{ (methodItem.name) }}
                </td>
                <td
                  class="package-version nowrap"
                  
                  :title="(methodItem.description)"
                >
                  {{ (methodItem.title) }}
                </td>
                  <td class="text-primary package-name"
                  :title="methodItem.packageName"
                  v-html="methodItem.packageName"
                ></td>
              </tr>
            </tbody>
          </table>
          <button type="button" 
          class="btn btn-block btn-warning"
          @click="searchHandler(searchIn = 'method')"
          v-if = showButton
          style="background-color:#ff7b00"
          >Load More</button>
        </div>
        
        <div v-else-if="state === 'search-package-only'">
          <input
            type="text"
            placeholder="Search in Packages"
            class="form-control form-control-md mb-3"
            @keydown.enter="searchAll(searchIn = 'package' )"
            v-model="search"
          />
          <table
            class="table table-hover package-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="packageItem in packages"
                @click="showPackageMethods(packageItem.name)"
              >
                <td
                  class="text-primary package-name"
                  style="width: 60px"
                  :title="(packageItem.name)"
                >
                  {{ (packageItem.name) }}
                </td>
                <td
                  class="nowrap package-description"
                  style="max-width: 1px"
                  :title="(packageItem.description)"
                  v-html="(packageItem.description)"
                ></td>
                <td
                  class="package-version nowrap"
                  style="width: 35px"
                  :title="(packageItem.version)"
                >
                  {{ (packageItem.version) }}
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" 
          class="btn btn-block btn-warning"
          @click="searchHandler(searchIn = 'package')"
          v-if = showButton
          style="background-color:#ff7b00"
          >Load More</button>
        </div>
      
      <div v-else-if="state === 'search-author-only'">
            <input
              type="text"
              placeholder="Search in Authors"
              class="form-control form-control-md mb-3"
              @keydown.enter="searchAll( searchIn = 'author' )"
              v-model="search"
            />
            <table
            class="table table-borderless table-hover package-table">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
                <th>Package</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="packageItem in authors"
                @click="showPackageMethods(packageItem.name)"
              >
                <td
                  class="nowrap package-description"
                  style="max-width: 1px"
                  :title="(packageItem.author)"
                  v-html="(packageItem.author) "
                >
                </td>
                <td
                 >
                </td>
                  <td
                    class="text-primary package-name"
                    style="width: 60px"
                    :title="(packageItem.name)"
                  >
                  {{ (packageItem.name) }}
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" 
          class="btn btn-block btn-warning"
          @click="searchHandler(searchIn = 'author')"
          style="background-color:#ff7b00"
          v-if = showButton
          >Load More</button>
        </div>
        
        <div class="table-responsive" v-else-if="state === 'package-detail'">
          <table class="table table-striped package-meta">
            <tbody>
              <tr v-for="(item,key) in packageInfo">
                <th> {{key }} </th>
                <td v-html="item"> 
                </td>
              </tr>
              
            </tbody>
          </table>
          <h4 class="pl-1">Methods</h4>
          <table v-if="methods.length == 0">
            <tr>
              <td>
                No methods
              </td>
            </tr>
          </table>

          <table class="table table-hover package-table" v-else>
            <thead>
              <th style="width: 100px">
                Name
              </th>
              <th>
                Description
              </th>
            </thead>
            <tbody>
              <tr
                v-for="methodItem in methods"
                @click="showMethod(methodItem.name)"
                :title="methodItem.name"
              >
                <td class="text-primary package-name">
                  {{ (methodItem.name) }}
                </td>
                <td
                  :title="escapeText(methodItem.description)"
                  class="nowrap"
                  style="max-width: 1px"
                  v-html="(methodItem.description)"
                ></td>
              </tr>
            </tbody>
          </table>
        
        <section v-if="packageProjects.length != 0">
          <h4> Executable Projects using the {{ packageName }} package </h4>
           <table
            class="table table-borderless table-hover package-table">
            <tbody>
              <tr v-for="project in packageProjects ">
              <td class="nowrap package-description">
                {{ project.title }}
                by  {{ project.owner.name }}
                <button class="btn btn-default btn-sm btn-secondary"
                          type="button"
                          @click='$emit("fork",project.uri)'
                          title="Fork">Fork
                          <i class="fa fa-code-branch"></i>
                </button>
               
                <button class="btn btn-default btn-sm btn-secondary pl-2"
                          type="button"
                          title="Open project in new window"
                          @click="openUrl(project.uri)"
                          >Open in melda.io
                          <i class="fa fa-external-link-square-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        </div>

        <div v-else-if="state === 'method-detail'">
          <table class="table table-striped package-meta">
            <tbody>
              <tr>
                <th style="width: 100px">
                   Package:
                </th>
                <td>
                  {{ packageName }}
                </td>
              </tr>
                <tr v-for="(item,key) in methodInfo">
                <th> {{ key }} </th>
                <td v-html="item"> 
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="methodInfo.Usage">
            <h4>
              Usage
              <button
                class="btn btn-sm btn-success"
                @click="$emit('eval', methodInfo.UsageWLib, 'R')"
              >
                <i class="fa fa-play"></i>
              </button>
            </h4>
            <pre v-html="methodInfo.Usage"></pre>
          </div>

          <div v-if="methodInfo.Argument && methodInfo.Argument.length !== 0">
            <h4>Arguments</h4>
            <table class="table">
              <thead>
                <tr>
                  <th style="width:100px">Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="arg in methodInfo.Argument">
                  <td v-html="arg.name"></td>
                  <td v-html="arg.description"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="methodInfo.Value && methodInfo.Value.length !== 0">
            <h4>Value</h4>
            <table class="table">
              <thead>
                <tr>
                  <th style="width:100px">Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="arg in methodInfo.Value" >
                  <td v-html="arg.name"></td>
                  <td v-html="arg.description"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="methodInfo.Example">
            <h4>
              Examples
              <button
                class="btn btn-sm btn-success"
                @click="$emit('eval', methodInfo.ExampleWLib, 'R')"
              >
                <i class="fa fa-play"></i>
              </button>
            </h4>
            <pre v-html="methodInfo.Example"></pre>
          </div>
       
       <section v-if="methodProjects.length != 0">
          <h4> Executable Projects using the {{ methodInfo["Name"] }} method </h4>
           <table
            class="table table-borderless table-hover package-table">
            <tbody>
              <tr v-for="project in methodProjects ">
              <td class="nowrap package-description">
                {{ project.title }}
                by {{ project.owner.name }}
                <button class="btn btn-default btn-sm btn-secondary"
                          type="button"
                          @click='$emit("fork",project.uri)'
                          title="Fork">Fork
                          <i class="fa fa-code-branch"></i>
                </button>
               
                <button class="btn btn-default btn-sm btn-secondary pl-2"
                          type="button"
                          title="Open project in new window"
                          @click="openUrl(project.uri)"
                          >Open in melda.io
                          <i class="fa fa-external-link-square-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
      </div>
    </div>
  </div>
</template>

<script>
const BASE = "https://appdev.melda.io/api/rkb" 
const API = "https://kbdev.melda.io/"
const SERVER = "https://appdev.melda.io/" 

export default {
  name: 'MeldaKnowledgeBase',
  props:{
    user:{
      default:null,
      required:false
    }
  },
  data() {
    return {
      totalCount:0,
      packageCount:0,
      methodCount:0,
      authorCount:0,
      isSearching: false,
      state: 'search-all',
      loading: false,
      showButton: true,
      size:30,
      packageInfo: {},
      methodInfo: {
        name: '',
        alias: '',
        docType: '',
        title: '',
        details: '',
        references: '',
        Keyword: '',
      },
      packages: [],
      methods: [],
      authors: [],
      searchMethods: [],
      packageProjects: [],
      methodProjects: [],
      breadcrumb: [
        {
          name: 'Home',
          state: 'search-all'
        }
      ],
      page: 1,
      totalPages: 0,
      search: '',
      packageName: '',
    }
  },

  updated() {
    this.fixMeldaKbUrls()
  },
  
  methods: {
    fixMeldaKbUrls() {
      var selectors = [
        new RegExp('/method-detail'),
        new RegExp('/package-detail')
      ]

      var els

      if (this.$refs.main) {
        els = Array.prototype.slice.call(
          this.$refs.main.querySelectorAll('[href]')
        )

        els.forEach(el => {
          var url = el.href.toString()
          var relative = url.replace(
            window.location.origin.toString() + '/',
            ''
          )
          var match = false

          selectors.forEach(endpoint => {
            match = match || endpoint.test(url)
          })

          if (match) {
            el.href = window.KB_SERVER + relative
            el.target = '_blank'
          }
        })
      }
    },

    escapeText(text) {
      var span = document.createElement('span')
      span.innerHTML = text
      span.innerText = span.innerText.replace(/\\n|\n/g," ")   
      return span.innerText
    },

    openUrl(url){
      url = SERVER + url
      window.open(url,"_blank")
    },

    setCount( count) {
      if( count < 1000 ) {
        return count
      } else if ( count > 1000 ) {
        return Math.round(count / 1000) + "K"
      }
    },

    setState(state) {
      this.state = state
      if (state == 'search-all')
        this.breadcrumb = this.breadcrumb.filter(p => p.state == 'search-all')
      else if (state == 'package-detail')
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'package-detail' || p.state == 'search-package-only' || 
          p.state == 'search-method-only' || p.state == 'search-all' ||
          p.state == 'search-author-only'
        )
      else if (state == "method-detail")
        this.breadcrumb = this.breadcrumb.filter(
          p => p.state == 'package-detail' || p.state == 'search-package-only' || 
          p.state == 'search-method-only' || p.state == 'search-all' ||
          p.state == 'search-author-only'
        )
    },

    showPackageMethods(name) {
      this.getPackageMethods(name)
    },


    showMethod(name) {
      this.getMethod(this.packageName, name)
    },

    searchHandler(searchIn) {
      switch ( searchIn ) {
      case "method":
        if( this.showButton ){
          this.page = Math.floor(this.searchMethods.length / 5)  + 1
        }
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        +"&page=" + this.page)
        .then( ({body}) => {
          body.methods.forEach((pkg) => {
                this.searchMethods.push(pkg);
            });    
        })

        if(this.totalCount > this.searchMethods.length){
          this.showButton = true;
        }else{
          this.showButton = false;
        }
        break;
      case "package":
         if( this.showButton ){
          this.page = Math.floor(this.packages.length / 5)  + 1
        }
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        +"&page=" + this.page)
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
          this.page = Math.floor(this.authors.length / 5)  + 1
        }
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn 
        +"&page=" + this.page)
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

    getPackageMethods(name) {
      this.loading = true
      this.$http
        .get(BASE  + `/cran-package-detail?package=${name}`)
        .then(({ body }) => {
          console.log(body)
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

    getMethod(packageName, method) {
      this.loading = true
      this.$http
        .get(BASE +`/cran-method-detail?package=${packageName}&method=${method}`)
        .then(({ body }) => {
          console.log(body)
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
            this.methodInfo = this.sortMethod(body.method)
            this.methodInfo.UsageWLib = `library(${this.packageName}) \n${this.methodInfo.Usage}`
            this.methodInfo.ExampleWLib = `library(${this.packageName}) \n${this.methodInfo.Example}`
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

    searchAll(searchIn = "all" ){
      this.page = 1
      this.isSearching = true
      this.loading = true
        this.$http
        .get(API + '/search?q=' + this.search + '&in=' + searchIn +'&size=' + this.size
        +"&page=" + this.page)
        .then( ({body}) => {
          var breadcrumb = [
            {
              state: 'search-all',
              name: 'Home'
            }
          ]
          switch ( searchIn ) {
          case "all": 
            this.searchMethods = body.methods;
            this.state = "search-all"
            this.totalCount = body.count;
            break;
          case "method":
            this.totalCount = body.count;
            this.searchMethods = body.methods;
            this.state = "search-method-only"
            if(this.breadcrumb.length <= 1){
              this.breadcrumb.push({
              state: 'search-method-only',
              name: 'R Method List'
            })
            }
            if(this.totalCount > this.searchMethods.length){
              this.showButton = true;
            }else{
              this.showButton = false;
            }
            break;
          case "package":
            this.packages = body.packages
            this.totalCount = body.count;
            this.state = "search-package-only"

            if(this.breadcrumb.length <= 1){
              this.breadcrumb.push({
              state: 'search-package-only',
              name: 'R Package List'
            })
            }
            if(this.totalCount > this.packages.length){
              this.showButton = true;
            }else{
              this.showButton = false;
            }
            break;
          case "author":
            this.totalCount = body.count;
            this.authors= body.packages;
            this.state = "search-author-only"
            if(this.breadcrumb.length <= 1){
              this.breadcrumb.push({
              state: 'search-author-only',
              name: 'Author List'
            })
            }
            if(this.totalCount > this.authors.length){
              this.showButton = true;
            }else{
              this.showButton = false;
            }
            break;  
          default:
            this.state = "search-all"
            this.totalCount = body.count;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false
        })
    },

    searchInHome(){
         this.$http.get(API +'/search?q=' + this.search + '&in=package' 
         + "&size=" + this.size)
        .then( ({body}) => {
          this.packages = body.packages;
          this.packageCount = body.count
        })
        this.$http.get(API +'/search?q=' + this.search + '&in=method'
        + "&size=" + this.size)
        .then( ({body}) => {
          this.searchMethods = body.methods;
          this.methodCount = body.count
        })        
        this.$http.get(API +'/search?q=' + this.search + '&in=author' 
        + "&size=" + this.size)
        .then( ({body}) => {
          this.authors = body.packages;
          this.authorCount = body.count
        })   
    },

    sortPackage(pkg){
      let orderedKeys= ["name","description","version","depends","imports",
      "suggests","published","author","maintainer","bugreports","license",
      "url","needscompilation","materials","inviews","linkingto","cranchecks"]
      let namedKeys= ["Package Name","Description", "Version","Depends","Imports",
      "Suggests", "Published", "Author", "Maintainer", "Bug Reports","License",
      "Url", "Needs Compilation", "Materials", "In views", "Linking to", "CRAN Checks"]
      let unsortedKeys  = Object.keys(pkg)
      let sortedPackageInfo = {}

      orderedKeys.forEach((key,index) => {
        if( unsortedKeys.includes(key)){
            sortedPackageInfo [ namedKeys[ index ] ] = pkg [ key ]        
        }
      })
      this.packageName = sortedPackageInfo[ "Package Name"]
      return sortedPackageInfo 
    },

    sortMethod(mth){
      let orderedAndNamedKeys  = mth.order
      let sortedMethodInfo = {}

      orderedAndNamedKeys.forEach( (key,index)=> {
        orderedAndNamedKeys[ index ] = key.replace(/^./, key[0].toUpperCase())
        sortedMethodInfo[ orderedAndNamedKeys[ index ] ] = mth[ key ]
      })
      return sortedMethodInfo
    }

    
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
