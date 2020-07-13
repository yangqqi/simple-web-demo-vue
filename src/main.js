import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import 'normalize.css';
import 'weui';
import '@/libs/vant';
import '@/assets/font_ali/iconfont.css';
import '@/assets/font_ali2/iconfont.css';
import '@/assets/style/global.less';

//**公用库 */
import Weui from 'weui.js';
Vue.prototype.$weui = Weui;
import Dayjs from 'dayjs';
require('dayjs/locale/zh-tw');
Dayjs.locale('zh-tw'); // 全局使用
Vue.prototype.$dayjs = Dayjs;

//**cookie缓存 */
import SystemCookie from '@/libs/systemCookie';
Vue.prototype.$systemCookie = SystemCookie;
import MemberCookie from '@/libs/memberCookie';
Vue.prototype.$memberCookie = MemberCookie;

//**网络请求 */
import SysService from '@/libs/systemAxios.js';
Vue.prototype.$systemAxios = SysService;
import MemService from '@/libs/memberAxios.js';
Vue.prototype.$memberAxios = MemService;

//**公用组件 */
import GlAdd from '@/components/gl-add.vue';
Vue.component('gl-add', GlAdd);
import GlFullLoading from '@/components/gl-full-loading';
Vue.component('gl-full-loading', GlFullLoading);
import GlDatetime from '@/components/gl-datetime';
Vue.component('gl-datetime', GlDatetime);

//** 公用函数 */
Vue.prototype.$BILL_STATUS = store.state.billStatus;
Vue.prototype.$linkTo = function(url) {
    if (!url) return false;
    router.push({ path: url });
};
let _timer = null;
Vue.prototype.$_debounce = function(fn, param, delay) {
    let _delay = delay || 500;
    clearTimeout(_timer);
    _timer = setTimeout(() => {
        fn(param);
    }, _delay);
};

// 时间格式化过滤器
// String/Date类型格式化
Vue.filter('DateFormat', function(date, pattern = 'YYYY-MM-DD HH:mm') {
    if (date) {
        return Dayjs(date).format(pattern);
    } else {
        return '';
    }
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
