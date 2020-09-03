export default {
    methods: {
        goto(route) {
            if(this.emitOnGoto) {
                this.$emit('goto', route)
            } else {
                this.$store.dispatch('setRoute',route)
            }
        }
    }
}