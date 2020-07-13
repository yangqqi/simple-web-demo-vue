// @回到顶部
<template>
    <div class="gl-back-to-top" :class="{ disabled: disabled }" @click.stop="onClick">
        <!-- <img class="gl-back-to-top__icon" src="https://dtc-1300253956.picgz.myqcloud.com/5d84b971ac0740b0ae5ceb569f4a3330.png" mode="aspectFit" /> -->
        <div class="gl-back-to-top__icon iconfont icon-zhcc_jiahao" v-show="!text"></div>
        <div class="gl-back-to-top__text" v-show="text">保存</div>
    </div>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<style lang="less" scoped>
.gl-back-to-top {
    position: fixed;
    right: 20px;
    bottom: calc(10% + 48px + 16px);
    width: 48px;
    height: 48px;
    text-align: center;
    background: #309d68;
    box-shadow: 0px 4px 10px 0px rgba(21, 129, 76, 0.4);
    border-radius: 50%;
    cursor: pointer;

    &.disabled {
        opacity: 0.7;
    }
    &:active {
        opacity: 0.7;
    }
    &__icon {
        font-size: 24px;
        line-height: 48px;
        text-align: center;
        color: #fff;
    }
    &__text {
        font-size: 16px;
        line-height: 48px;
        text-align: center;
        color: #fff;
    }
}
</style>
