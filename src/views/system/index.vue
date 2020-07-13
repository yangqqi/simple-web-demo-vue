// @物流系统--首页
<template>
  <div class="system">
    <!-- 顶栏 -->
    <div class="head">
      <div class="head-user">{{ userInfo ? '你好，' + userInfo.userName : '请登录' }}</div>
      <div class="head-opt">
        <div class="opt--left opt-item iconfont icon-cangchuyingyong" @click.stop="isPanelVisible = true" />
      </div>
      <div class="query-input">
        <input v-model="keyword" type="text" placeholder="姓名/电话/快递单号/提货号" />
        <div class=" opt--right opt-item iconfont icon-zhcc_chaxun gl-green" @click.stop="onSearch" />
        <div class="opt--right opt-item iconfont icon-tiaomacaiji gl-green" @click.stop="onScanCode" />
      </div>
    </div>

    <!-- 业务按钮 -->
    <div class="main" v-show="!resList || resList.length === 0">
      <div class="list-item" v-for="(item, index) in SYS_OPT_LIST" :key="index" @click.stop="onLink(item.link)">
        <div class="list-item__icon iconfont" :class="item.icon" :style="`background: ${item.color || '#f0f0f0'};color: ${item.txtColor || '#fff'};`"></div>
        <div class="list-item__label">{{ item.label }}</div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="query">
      <div class="query-list">
        <div class="query-list-item weui-media-box weui-media-box_appmsg" v-for="(item, index) in resList" :key="index">
          <div class="weui-media-box__bd">
            <ul class="weui-media-box__info" style="margin: 0;padding-bottom: 8px;">
              <li class="weui-media-box__info__meta">快递单号：{{ item.expressNumber }}</li>
            </ul>
            <h4 class="weui-media-box__title">
              <span> {{ item.customerName }}</span>
            </h4>
            <h4 class="weui-media-box__title" style="padding: 6px 0 0;">
              <a class="gl-purple" :href="item.customerPhone ? `tel:(${item.customerAreaCode})${item.customerPhone}` : ''" @click.stop>
                <i class="iconfont icon-zhcc_shoujihao" /> <span>{{ item.customerPhone ? `(${item.customerAreaCode})${item.customerPhone}` : '未绑定手机号' }}</span>
              </a>
            </h4>
            <p class="weui-media-box__desc" style="padding: 6px 0 0;color: #444;">{{ item.customerAddress || '未填写地址' }}</p>
            <ul class="weui-media-box__info" style="margin: 0;padding: 8px 0 0;" v-show="item.fee || item.deliveryNumber">
              <li class="weui-media-box__info__meta gl-orange" v-show="item.fee">收费(MOP$)：{{ item.fee || '未知' }}</li>
              <li class="weui-media-box__info__meta weui-media-box__info__meta_extra gl-orange" v-show="item.deliveryNumber">取件码：{{ item.deliveryNumber || '未设置' }}</li>
            </ul>
            <ul class="weui-media-box__info" style="margin: 0;padding: 16px 0 4px;">
              <li class="weui-media-box__info__meta" :class="item.status | statusColorFilter">{{ item.statusName }}</li>
              <div class="opt-right" @click.stop="onFinishing(item)" v-show="item.status === 'WAITING_PICK' && item.deliveryNumber">
                <i class="icon-a iconfont icon-zhcc_xuanzhong" />
                <span>一键取件</span>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <!-- 搜索状态 -->
      <div class="weui-loadmore" v-show="keyword && isLoading">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载</span>
      </div>
      <div class="weui-loadmore weui-loadmore_line" v-show="keyword && isEmpty">
        <span class="weui-loadmore__tips">暂无数据</span>
      </div>
      <div class="weui-loadmore weui-loadmore_line" v-show="keyword && !isLoading && resList.length > 0">
        <span class="weui-loadmore__tips">没有更多了</span>
      </div>
    </div>

    <!-- 侧栏 -->
    <div class="left-panel" :class="[isPanelVisible ? 'visible' : 'hidden']" @click.stop="isPanelVisible = false">
      <div class="left-panel__wrap" @click.stop>
        <div class="opt-hidden iconfont icon-zhcc_xiangzuojiantou" @click.stop="isPanelVisible = false"></div>
        <div class="user-info">
          <div class="user-info__info" @click.stop="onLogin">
            <div class="user-info__nickname" v-if="userInfo">{{ userInfo.userName }}</div>
            <div class="user-info__phone" :class="{ 'gl-green': !userInfo.phone }" v-if="userInfo">{{ userInfo.phone ? `(${userInfo.areaCode})${userInfo.phone}` : '未绑定手机号' }}</div>
            <div class="user-info__tip" v-if="!userInfo">登录/注册</div>
          </div>
        </div>
        <div class="opt-list">
          <div class="opt-list-item" v-for="(item, index) in USER_OPT_LIST" :key="index" @click.stop="$linkTo(item.link)">
            <div class="opt-list-item__icon iconfont" :class="item.icon"></div>
            <div class="opt-list-item__label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <gl-full-loading :is-loading="isUpdating" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AccountMixin from '@/mixins/account.mixin';
