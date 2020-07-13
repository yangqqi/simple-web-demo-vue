// @物流系统/个人中心
<template>
    <div class="system_user">
        <div class="weui-cells">
            <router-link class="weui-cell  weui-cell_access" to="/system/user/nickname">
                <div class="weui-cell__bd">
                    <p>昵称</p>
                </div>
                <div class="weui-cell__ft">{{ userInfo ? userInfo.userName : '未登录' }}</div>
            </router-link>
            <router-link class="weui-cell  weui-cell_access" to="/system/user/phone">
                <div class="weui-cell__bd">
                    <p>手机号</p>
                </div>
                <div class="weui-cell__ft" :class="{ 'gl-green': userInfo && !userInfo.phone }">
                    {{ userInfo && userInfo.phone ? `(${userInfo.areaCode})${userInfo.phone}` : '未绑定手机号' }}
                </div>
            </router-link>
            <router-link class="weui-cell  weui-cell_access" to="/system/user/password">
                <div class="weui-cell__bd">
                    <p>修改密码</p>
                </div>
                <div class="weui-cell__ft"></div>
            </router-link>
            <a class="weui-cell" :class="{ 'weui-cell_access': userInfo && !userInfo.wechat }" @click.stop="OnBindingWechat">
                <div class="weui-cell__bd">
                    <p>微信绑定</p>
                </div>
                <div class="weui-cell__ft" :class="{ 'gl-green': userInfo && !userInfo.wechat }">
                    {{ userInfo && userInfo.wechat ? '已绑定' : '未绑定' }}
                </div>
            </a>
            <a class="weui-cell  weui-cell_access">
                <div class="weui-cell__bd" @click.stop="onLogout">
                    <p>退出登录</p>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import WechatMixin from '@/mixins/wechat.mixin';
import AccountMixin from '@/mixins/account.mixin';

export default {
    mixins: [WechatMixin, AccountMixin],
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        OnBindingWechat() {
            if (!this.userInfo || this.userInfo.wechat) return false;
            this.mOnWechatBinding();
        },
        onLogout() {
            let _that = this;
            this.$weui.confirm(
                '是否确定退出登录？',
                function() {
                    _that.mLogoutSystem();
                },
                function() {},
                {
                    title: '退出登录'
                }
            );
        }
    }
};
</script>

<style lang="less" scoped>
.system_user {
    padding-top: 8px;

    .weui-cells {
        margin-top: 0;
    }
}
</style>
