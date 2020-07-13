import JSEncrypt from 'jsencrypt'; // 密码加密
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations(['clearAuthData', 'updateUserInfo']),
        //** 拉取公钥，加密密码 */
        mEncryptPassword({ account, password }) {
            return new Promise((resolve, reject) => {
                let loginData = this.$systemCookie.getLoginData();
                if (loginData && loginData.account === account && password === loginData.encryptKey) {
                    resolve(loginData);
                } else {
                    // 无缓存授权信息/信息变更
                    this.$systemAxios
                        .get('/api/scm/publickey')
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                let publicKey = res.data;
                                let encrypt = new JSEncrypt();
                                encrypt.setPublicKey(publicKey);
                                let encryptKey = encrypt.encrypt(password);
                                let resData = {
                                    publicKey: publicKey,
                                    account: account,
                                    encryptKey: encryptKey
                                };
                                resolve(resData);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //** 物流系统/账户密码登录 */
        mLoginSystemByAccount({ account, password }) {
            return new Promise((resolve, reject) => {
                let loginSave;
                this.mEncryptPassword({ account, password })
                    .then(authData => {
                        loginSave = authData;
                        return this.$systemAxios.post('/api/scm/loginAccountPsw', {
                            loginAccount: authData.account,
                            loginType: 'WEB',
                            password: authData.encryptKey,
                            publicKey: authData.publicKey
                        });
                    })
                    .then(res => {
                        if (res.code !== 0) {
                            this.clearAuthData();
                            reject(res);
                        } else {
                            // 缓存到本地systemCookie
                            this.$systemCookie.keepAccessToken({
                                accessToken: res.data.accessToken
                            });
                            this.$systemCookie.keepLoginData({
                                publicKey: loginSave.publicKey,
                                account: loginSave.account,
                                encryptKey: loginSave.encryptKey
                            });
                            // 同步 systemCookie 和仓储
                            let info = {
                                userType: res.data.userType,
                                accountName: res.data.accountName,
                                userName: res.data.userName,
                                areaCode: res.data.areaCode,
                                phone: res.data.phone,
                                wechat: res.data.wechat
                            };
                            this.updateUserInfo(info);
                            resolve(res.data);
                        }
                    })
                    .catch(err => {
                        this.clearAuthData();
                        reject(err);
                    });
            });
        },
        //** 物流手机验证码登录 */
        mLoginSystemByPhone({ areaCode, phone, vcode }) {
            return new Promise((resolve, reject) => {
                this.$systemAxios
                    .post('/api/scm/loginPhone', {
                        areaCode,
                        phone,
                        vcode
                    })
                    .then(res => {
                        if (res.code !== 0) {
                            this.clearAuthData();
                            reject(res);
                        } else {
                            // 缓存到本地systemCookie
                            this.$systemCookie.keepAccessToken({
                                accessToken: res.data.accessToken
                            });
                            // 同步 systemCookie 和仓储
                            let info = {
                                userType: res.data.userType,
                                accountName: res.data.accountName,
                                userName: res.data.userName,
                                areaCode: res.data.areaCode,
                                phone: res.data.phone,
                                wechat: res.data.wechat
                            };
                            this.updateUserInfo(info);
                            resolve(res.data);
                        }
                    })
                    .catch(err => {
                        this.clearAuthData();
                        reject(err);
                    });
            });
        },
        //** 物流系统/退出登录 */
        mLogoutSystem() {
            if (this.$systemCookie.accessToken()) {
                this.$systemAxios.get('/api/scm/logout').finally(() => {
                    this.clearAuthData();
                    this.$router.replace({ path: '/system' });
                });
            } else {
                this.clearAuthData();
                this.$router.replace({ path: '/system' });
            }
        },
    }
};
