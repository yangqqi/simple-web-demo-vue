// @业务处理
<template>
    <div><gl-full-loading :is-loading="true" /></div>
</template>

<script>
import { mapMutations } from 'vuex';
import WechatMixin from '@/mixins/wechat.mixin';
export default {
    mixins: [WechatMixin],
    methods: {
        ...mapMutations(['clearAuthData', 'updateUserInfo', 'clearMemberAuthData', 'updateMemberInfo']),
        wechatBinding(code, memberId) {
            this.mWechatBinding(code, memberId)
                .then(resData => {
                    this.$weui.toast('微信绑定成功');
                })
                .catch(err => {
                    console.error('ERROR', err);
                })
                .finally(() => {
                    this.$router.replace({ path: '/system' });
                });
        },
        wechatLoginEmployee(code, state) {
            this.mWechatLoginEmployee(code, state)
                .then(resData => {
                    // 缓存到本地systemCookie
                    this.$systemCookie.keepAccessToken({
                        accessToken: resData.accessToken
                    });
                    // 同步 systemCookie 和仓储
                    let info = {
                        userType: resData.userType,
                        accountName: resData.accountName,
                        userName: resData.userName,
                        areaCode: resData.areaCode,
                        phone: resData.phone,
                        wechat: resData.wechat
                    };
                    this.updateUserInfo(info);
                    // this.$weui.toast('微信登录成功');
                    this.$router.replace({ path: '/system' });
                })
                .catch(err => {
                    this.clearAuthData();
                    console.error('ERROR', err);
                    this.$router.replace({ path: '/system/login' });
                })
                // .finally(() => {
                //     this.$router.replace({ path: '/system' });
                // });
        },
        wechatLoginMember(code) {
            this.mWechatLoginMember(code)
                .then(resData => {
                    // 缓存到本地memberCookie
                    this.$memberCookie.keepAccessToken({
                        accessToken: resData.accessToken
                    });
                    // 同步 memberCookie 和仓储
                    let info = {
                        profilePhoto: resData.profilePhoto,
                        sex: resData.sex,
                        userName: resData.userName,
                        areaCode: resData.areaCode,
                        phone: resData.phone
                    };
                    this.updateMemberInfo(info);
                    // this.$weui.toast('微信登录成功');
                })
                .catch(err => {
                    this.clearMemberAuthData();
                    console.error('ERROR', err);
                })
                .finally(() => {
                    this.$router.replace({ path: '/member' });
                });
        }
    },
    mounted() {
        let query = this.$route.query;
        if (!query.action) {
            this.$weui.alert('无效业务链接！');
            return false;
            //...
        }
        if (query.action === 'employee-link-wechat') {
            // 微信绑定--员工
            this.wechatBinding(query.code, query.memberId);
        } else if (query.action === 'employee-login') {
            // 员工登录
            this.wechatLoginEmployee(query.code, query.state);
        } else if (query.action === 'member-login' || query.state === 'MEMBER') {
            // 会员登录
            this.wechatLoginMember(query.code);
        }
    }
};
</script>
