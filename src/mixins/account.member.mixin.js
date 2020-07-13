import JSEncrypt from 'jsencrypt'; // 密码加密
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations(['clearMemberAuthData']),
        //** 会员系统/退出登录 */
        mLogoutMember() {
            if (this.$memberCookie.accessToken()) {
                this.$memberAxios.get('/api/scm/logout').finally(() => {
                    this.clearMemberAuthData();
                    this.$router.replace({ path: '/member' });
                });
            } else {
                this.clearMemberAuthData();
                this.$router.replace({ path: '/member' });
            }
        },
    }
};
