export default [
    /**
     * 个人中心
     */
    {
        path: '/member/user',
        component: () => import('@/views/member/user/index.vue'),
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/member/user/nickname',
        component: () => import('@/views/member/user/nickname.vue'),
        meta: {
            title: '设置昵称'
        }
    },
    {
        path: '/member/user/phone',
        component: () => import('@/views/member/user/phone.vue'),
        meta: {
            title: '设置手机号'
        }
    },
    {
        path: '/member/user/address',
        component: () => import('@/views/member/user/address.vue'),
        meta: {
            title: '代收点地址'
        }
    },
    /**
     * 功能
     */
    {
        path: '/member/order/:expressNumber',
        component: () => import('@/views/member/order/detail.vue'),
        props: true,
        meta: {
            title: '物流详情'
        }
    }
];
