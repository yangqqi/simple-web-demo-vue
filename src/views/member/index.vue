// @会员系统--首页
<template>
    <div class="member">
        <div class="head">
            <div class="head-user">{{ memberInfo ? '你好，' + memberInfo.userName : '请登录' }}</div>
            <div class="head-opt">
                <div class="opt-left opt-item iconfont icon-cangchuyingyong" @click.stop="isPanelVisible = true"></div>
                <!-- <div class="opt-right opt-item iconfont icon-pandian" @click.stop="onAddress"></div> -->
            </div>
            <div class="query-input">
                <input v-model="keyword" type="text" placeholder="姓名/电话/快递单号/提货号" />
                <i class="gl-green opt-right opt-item iconfont icon-zhcc_chaxun" @click.stop="onSearch" />
            </div>
        </div>
        <div class="main">
            <div class="list-item" @click.stop="onAddress">
                <div class="list-item__icon iconfont icon-pandian" :style="`background:#FFC219;color#000;`"></div>
                <div class="list-item__label">代收点</div>
            </div>
        </div>
        <div class="query">
            <div class="query-list">
                <a class="query-list-item weui-media-box weui-media-box_appmsg" v-for="(item, index) in resList" :key="index" @click.stop="onLinkDetail(item.expressNumber)">
                    <div class="weui-media-box__bd">
                        <ul class="weui-media-box__info" style="margin: 0 0 4px;">
                            <li class="weui-media-box__info__meta">快递单号：{{ item.expressNumber }}</li>
                        </ul>
                        <h4 class="weui-media-box__title">
                            <span> {{ item.customerName }}</span>
                        </h4>
                        <h4 class="weui-media-box__title subtitle">
                            <a class="gl-purle" :href="item.customerPhone ? `tel:(${item.customerAreaCode})${item.customerPhone}` : ''" @click.stop>
                                <i class="iconfont icon-zhcc_shoujihao" /> <span>{{ item.customerPhone ? `(${item.customerAreaCode})${item.customerPhone}` : '未绑定手机号' }}</span>
                            </a>
                        </h4>
                        <p class="weui-media-box__desc">{{ item.customerAddress || '未填写地址' }}</p>
                        <ul class="weui-media-box__info">
                            <li class="weui-media-box__info__meta" :class="item.status | statusColorFilter">{{ item.statusName }}</li>
                            <li class="weui-media-box__info__meta gl-orange" v-show="item.fee">收费(MOP$)：{{ item.fee || '未知' }}</li>
                            <li class="weui-media-box__info__meta weui-media-box__info__meta_extra gl-orange" v-show="item.deliveryNumber">取件码：{{ item.deliveryNumber }}</li>
                        </ul>
                    </div>
                </a>
            </div>
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
        <div class="left-panel" :class="[isPanelVisible ? 'visible' : 'hidden']" @click.stop="isPanelVisible = false">
            <div class="left-panel__wrap" @click.stop>
                <div class="opt-hidden iconfont icon-zhcc_xiangzuojiantou" @click.stop="isPanelVisible = false"></div>
                <div class="user-info">
                    <img class="user-info__avatar" :src="memberInfo.profilePhoto" alt="头像" v-if="memberInfo" />
                    <div class="user-info__info" @click.stop="onLogin">
                        <div class="user-info__nickname" v-if="memberInfo">{{ memberInfo.userName }}</div>
                        <div class="user-info__phone" :class="{ 'gl-green': !memberInfo.phone }" v-if="memberInfo">
                            {{ memberInfo.phone ? `(${memberInfo.areaCode})${memberInfo.phone}` : '未绑定手机号' }}
                        </div>
                        <div class="user-info__tip" v-show="!memberInfo">微信登录</div>
                    </div>
                </div>
                <div class="opt-list">
                    <div class="opt-list-item" v-for="(item, index) in MEMBER_OPT_LIST" :key="index" @click.stop="$linkTo(item.link)">
                        <div class="opt-list-item__icon iconfont" :class="item.icon"></div>
                        <div class="opt-list-item__label">{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import WechatMixin from '@/mixins/wechat.mixin';

export default {
    mixins: [WechatMixin],
    name: 'Member',
    data() {
        return {
            isPanelVisible: false,
            isLoading: false,
            keyword: '',
            resList: [],
            isEmpty: false
        };
    },
    filters: {
        statusColorFilter(e) {
            if (e === 'ALREADY_ACCEPTED') {
                return 'gl-blue';
            } else if (e === 'TRANSFER') {
                return 'gl-purple';
            } else if (e === 'WAITING_PICK') {
                return 'gl-orange';
            } else if (e === 'SIGN_DELIVERY') {
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
        ...mapState(['memberInfo']),
        ...mapGetters(['MEMBER_OPT_LIST'])
    },
    mounted() {
        if (!this.memberInfo) return false;

        if (this.memberInfo && (!this.memberInfo.phone || !this.memberInfo.areaCode)) {
            this.$weui.alert('请绑定手机号！');
            this.$linkTo('/member/user/phone');
        } else if (this.memberInfo) {
            console.log(this.memberInfo);
            this.onSearch();
        }
    },
    methods: {
        onAddress() {
            if (this.memberInfo) {
                this.$linkTo(`/member/user/address`);
            } else {
                this.$weui.alert('请先登录！');
            }
        },
        onLinkDetail(expressNumber) {
            if (!expressNumber) return false;
            this.$linkTo(`/member/order/${expressNumber}`);
        },
        onSearch() {
            if (this.memberInfo) {
                this.$_debounce(this.handleQuery);
            } else {
                this.$weui.alert('请先登录！');
            }
        },
        handleQuery() {
            let params = {
                queryConditions: this.keyword
            };
            this.isLoading = true;
            this.isEmpty = false;
            this.$memberAxios
                .get('/api/scm/log/ep/package/member', { params })
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
        onLogin() {
            if (this.memberInfo) {
                this.$linkTo(this.MEMBER_OPT_LIST[0].link);
            } else {
                this.mOnWechatUrlAsMember();
            }
        }
    }
};
</script>

<style lang="less" scoped>
@main-side: 10px;
@head-opt-height: 40px;
@head-opt-size: 28px;

.member {
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;

    .weui-loadmore_line .weui-loadmore__tips {
        background: transparent;
    }
    .weui-loadmore {
        margin: 0 auto;
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

            .opt-item {
                font-size: @head-opt-size;
                line-height: @head-opt-height;
                color: #fff;
                cursor: pointer;

                &:active {
                    opacity: 0.7;
                }
            }
            .opt-left {
                float: left;
            }
            .opt-right {
                float: right;
            }
            .opt-left + .opt-left,
            .opt-right + .opt-right {
                margin-right: 10px;
            }
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
        .head-title {
            padding: 0 @main-side;
            font-size: 24px;
            line-height: 26px;
            color: #fff;
        }
        .query-input {
            display: flex;
            align-items: center;
            padding: 0 20px;
            height: 44px;
            box-sizing: border-box;
            background: #fff;
            border-radius: 20px;

            input {
                flex: 1;
                font-size: 18px;
                line-height: 28px;
                height: 28px;
                box-sizing: border-box;
                border: 0;
            }
            .opt-right {
                font-size: 28px;

                &:active {
                    opacity: 0.7;
                }
            }
        }
    }
    .main {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 28px 0;
        margin: @main-side;
        padding: 20px @main-side;
        background: #fff;
        border-radius: 8px;

        .list-item {
            cursor: pointer;

            &__icon {
                margin: 0 auto;
                position: relative;
                width: 48px;
                height: 48px;
                font-size: 32px;
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
            .subtitle {
                padding-top: 4px;
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
        // background: rgba(204, 204, 204, 0.7);

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

                &__avatar {
                    min-width: 48px;
                    width: 48px;
                    height: 48px;
                    color: #fff;
                    text-align: center;
                    line-height: 48px;
                    border: 0;
                    border-radius: 100%;
                    overflow: hidden;
                    background: #575757;
                }
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
