import Vue from "vue";
import Vuex from "vuex";
import axios from "axios"
Vue.use(Vuex);

const BASE = "https://appdev.melda.io/api/rkb" 
const API = "https://kbdev.melda.io/"
const SERVER = "https://dev.melda.io/" 
const breadcrumb = [
  {
    name: 'Home',
    route: 'search-all',
    id:1
  },
  {
    name: 'Method List',
    route: 'search-method-only',
    id:2,
    parentId:1
  },
  {
    name: 'Package List',
    route: 'search-package-only',
    id:3,
    parentId:1
  },
  {
    name: 'Author List',
    route: 'search-author-only',
    id:4,
    parentId:1
  },
  {
    name: 'Method Detail',
    route: 'method-detail',
    id:5,
    parentId:6
  },
  {
    name: 'Package Detail',
    route: 'package-detail',
    id:6,
    parentId:3
  },
]

function getBreadcrumb(to) {
  let crumbs = []
  let current = getCurrentBreadcrumbItem(to)
  crumbs.splice(0,0,current)
  
  while(current.parentId) {
    let parent = getParentBreadcrumbItem(current)  
    crumbs.splice(0,0,parent)
    current = parent
  }
  return crumbs;
}

function setApiUrl(search,searchIn,size,page,sortBy) {
  return `${API}/search?q=${search}&in=${searchIn}&size=${size}&page=${page}&sort=${sortBy}` 
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

function getCurrentBreadcrumbItem(route) {
  return breadcrumb.filter(crumb => crumb.route == route)[0]
}

function getParentBreadcrumbItem(current) {
  return breadcrumb.filter(crumb => crumb.id == current.parentId)[0]
}

export default new Vuex.Store({
  state: {
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
    breadcrumb:[],
    packageMethods: [],
    totalPages: 0,
    search: '',
    packageName: '',
    sortBy:'Most Related',
    size:30,
    page:1,
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
    
    setMethodItemResult: (state,methodInfo) => state.methodInfo = methodInfo,

    setPackageMethods: (state,packageMethods) => state.packageMethods = packageMethods,

    setCurrentBreadcrumb: (state,breadcrumb) => state.breadcrumb = breadcrumb,
    
    setCurrentBreadcrumb: (state,breadcrumb) => state.breadcrumb = breadcrumb,

    increasePageNumber: state => state.page++,
    
  },

  actions: {
      async search ({commit}, {searchIn,size,page,sortBy}) {
        try{
          let url = setApiUrl (this.state.search, searchIn,this.state.size,this.state.page,this.state.sortBy)
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
          let response = await axios.get(url)
          response.data.method.package =response.data.package.name
  
          commit('setMethodItemResult', response.data.method)
          commit('setPackageItemResult', response.data.package)
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

      setRoute ({commit, dispatch}, {to, packageName, methodName}) {
        switch(to) {
        case "search-all":
          console.log("searc-all")
          dispatch('search', {searchIn:'package'})
          dispatch('search', {searchIn:'method'})
          dispatch('search', {searchIn:'author'})
          commit("setCurrentRoute","search-all")
          dispatch('setBreadCrumb',{to})
          break;
        case "search-package-only":
          dispatch('search', {searchIn:'package'})
          commit("setCurrentRoute", "search-package-only")
          dispatch('setBreadCrumb',{to})
          break;
        case "search-method-only":
          dispatch('search', {searchIn:'method'})
          commit("setCurrentRoute","search-method-only")
          dispatch('setBreadCrumb',{to})
          break;
        case "search-author-only":
          dispatch('search', {searchIn:'author'})
          commit("setCurrentRoute","search-author-only")
          dispatch('setBreadCrumb',{to})
          break;
        case "package-detail":
          dispatch('getPackageItem', packageName)
          commit("setCurrentRoute","package-detail")
          dispatch('setBreadCrumb',{to,packageName})
          break;
        case "method-detail":
          dispatch('getMethodItem', {packageName, methodName})
          commit("setCurrentRoute","method-detail")
          dispatch('setBreadCrumb',{to,packageName,methodName})
          break;
        }
      },

      setBreadCrumb ({commit}, {to,packageName,methodName}) {
        let breadcrumb = getBreadcrumb(to)
        if(packageName){
          breadcrumb[breadcrumb.length - 1].name = packageName
        }

        if(packageName && methodName){
          breadcrumb[breadcrumb.length - 2].name = packageName
          breadcrumb[breadcrumb.length - 1].name = methodName
        }
        commit("setCurrentBreadcrumb",breadcrumb)
      },

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
                "Author": item.author,
                "Maintainer":item.maintainer,
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
                "Author": item.author,
                "Maintainer":item.maintainer,
                "Package": item.name,
              }
            })
    },
    
    getSortedPackageInfo: state => {
      let orderedKeys = [
        "name",
        "description",
        "version",
        "depends",
        "imports",
        "suggests",
        "published",
        "author",
        "maintainer",
        "bugreports",
        "license",
        "url",
        "needscompilation",
        "materials",
        "inviews",
        "linkingto",
        "cranchecks"
      ]
      let namedKeys = [
        "Package Name",
        "Description",
        "Version",
        "Depends",
        "Imports",
        "Suggests",
        "Published",
        "Author",
        "Maintainer",
        "Bug Reports",
        "License",
        "Url",
        "Needs Compilation",
        "Materials",
        "In views",
        "Linking to",
        "CRAN Checks"
      ]
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

    getSortedMethodInfo: state => {
      let orderedKeys = [
        "package",
        "alias",
        "title",
        "description",
        "usage",
        "format",
        "details",
        "source",
        "references",
        "keyword"
      ];
      let sortedMethodInfo = {}

      orderedKeys.forEach( (key,index)=> {
        orderedKeys[ index ] = key.replace(/^./, key[0].toUpperCase())
        sortedMethodInfo[ orderedKeys[ index ] ] = state.methodInfo[ key ]
      })
      return sortedMethodInfo
    },

  }
})