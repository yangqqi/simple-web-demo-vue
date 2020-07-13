// @request
import Axios from 'axios';
import Weui from 'weui.js';
import MemberCookie from '@/libs/memberCookie';
import Store from '@/store';
import Router from '@/router';
const BaseConfig = require('@/config');

// token 失效
// todo 补充授权错误处理
const ERROR_CODE = ['50001', '50002', '50003', '50004', '50005', '50006', '50007', '50008', '50009'];
// 69002 服务器升级

const Service = Axios.create({
    baseURL: BaseConfig.BASE_API,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

// 节流
var canRun = true;
const _showErrorTip = function(tip) {
    if (!canRun) {
        return false;
    }
    canRun = false;
    setTimeout(function() {
        Weui.alert(tip);
        canRun = true;
    }, 1000);
};

// 添加请求拦截器
Service.interceptors.request.use(
    config => {
        config.headers = {
            ...config.headers,
            Authorization: MemberCookie.accessToken(),
            timestamp: new Date().getTime()
        };

        return config;
    },
    error => {
        console.error('FAIL', error.message);
        _showErrorTip(error.message);
    }
);

// 添加响应拦截器
Service.interceptors.response.use(
    response => {
        let resData = response.data;
        if (resData.code !== 0) {
            console.error('RESPONSE:', resData.code, resData.msg, resData);
            _showErrorTip(resData.msg);
            if (resData.code === 500 && resData.msg == '用户/密码,错误') {
                console.error('RESPONSE:', 'token失效1-0，用户/密码错误', 'clearMemberAuthData');
                Store.commit('clearMemberAuthData');
                // Router.replace({ path: '/system' });
            }
        }
        return resData;
    },
    error => {
        let errResponse = error.response;
        if (!errResponse) {
            console.error('ERROR:', error.message);
            return {};
        }

        let errData = errResponse.data;
        let message = errData.code ? errData.msg : `${errResponse.status}:${errResponse.statusText}`;
        _showErrorTip(message);
        if (errResponse.statusText) {
            console.error('ERROR:', errResponse.status, errResponse.statusText);
        }
        if (errData.code) {
            console.error('ERROR:', errData.code, errData.msg, errData.errorCode);
        }
        if (errData.code && errData.errorCode && ERROR_CODE.indexOf(errData.errorCode) >= 0) {
            console.error('ERROR:', 'token失效2', 'clearMemberAuthData');
            Store.commit('clearMemberAuthData');
            Router.replace({ path: '/member' });
        }
        return errData || {};
    }
);

export default {
    // 封装基础请求 loading
    get: (url, config) => Service.get(url, { ...config }),
    put: (url, data, config) => Service.put(url, data, { ...config }),
    post: (url, data, config) => Service.post(url, data, { ...config }),
    patch: (url, data, config) => Service.patch(url, data, { ...config }),
    delete: (url, config) => Service.delete(url, { ...config }),
    postParams: (url, data, config) =>
        Service({
            url,
            method: 'POST',
            params: data,
            ...config
        }),

    // 二次封装
    Service: Service
};
