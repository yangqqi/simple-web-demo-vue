import Vue from 'vue';
import Vuex from 'vuex';
import SystemCookie from '@/libs/systemCookie';
import MemberCookie from '@/libs/memberCookie';

Vue.use(Vuex);

const USER_LIST = [
    {
        label: '个人设置',
        icon: 'icon-zhcc_yonghuming',
        link: '/system/user'
    },
    {
        label: '员工管理',
        icon: 'icon-zhcc_guohu',
        link: '/system/employee'
    },
    {
        label: '仓库管理',
        icon: 'icon-kucun',
        link: '/system/wearhouse'
    },
    {
        label: '货架管理',
        icon: 'icon-lihuoshangjia',
        link: '/system/goods-shelf'
    }
    // {
    //     label: '公司信息',
    //     icon: 'icon-zhcc_baobiao',
    //     link: '/system/corporation'
    // }
];

const DETAIL_LIST = [
    {
        label: '揽件入库记录',
        icon: 'icon-qitaruku',
        link: '/system/storage-in',
        color: '#28BFFF'
    },
    {
        label: '运输出库记录',
        icon: 'icon-zhuangcherenwu',
        link: '/system/storage-out',
        color: '#6A6BFF'
    },
    {
        label: '站点入库记录',
        icon: 'icon-xiaotuishouhuo',
        link: '/system/station-in',
        color: '#FFC219'
    },
    {
        label: '快递取件记录',
        icon: 'icon-chukufuhe',
        link: '/system/station-out',
        color: '#2DD35E'
    }
];

const MEMBER_LIST = [
    {
        label: '个人设置',
        icon: 'icon-zhcc_yonghuming',
        link: '/member/user'
    }
];

const SYS_LIST = [
    {
        label: '揽件入库',
        icon: 'icon-qitaruku',
        link: '/system/storage-in/add',
        color: '#28BFFF'
    },
    {
        label: '运输出库',
        icon: 'icon-zhuangcherenwu',
        link: '/system/storage-out/add',
        color: '#6A6BFF'
    },
    {
        label: '站点入库',
        icon: 'icon-xiaotuishouhuo',
        link: '/system/station-in/add',
        color: '#FFC219'
    },
    {
        label: '快递取件',
        icon: 'icon-chukufuhe',
        link: '/system/station-out/add',
        color: '#2DD35E'
    },
    {
        label: '揽件查询',
        icon: 'icon-qitaruku',
        link: '/system/storage-in',
        txtColor: '#28BFFF'
    },
    {
        label: '运输查询',
        icon: 'icon-zhuangcherenwu',
        link: '/system/storage-out',
        txtColor: '#6A6BFF'
    },
    {
        label: '站点查询',
        icon: 'icon-xiaotuishouhuo',
        link: '/system/station-in',
        txtColor: '#FFC219'
    },
    {
        label: '取件查询',
        icon: 'icon-chukufuhe',
        link: '/system/station-out',
        txtColor: '#2DD35E'
    }
];

const billStatus = {
    STOCK_ACCEPTED_IN: '揽件单',
    STOCK_TRANSFER_OUT: '运输出库',
    STOCK_PICK_UP_IN: '站点入库',
    STOCK_PICK_UP_OUT: '快递取件'
};

const codeOptions = {
    '+86': '中国大陆',
    '+853': '中国澳门'
};

export default new Vuex.Store({
    state: {
        billStatus: billStatus,
        codeOptions: codeOptions,
        // avatar:
        //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==',

        userInfo: null,
        // {
        // userType: undefined, // 账户类型['CORP_ADMIN', 'STOREKEEPER']
        // userType: res.data.userType,
        // accountName: res.data.accountName,
        // userName: res.data.userName,
        // areaCode:  res.data.areaCode,
        // phone: res.data.phone,
        // wechat: res.data.wechat
        // }
        memberInfo: null
    },
    getters: {
        USER_OPT_LIST(state) {
            let userInfo = state.userInfo;
            if (!userInfo || !userInfo.userType) {
                return [];
            } else if (userInfo.userType === 'CORP_ADMIN') {
                let resList = USER_LIST
                return resList;
            } else if (userInfo.userType === 'STOREKEEPER') {
                let newList = USER_LIST.slice(0, 1);
                let resList = newList
                return resList;
            } else {
                return [];
            }
        },
        MEMBER_OPT_LIST(state) {
            let memberInfo = state.memberInfo;
            if (!memberInfo) {
                return [];
            } else {
                return MEMBER_LIST;
            }
        },
        SYS_OPT_LIST(state) {
            return SYS_LIST;
        }
    },
    mutations: {
        //**system */
        setUserInfo(state, userInfo) {
            if (state.userInfo || userInfo) {
                state.userInfo = {
                    ...state.userInfo,
                    ...userInfo
                };
            } else {
                state.userInfo = null;
            }
        },
        updateUserInfo(state, info) {
            if (!info) return false;
            SystemCookie.keepUserInfo(info);
            state.userInfo = {
                ...state.userInfo,
                ...info
            };
        },
        clearAuthData(state) {
            state.userInfo = null;
            SystemCookie.removeLoginData();
        },
        //**member */
        setMemberInfo(state, memberInfo) {
            if (state.memberInfo || memberInfo) {
                state.memberInfo = {
                    ...state.memberInfo,
                    ...memberInfo
                };
            } else {
                state.memberInfo = null;
            }
        },
        updateMemberInfo(state, info) {
            if (!info) return false;
            MemberCookie.keepUserInfo(info);
            state.memberInfo = {
                ...state.memberInfo,
                ...info
            };
        },
        clearMemberAuthData(state) {
            state.memberInfo = null;
            MemberCookie.removeLoginData();
        }
    },
    actions: {},
    modules: {}
});
