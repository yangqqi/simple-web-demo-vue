export default {
    methods: {
        //** 拉取用户信息 */
        mGetUserInfo() {
            return new Promise((resolve, reject) => {
                this.$systemAxios
                    .get('/api/scm/account/getBase')
                    .then(res => {
                        if (res.code !== 0) {
                            this.clearAuthData();
                            reject(res);
                        } else {
                            this.$store.commit('updateUserInfo', res.data);
                            resolve(res.data);
                        }
                    })
                    .catch(err => {
                        this.clearAuthData();
                        reject(err);
                    });
            });
        },
        //**触发微信绑定--员工 */
        mOnWechatBinding() {
            this.$systemAxios.get('/api/scm/employee/bind-wechat-url').then(res => {
                if (res.code !== 0) return false;
                window.location.href = res.data;
            });
        },
        //**微信绑定--员工 */
        mWechatBinding(code, memberId) {
            return new Promise((resolve, reject) => {
                if (!code || !memberId) {
                    this.$weui.alert('员工微信绑定参数不完整！');
                    reject(new Error('员工微信绑定参数不完整！'));
                } else {
                    this.$systemAxios
                        .postParams('/api/scm/employee/bind-wechat', {
                            code: code,
                            employeeId: memberId
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                // 更新账号基本信息
                                return this.mGetUserInfo();
                            }
                        })
                        .then(resData => {
                            resolve(resData);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**触发微信登录--员工 */
        mOnWechatUrlAsEmployee() {
            this.$systemAxios.get('/api/scm/employee/loginWeChatUrl').then(res => {
                if (res.code !== 0) return false;
                window.location.href = res.data;
            });
        },
        //**微信登录--员工 */
        mWechatLoginEmployee(code, state) {
            return new Promise((resolve, reject) => {
                if (!code || !state) {
                    this.$weui.alert('员工微信登录参数不完整！');
                    reject(new Error('员工微信登录参数不完整！'));
                } else {
                    this.$systemAxios
                        .get('/api/scm/loginWeChatCode', {
                            params: { code: code, state: state }
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                resolve(res.data);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**触发微信登录--会员 */
        mOnWechatUrlAsMember() {
            this.$systemAxios.get('/api/scm/member/loginWeChatUrl').then(res => {
                if (res.code !== 0) return false;
                window.location.href = res.data;
            });
        },
        //**微信登录--员工 */
        mWechatLoginMember(code) {
            return new Promise((resolve, reject) => {
                if (!code) {
                    this.$weui.alert('会员微信登录参数不完整！');
                    reject(new Error('会员微信登录参数不完整！'));
                } else {
                    this.$systemAxios
                        .get('/api/scm/member/weChatCodeLogin', {
                            params: { code: code }
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                resolve(res.data);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        }
    }
};
