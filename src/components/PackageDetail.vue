<template>
    <div>
        <table class="table table-striped package-meta">
            <tbody>
                <tr v-for="(item,key) in packageInfo">
                    <th> {{ key }} </th>
                    <td v-html="item"> 
                    </td>
                </tr>
            </tbody>
        </table>

        <h4 class="pl-1">Methods</h4>
        <table v-if="packageMethods.length == 0">
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
                v-for="methodItem in packageMethods"
                @click="goto({'to':to, 'packageName':packageName, 'methodName':methodItem.name })">
                    <td class="text-primary package-name">
                        {{ (methodItem.name) }}
                    </td>
                    <td
                        :title="methodItem.description"
                        class="nowrap"
                        style="max-width: 1px"
                        v-html="(methodItem.description)"
                    ></td>
                </tr>
            </tbody>
        </table>

    </div>  
</template>

<script>
export default {
    props:	["packageInfo","packageMethods","to"],
    
    computed: {
        packageName() {
            return this.packageInfo["Package Name"]
        }
    }

}
</script>

<style>

</style>