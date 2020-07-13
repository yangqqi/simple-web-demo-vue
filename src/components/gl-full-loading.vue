// @全屏加载动画
<template>
    <div class="gl-full-loading" v-show="isLoading" @click.prevent @touchmove.prevent>
        <div>
            <img class="gl-full-loading__icon" src="../assets/icon-loading.png" />
            <div class="gl-full-loading__tip">{{ loadingText }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: '请稍候'
        }
    }
};
</script>

<style lang="less" scoped>
.gl-full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100vw;
    height: 100vh;
    text-align: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.3);

    &__icon {
        margin: 0 auto;
        width: 48px;
        height: 48px;
        animation: turn 1.5s linear infinite;
    }
    &__tip {
        padding-top: 10px;
        font-size: 16px;
        line-height: 24px;
        color: #fff;
    }
    @keyframes turn {
        0% {
            -webkit-transform: rotate(0deg);
        }
        25% {
            -webkit-transform: rotate(90deg);
        }
        50% {
            -webkit-transform: rotate(180deg);
        }
        75% {
            -webkit-transform: rotate(270deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }
}
</style>
