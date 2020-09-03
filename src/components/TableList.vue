<template>
<div class="container">
    <div class="row">
        <input
            type="text"
            placeholder="Search in Methods"
            class="form-control form-control-md mb-3"
            @keydown.enter="$store.dispatch('search',searchIn)"
            v-model="search"
        />
        <div class="col-md-auto">
            <select class="form-control" >
                <option value="Most Related">Most Related</option>
                <option value="date">Most Recently Updated</option>
                <option value="-date">Least Recently Updated</option>
                <option value="name">Alphabetically Ascending</option>
                <option value="-name">Alphabetically Descending</option>
            </select>
        </div>
    </div>
    
    <div v-if="tableData.length" class="row">
        <table class="table table-hover package-table">
            <thead>
                <tr>
                    <th v-for='(columnName,index) in Object.keys(tableData[0])' 
                    :key="index"
					v-html="columnName"></th>
                </tr>
            </thead>
            <tbody>
				<tr v-for="(item,key) in tableData" :key="key"
				@click="goto({'to':to, 'packageName':item.Name,'methodName':item.name})"> 
					<th v-for="(value,index) in item" :key="index" :title="value" v-html="value">  </th>
				</tr>
            </tbody>
        </table>
    </div>
    <div class="row">
        <button type="button" 
                class="btn btn-block btn-warning"
                style="background-color:#ff7b00"
        >
            Load More {{ tableName }}
        </button>


    </div>
</div>
</template>

<script>
import {mapActions, mapState} from "vuex"

export default {

  	props:	["searchIn","tableName","tableData","count","to", "viewAll"],

    methods: {
        ...mapActions(['setRoute']),
    },

    computed: {
        search: {
            get() {
                return this.$store.state.search
            },
            set(searchInput) {
                this.$store.commit('updateSearch', searchInput)
        }
    }
        
    }

}
</script>

<style>

</style>