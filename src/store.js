import Vue from "vue";
import Vuex from "vuex";
import axios from "axios"
Vue.use(Vuex);

const BASE = "https://appdev.melda.io/api/rkb" 
const API = "https://kbdev.melda.io/"
const SERVER = "https://dev.melda.io/" 

function setApiUrl(search,searchIn) {
  let size = 30
  let sortBy = ""
  return `${API}/search?q=${search}&in=${searchIn}&size=${size}&sort=${sortBy}` 
}

function setBaseUrl(packageName,methodName) {
  return `${BASE}/cran-method-detail?package=${packageName}&method=${methodName}`
}

function setPackageBaseUrl(packageName) {
  return `${BASE}/cran-package-detail?package=${packageName}`
}

function setCount(count) {
  return count < 1000 ? count : Math.round(count/ 1000) + "K" 
}

export default new Vuex.Store({
  state: {
    methodKeys:['Usage','Argument','Example','Order','Alias','methodId',
    "Methods","Value","usageWLib","exampleWLib"],
    totalCount:0,
    packageCount:0,
    methodCount:0,
    authorCount:0,
    isSearching: false,
    route: 'search-all',
    loading: false,
    showButton: true,
    packageInfo: {},
    methodInfo: {},
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
    packageMethods: [],
    totalPages: 0,
    search: '',
    packageName: '',
    sortBy:'Most Related',
     },

  mutations: {
    setPackagesCount: (state,packageCount) => state.packageCount = packageCount,

    setMethodsCount: (state,methodCount) => state.methodCount = methodCount,

    setAuthorsCount: (state,authorCount) => state.authorCount = authorCount,

    setPackagesResult: (state, packages) => state.packages = packages,

    setAuthorsResult: (state, authors) => state.authors = authors,

    setMethodsResult: (state, methods) => state.methods = methods,

    updateSearch: (state,searchInput) => state.search = searchInput,

    setCurrentRoute: (state,route) => state.route = route,
    
    setPackageItemResult: (state,packageInfo) => state.packageInfo = packageInfo,
    
    setPackageMethods: (state,packageMethods) => state.packageMethods = packageMethods,
    
    // setTasks: (state, object) => state.object = object
  },

  actions: {
      async search ({commit}, searchIn) {
        try{
          let url = setApiUrl (this.state.search, searchIn)
          let response = await axios.get(url)
          if (!response.data) return;

          switch (searchIn) {
          case "all" : 
             commit('setMethodsResult', response.data.methods)
             commit('setPackagesResult', response.data.packages)
             break;
          case "package" :
            commit('setPackagesResult', response.data.packages)
            commit('setPackagesCount', response.data.count)
            break;
          case "method" :
            commit('setMethodsResult', response.data.methods)
            commit('setMethodsCount', response.data.count)
            break;
          case "author" :
            commit('setAuthorsResult', response.data.packages)
            commit('setAuthorsCount', response.data.count)
            break;
          default:
            commit('setMethodsResult', response.data.methods)
            commit('setPackagesResult', response.data.packages)
            break;
          }
        } catch (error) {
          console.error (error)
        }
      },

      async getMethodItem ({commit}, {packageName,methodName}) {
        try{
          let url = setBaseUrl (packageName,methodName)
          let response = await axios.get( url )
  
          commit('setMethodItemResult', response.data)
        } catch(error) {
          console.error(error)
        }
      },

      async getPackageItem({commit}, packageName) {
        try {
          let url = setPackageBaseUrl (packageName)
          let response = await axios.get(url)
          commit('setPackageItemResult', response.data.package)
          commit('setPackageMethods', response.data.methods)
        } catch(error) {
          console.error(error)
        }
      },


      test( {commit}, test){
        console.log("I GOT YOU")
      },

      setRoute ({commit}, {to, packageName, methodName}) {
        switch(to) {
        case "search-all":
          this.dispatch('search','all' )
          commit("setCurrentRoute","search-all")
          break;
        case "search-package-only":
          this.dispatch('search',"package")
          commit("setCurrentRoute", "search-package-only")
          break;
        case "search-method-only":
          this.dispatch('search',"method")
          commit("setCurrentRoute","search-method-only")
          break;
        case "search-author-only":
          this.dispatch('search',"author")
          commit("setCurrentRoute","search-author-only")
          break;
        case "package-detail":
          this.dispatch('getPackageItem', packageName)
          commit("setCurrentRoute","package-detail")
          break;
        case "method-detail":
          this.dispatch('getMethodItem', {packageName, methodName})
          commit("setCurrentRoute","method-detail")
          break;
        }
      },

      // async setBreadCrumb ({commit}, searchIn)
    },

  getters: {
    getSlicedPackages: state => {
      return state.packages.map( item => {
        return {
                "Package": item.name,
                "Description": item.description,
                "Version": item.version}
              })
              .slice(0,3)
    },

    getSlicedMethods: state => {
      return state.methods.map( item => {
        return {
                "Method": item.name,
                "Description": item.description,
                "Package": item.packageName}
              })
              .slice(0,3)
    },

    getSlicedAuthors: state => {
      return state.authors.map( item => {
        return {
                "Name": item.author,
                "Package": item.name
              }
            })
            .slice(0,3)
    },

    getPackages: state => {
      return state.packages.map( item => {
        return {
                "Name": item.name,
                "Description": item.description,
                "Version": item.version,
                "Date": item.published}
              })
    },

    getMethods: state => {
      return state.methods.map( item => {
        return {
                "Name": item.name,
                "Description": item.description,
                "Package": item.packageName}
              })
    },

    getAuthors: state => {
      return state.authors.map( item => {
        return {
                "Name": item.author,
                "Package": item.name
              }
            })
    },
    
    getSortedPackageInfo: state => {
      let orderedKeys= ["name","description","version","depends","imports",
      "suggests","published","author","maintainer","bugreports","license",
      "url","needscompilation","materials","inviews","linkingto","cranchecks"]
      let namedKeys= ["Package Name","Description", "Version","Depends","Imports",
      "Suggests", "Published", "Author", "Maintainer", "Bug Reports","License",
      "Url", "Needs Compilation", "Materials", "In views", "Linking to", "CRAN Checks"]
      let unsortedKeys  = Object.keys(state.packageInfo)
      let sortedPackageInfo = {}

      orderedKeys.forEach((key,index) => {
        if( unsortedKeys.includes(key)){
            sortedPackageInfo [ namedKeys[ index ] ] = state.packageInfo [ key ]        
        }
      })
      
      return sortedPackageInfo;
    },

    getPackageMethods: state => state.packageMethods,

  }
})