<template>
    <div>
        <table class="table table-striped package-meta">
            <tbody>
                <tr v-for="(item, key) in methodInfo" v-if="!methodKeys.includes(key) ">
                    <th>
                    {{ key }}
                    </th>
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
                        @click="$emit('eval', methodInfo.usageWLib, 'R')"
                        title="Run code in new cell"
                    >
                        <i class="fa fa-play"></i>
                    </button>

                    <button class="btn btn-sm btn-success" v-clipboard="methodInfo.Usage" title="Copy">
                        <i class="fas fa-copy"></i>
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
                    <tr v-for="arg in methodInfo.Value">
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
                    @click="$emit('eval', methodInfo.exampleWLib, 'R')"
                    title="Run code in new cell"
                >
                    <i class="fa fa-play"></i>
                </button>
                <button class="btn btn-sm btn-success" v-clipboard="methodInfo.Example" title="Copy">
                    <i class="fas fa-copy"></i>
                </button>
            </h4>
            <pre v-html="methodInfo.Example"></pre>
        </div>
    </div>
</template>

<script>
import Clipboard from 'v-clipboard'

export default {
  data() {
    return {
      methodKeys:[
        "Usage",
        "Argument",
        "Example",
        "Order",
        "Alias",
        "methodId",
        "Methods",
        "Value",
        "usageWLib",
        "exampleWLib"
      ]
    }
  },

  props: [ "methodInfo" ],

  computed: {
    packageName() {
      return this.methodInfo.packageName
    }
  }
};
</script>

<style>
</style>