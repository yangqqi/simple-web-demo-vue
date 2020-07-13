import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import System from './system.js';
import Member from './member.js';
const routes = [
    ...System,
    ...Member,
    {
        path: '/action',
        component: () => import('@/views/action/index.vue'),
        meta: {
            title: '',
        },
    },
    {
        path: '/system',
        component: () => import('@/views/system/index.vue'),
        meta: {
            title: '',
        },
    },
    {
        path: '/system/login',
        component: () => import('@/views/system/login.vue'),
        meta: {
            title: '系统登录',
        },
    },
    {
        path: '/member',
        component: () => import('@/views/member/index.vue'),
        meta: {
            title: '',
        },
    },
];

const router = new VueRouter({
    scrollBehavior: () => ({
        y: 0,
    }),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    next();
});

export default router;