import ScanMixin from '@/mixins/scan.mixin';

export default {
    mixins: [AccountMixin, ScanMixin],
    name: 'System',
    data() {
        return {
            isPanelVisible: false,

            isLoading: false,
            isEmpty: false,
            keyword: '',
            resList: [],

            isUpdating: false
        };
    },
    filters: {
        statusColorFilter(e) {
            if (e === 'ALREADY_ACCEPTED') { // 揽件入库
                return 'gl-blue';
            } else if (e === 'TRANSFER') { // 运输出库
                return 'gl-purple';
            } else if (e === 'WAITING_PICK') { // 站点入库
                return 'gl-orange';
            } else if (e === 'SIGN_DELIVERY') { // 快递取件
                return 'gl-green';
            } else {
                return '';
            }
        }
    },
    watch: {
        keyword: function(newVal) {
            if (this.resList && this.resList.length > 0) {
                this.isEmpty = false;
                this.resList.length = 0;
            }
        }
    },
    computed: {
        ...mapState(['userInfo']),
        ...mapGetters(['USER_OPT_LIST', 'SYS_OPT_LIST'])
    },
    methods: {
        onScanCode() {
            this.$_debounce(this.handleScanCode);
        },
        handleScanCode() {
            this.mOpenCodeScan()
                .then(res => {
                    if (!res) return false;
                    this.keyword = res;
                    this.onSearch();
                })
                .catch(err => {
                    this.$weui.alert('扫码失败！');
                    console.error('ERROR', err);
                });
        },
        onSearch() {
            this.$_debounce(this.handleQuery);
        },
        handleQuery() {
            if (!this.keyword) {
                this.$weui.alert('关键词不能为空！');
                return false;
            }
            let params = {
                queryConditions: this.keyword
            };
            this.isLoading = true;
            this.isEmpty = false;
            this.$systemAxios
                .get('/api/scm/log/ep/package/query', { params })
                .then(res => {
                    if (res.code !== 0) return false;
                    this.resList = res.data;
                    if (this.resList && this.resList.length === 0) {
                        this.isEmpty = true;
                    }
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        onFinishing(item) {
            if (!item.deliveryNumber) return false;
            let _that = this;
            this.$weui.confirm(
                '是否确定领取选中快递？',
                function() {
                    _that.isUpdating = true;
                    _that.$systemAxios
                        .postParams('/api/scm/stock/bill/delivery', { number: item.deliveryNumber })
                        .then(res => {
                            if (res.code !== 0) return false;
                            _that.$weui.toast(`快递取件成功`);
                            _that.onSearch();
                        })
                        .finally(() => {
                            _that.isUpdating = false;
                        });
                },
                function() {},
                {
                    title: '快递取件'
                }
            );
        },
        onLink(url) {
            if (this.userInfo) {
                this.$linkTo(url);
            } else {
                this.$weui.alert('请先登录！');
            }
        },
        onLogin() {
            if (this.userInfo && this.userInfo.userType) {
                this.$linkTo(this.USER_OPT_LIST[0].link);
            } else {
                this.$linkTo('/system/login');
            }
        }
    }
};
</script>

<style lang="less" scoped>
@main-side: 10px;
@head-opt-height: 40px;
@head-opt-size: 28px;

/**操作按钮样式 */
.opt-item {
    font-size: @head-opt-size;
    line-height: @head-opt-height;
    color: #fff;
    cursor: pointer;

    &:active {
        opacity: 0.7;
    }
}
.opt--left {
    float: left;
}
.opt--right {
    float: right;
}

//**页面样式 */
.system {
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;

    .weui-loadmore {
        margin: 0 auto;
    }
    .weui-loadmore_line .weui-loadmore__tips {
        background: transparent;
    }

    .head {
        position: relative;
        padding: 60px @main-side 20px;
        width: 100%;
        background: #4a76af;
        box-sizing: border-box;

        .head-opt {
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 @main-side;
            width: 100%;
            box-sizing: border-box;
        }
        .head-user {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: @head-opt-height;
            font-size: 14px;
            line-height: @head-opt-height;
            text-align: center;
            color: #f0f0f0;
            background: linear-gradient(270deg, rgba(75, 119, 176, 1) 0%, rgba(69, 113, 169, 1) 49%, rgba(75, 119, 176, 1) 100%);
        }
        .query-input {
            display: flex;
            align-items: center;
            padding: 0 20px;
            height: 44px;
            background: #fff;
            border-radius: 20px;
            box-sizing: border-box;

            input {
                flex: 1;
                min-width: 180px;
                font-size: 18px;
                line-height: 28px;
                height: 28px;
                border: 0;
            }
            .opt--right {
                width: 28px;
            }
            .opt--right + .opt--right {
                margin-left: 8px;
            }
        }
    }
    .main {
        margin: @main-side;
        padding: 20px @main-side;
        height: 220px;
        background: #fff;
        border-radius: 8px;
        box-sizing: border-box;

        .list-item {
            float: left;
            margin-bottom: 24px;
            width: 25%;
            cursor: pointer;

            &__icon {
                margin: 0 auto;
                width: 48px;
                height: 48px;
                font-size: 36px;
                line-height: 48px;
                text-align: center;
                color: #fff;
                border-radius: 100%;

                &:active {
                    opacity: 0.7;
                }
            }
            &__label {
                margin-top: 8px;
                font-size: 14px;
                line-height: 22px;
                text-align: center;
                color: #444;
            }
        }
    }
    .query {
        position: relative;
        padding: 0 @main-side;

        .query-list {
            padding: 10px 0 20px;

            .opt-right {
                float: right;
                display: flex;
                align-items: center;
                margin-top: 8px;
                padding: 4px 8px;
                color: #fff;
                line-height: 1;
                background: #fd8700;
                border-radius: 4px;

                &:active {
                    background: yellowgreen;
                }
                .icon-a {
                    padding-right: 4px;
                }
            }
            .query-list-item + .query-list-item {
                margin-top: 10px;
            }
            .query-list-item {
                background: #fff;
                border-radius: 8px;

                &:active {
                    background: #f5f5f5;
                }
            }
        }
    }
    .left-panel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        &.visible {
            transform: translateX(0);
            transition: all 0.5s;
        }
        &.hidden {
            transform: translateX(-100%);
            transition: all 0.5s;
        }
        &__wrap {
            width: 70%;
            height: 100%;
            color: #575757;
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0px 0px 7px 1px rgba(75, 75, 75, 0.11);

            .opt-hidden {
                padding: 0 @main-side;
                font-size: @head-opt-size;
                line-height: @head-opt-height;
                cursor: pointer;

                &:active {
                    opacity: 0.7;
                }
            }
            .user-info {
                display: flex;
                align-items: center;
                padding: 0 20px;
                height: 92px;
                background: #ededed;
                box-sizing: border-box;

                &__info {
                    flex: 1;
                    margin-left: 12px;
                    font-size: 16px;
                    line-height: 24px;
                    cursor: pointer;

                    &:active {
                        opacity: 0.7;
                    }
                }
                &__tip {
                    font-size: 16px;
                    line-height: 24px;
                    font-weight: bold;
                }
            }
            .opt-list {
                .opt-list-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 30px;
                    font-size: 18px;
                    line-height: 28px;
                    cursor: pointer;

                    &__icon {
                        font-size: 22px;
                    }
                    &__label {
                        margin-left: 20px;
                    }
                    &:active {
                        background: #ededed;
                    }
                }
            }
        }
    }
}
</style>
