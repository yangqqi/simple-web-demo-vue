<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations(['setUserInfo', 'setMemberInfo'])
    },
    mounted() {
        let info = this.$systemCookie.userInfo();
        this.setUserInfo(info);

        let info2 = this.$memberCookie.userInfo();
        this.setMemberInfo(info2);
    }
};
</script>

<style lang="less">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
