export default [
    /**
     * 功能
     */
    {
        path: '/system/storage-in',
        component: () => import('@/views/system/order/index.vue'),
        props: {
            ORDER_TYPE: 'STOCK_ACCEPTED_IN'
        },
        meta: {
            title: '揽件入库'
        }
    },
    {
        path: '/system/storage-in/add',
        component: () => import('@/views/system/order/storage-in.vue'),
        props: {
            ORDER_TYPE: 'STOCK_ACCEPTED_IN'
        },
        meta: {
            title: '揽件入库'
        }
    },
    {
        path: '/system/storage-in/update/:id',
        component: () => import('@/views/system/order/storage-in.vue'),
        props: true,
        meta: {
            title: '揽件入库'
        }
    },
    {
        path: '/system/storage-out',
        component: () => import('@/views/system/order/index.vue'),
        props: {
            ORDER_TYPE: 'STOCK_TRANSFER_OUT'
        },
        meta: {
            title: '运输出库'
        }
    },
    {
        path: '/system/storage-out/add',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_TRANSFER_OUT'
        },
        meta: {
            title: '运输出库'
        }
    },
    {
        path: '/system/storage-out/update/:id',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_TRANSFER_OUT'
        },
        meta: {
            title: '运输出库'
        }
    },
    {
        path: '/system/station-in',
        component: () => import('@/views/system/order/index.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_IN'
        },
        meta: {
            title: '站点入库'
        }
    },
    {
        path: '/system/station-in/add',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_IN'
        },
        meta: {
            title: '站点入库'
        }
    },
    {
        path: '/system/station-in/update/:id',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_IN'
        },
        meta: {
            title: '站点入库'
        }
    },
    {
        path: '/system/station-out',
        component: () => import('@/views/system/order/index.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_OUT'
        },
        meta: {
            title: '快递取件'
        }
    },
    {
        path: '/system/station-out/add',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_OUT'
        },
        meta: {
            title: '快递取件'
        }
    },
    {
        path: '/system/station-out/update/:id',
        component: () => import('@/views/system/order/circulation.vue'),
        props: {
            ORDER_TYPE: 'STOCK_PICK_UP_OUT'
        },
        meta: {
            title: '快递取件'
        }
    },
    /**
     * 个人中心
     */
    {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/system/user/nickname',
        component: () => import('@/views/system/user/nickname.vue'),
        meta: {
            title: '设置昵称'
        }
    },
    {
        path: '/system/user/phone',
        component: () => import('@/views/system/user/phone.vue'),
        meta: {
            title: '设置手机号'
        }
    },
    {
        path: '/system/user/password',
        component: () => import('@/views/system/user/password.vue'),
        meta: {
            title: '设置密码'
        }
    },
    /**
     * 员工管理
     */
    {
        path: '/system/employee',
        component: () => import('@/views/system/admin/employee/index.vue'),
        meta: {
            title: '员工管理'
        }
    },
    {
        path: '/system/employee/add',
        component: () => import('@/views/system/admin/employee/update.vue'),
        meta: {
            title: '员工管理'
        }
    },
    {
        path: '/system/employee/update/:id',
        component: () => import('@/views/system/admin/employee/update.vue'),
        props: true,
        meta: {
            title: '员工管理'
        }
    },
    /**
     * 仓库管理
     */
    {
        path: '/system/wearhouse',
        component: () => import('@/views/system/admin/wearhouse/index.vue'),
        meta: {
            title: '仓库管理'
        }
    },
    {
        path: '/system/wearhouse/add',
        component: () => import('@/views/system/admin/wearhouse/update.vue'),
        meta: {
            title: '仓库管理'
        }
    },
    {
        path: '/system/wearhouse/update/:id',
        component: () => import('@/views/system/admin/wearhouse/update.vue'),
        props: true,
        meta: {
            title: '仓库管理'
        }
    },
    /**
     * 货架管理
     */
    {
        path: '/system/goods-shelf',
        component: () => import('@/views/system/admin/goods-shelf/index.vue'),
        meta: {
            title: '货架管理'
        }
    },
    {
        path: '/system/goods-shelf/add',
        component: () => import('@/views/system/admin/goods-shelf/update.vue'),
        meta: {
            title: '货架管理'
        }
    },
    {
        path: '/system/goods-shelf/update/:id',
        component: () => import('@/views/system/admin/goods-shelf/update.vue'),
        props: true,
        meta: {
            title: '货架管理'
        }
    },

    /**
     * 公司信息
     */
    {
        path: '/system/corporation',
        component: () => import('@/views/system/index.vue'),
        meta: {
            title: '公司信息'
        }
    }
];
