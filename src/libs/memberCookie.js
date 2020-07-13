// @cookie
import Cookies from 'js-cookie';

const PublicKey = 'ScmMemberPublicKey'; // 公钥
const AccountKey = 'ScmMemberAccount'; // 账户名
const PwdKey = 'ScmMemberEncrypt'; // 账户密码（已加密）
const AccessTokenKey = 'ScmMemberAuthorization'; // 用户 token
const RefreshTokenKey = 'ScmMemberRefreshToken'; // refreshKey

const UserInfoKey = 'ScmMemberUserInfo'; // 用户信息

// 保存授权
const keepAccessToken = function({ accessToken }) {
    Cookies.set(AccessTokenKey, accessToken, { expires: 1, path: '' });
};

// 保存 refreshToken
const keepRefreshToken = function({ refreshToken }) {
    Cookies.set(RefreshTokenKey, refreshToken, { expires: 1, path: '' });
};

// 记住登录信息
const keepLoginData = function({ publicKey, account, encryptKey }) {
    Cookies.set(PublicKey, publicKey, { expires: 1, path: '' });
    Cookies.set(AccountKey, account, { expires: 1, path: '' });
    Cookies.set(PwdKey, encryptKey, { expires: 1, path: '' });
};

// 获取登录信息
const getLoginData = function() {
    if (Cookies.get(PwdKey)) {
        return {
            publicKey: Cookies.get(PublicKey),
            account: Cookies.get(AccountKey),
            encryptKey: Cookies.get(PwdKey)
        };
    } else {
        return null;
    }
};

// 保存/更新用户信息
const keepUserInfo = function(userInfo) {
    let info = Cookies.get(UserInfoKey);
    if (info) {
        info = JSON.parse(info);
        info = {
            ...info,
            ...userInfo
        };
    } else {
        info = userInfo;
    }

    Cookies.set(UserInfoKey, info, { expires: 1, path: '' });
};

// 获取用户信息
const getUserInfo = function() {
    let info = Cookies.get(UserInfoKey);
    if (info) {
        return JSON.parse(info);
    } else {
        return null;
    }
};

// 清除所有登录状态
const removeLoginData = function() {
    Cookies.remove(PublicKey, { path: '' });
    Cookies.remove(AccountKey, { path: '' });
    Cookies.remove(PwdKey, { path: '' });
    Cookies.remove(AccessTokenKey, { path: '' });
    Cookies.remove(RefreshTokenKey, { path: '' });

    Cookies.remove(UserInfoKey, { path: '' });
};

export default {
    //** 授权相关 */
    keepAccessToken: ({ accessToken }) => keepAccessToken({ accessToken }),
    keepRefreshToken: ({ refreshToken }) => keepRefreshToken({ refreshToken }),
    keepLoginData: ({ publicKey, account, encryptKey }) => keepLoginData({ publicKey, account, encryptKey }),
    getLoginData: () => getLoginData(),
    removeLoginData: () => removeLoginData(),
    accessToken: () => Cookies.get(AccessTokenKey),
    refreshToken: () => Cookies.get(RefreshTokenKey),
    //** 用户相关 */
    keepUserInfo: userInfo => keepUserInfo(userInfo),
    userInfo: () => getUserInfo()
};
