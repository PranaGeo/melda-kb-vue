import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    methodKeys:['Usage','Argument','Example','Order','Alias','methodId',
    "Methods","Value","usageWLib","exampleWLib"],
    totalCount:0,
    packageCount:0,
    methodCount:0,
    authorCount:0,
    isSearching: false,
    state: 'search-all',
    loading: false,
    showButton: true,
    query:{
        size:30,
        page: 1,
        searchIn: 'all',
        sortBy: '',
        search:''
    },
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
    totalPages: 0,
    search: '',
    packageName: '',
    sortBy:'Most Related',
     },

  mutations: {
  },

  actions: {
      async search( {commit} , query){
      }
    },

})