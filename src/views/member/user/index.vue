// @会员系统/个人中心
<template>
    <div class="member_user">
        <div class="weui-cells">
            <router-link class="weui-cell  weui-cell_access" to="/member/user/nickname">
                <div class="weui-cell__bd">
                    <p>姓名</p>
                </div>
                <div class="weui-cell__ft">{{ memberInfo ? memberInfo.userName : '未登录' }}</div>
            </router-link>
            <router-link class="weui-cell  weui-cell_access" to="/member/user/phone">
                <div class="weui-cell__bd">
                    <p>手机号</p>
                </div>
                <div class="weui-cell__ft" :class="{ 'gl-green': memberInfo && !memberInfo.phone }">
                    {{ memberInfo && memberInfo.phone ? `(${memberInfo.areaCode})${memberInfo.phone}` : '未绑定手机号' }}
                </div>
            </router-link>
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <p>性别</p>
                </div>
                <div class="weui-cell__ft">{{ sex }}</div>
            </div>
            <router-link class="weui-cell  weui-cell_access" to="/member/user/address">
                <div class="weui-cell__bd">
                    <p>代收点地址</p>
                </div>
                <div class="weui-cell__ft"></div>
            </router-link>
            <!-- <a class="weui-cell  weui-cell_access">
                <div class="weui-cell__bd" @click.stop="onLogout">
                    <p>退出登录</p>
                </div>
            </a> -->
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AccountMixin from '@/mixins/account.member.mixin';

export default {
    mixins: [AccountMixin],
    computed: {
        ...mapState(['memberInfo']),
        sex: function() {
            if (!this.memberInfo) {
                return '未登录';
            } else if (this.memberInfo.sex === '1') {
                return '男';
            } else if (this.memberInfo.sex === '2') {
                return '女';
            } else {
                return '未知';
            }
        }
    },
    methods: {
        onLogout() {
            let _that = this;
            this.$weui.confirm(
                '是否确定退出登录？',
                function() {
                    _that.mLogoutMember();
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
.member_user {
    padding-top: 8px;

    .weui-cells {
        margin-top: 0;
    }
}
</style>
