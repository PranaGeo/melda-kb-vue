<template>
	<div>
		<table v-if="tableName" class="table table-borderless" style="borderless">
			<tbody> 
				<tr class="table-active">
					<th style="text-align:left"> {{ tableName }} 
						<span> {{count}}</span>
					</th>

					<td style="text-align:right">
						<button class="btn btn-primary"
						@click="goto({'to':viewAll})">
							View All
						</button> 
					</td>
				</tr>
			</tbody>	
		</table>

		<table v-if="tableData.length" class="table table-borderless table-hover package-table">
			<thead>
				<tr>
					<th v-for='(columnName,index) in Object.keys(tableData[0])' :key="index"
					v-html="columnName"></th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="(item,key) in tableData" :key="key"
				@click="goto({'to':to, 'packageName':item.Package, 'methodName':item.Method})">
					<th 
					class="nowrap"
					 v-for="(value,index) in item" :key="index" :title="value" v-html="value">  </th>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {

	props:	["tableName","tableData","count","to", "viewAll"],

	methods: {
		...mapActions(['setRoute']),
	},

	computed: {
		...mapState( ['search'])
	}
}
</script>

<style scoped>

.nowrap {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 1px;
	text-align: center;



}

.table th  {
	text-align: center;
	padding: 0px;
}

.table td {
	padding: 0px;
	text-align: center;

}
</style>>

