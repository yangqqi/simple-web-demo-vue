<template>
    <div class="member_order">
        <div class="order-card">
            <div class="weui-media-box__bd order-card__wrap" v-if="resData">
                <ul class="weui-media-box__info" style="margin: 0 0 4px;">
                    <li class="weui-media-box__info__meta">快递单号：{{ resData.expressNumber }}</li>
                </ul>
                <h4 class="weui-media-box__title">
                    <span> {{ resData.customerName }}</span>
                </h4>
                <h4 class="weui-media-box__title subtitle">
                    <a class="gl-purle" :href="resData.customerPhone ? `tel:(${resData.customerAreaCode})${resData.customerPhone}` : ''" @click.stop>
                        <i class="iconfont icon-zhcc_shoujihao" /> <span>{{ resData.customerPhone ? `(${resData.customerAreaCode})${resData.customerPhone}` : '未绑定手机号' }}</span>
                    </a>
                </h4>
                <p class="weui-media-box__desc">{{ resData.customerAddress || '未填写地址' }}</p>
                <ul class="weui-media-box__info">
                    <li class="weui-media-box__info__meta" :class="resData.status | statusColorFilter">{{ resData.statusName }}</li>
                    <li class="weui-media-box__info__meta weui-media-box__info__meta_extra gl-orange" v-show="resData.deliveryNumber">取件码：{{ resData.deliveryNumber }}</li>
                    <!-- <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">{{ item.billDate }}</li> -->
                </ul>
            </div>
        </div>
        <div class="order-detail" v-if="resList">
            <van-steps direction="vertical" :active="0" :active-color="statusColorFilter2(resList[0].billType)">
                <van-step v-for="(item, index) in resList" :key="index">
                    <h3>{{ item.msg }}</h3>
                    <p class="subtitle">{{ item.dateTime }}</p>
                </van-step>
            </van-steps>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        expressNumber: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            resData: null,
            resList: null
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
    mounted() {
        this.loadExpress();
        this.loadExpressDetail();
    },
    methods: {
        statusColorFilter2(e) {
            if (e === 'STOCK_ACCEPTED_IN') {
                return '#28bfff';
            } else if (e === 'STOCK_TRANSFER_OUT') {
                return '#6a6bff';
            } else if (e === 'STOCK_PICK_UP_IN') {
                return '#fd8700';
            } else if (e === 'STOCK_PICK_UP_OUT') {
                return '#309d68';
            } else {
                return '';
            }
        },
        loadExpress() {
            if (!this.expressNumber) return false;
            this.$memberAxios
                .get('/api/scm/log/ep/package/member', {
                    params: {
                        queryConditions: this.expressNumber
                    }
                })
                .then(res => {
                    if (res.code !== 0 || !res.data[0]) return false;
                    this.resData = res.data[0];
                });
        },
        loadExpressDetail() {
            if (!this.expressNumber) return false;
            this.$memberAxios
                .get('/api/scm/stock/bill/loginfo', {
                    params: {
                        expressNumber: this.expressNumber
                    }
                })
                .then(res => {
                    if (res.code !== 0) return false;
                    this.resList = res.data;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.member_order {
    .subtitle {
        padding-top: 4px;
    }
    .order-card {
        padding: 0 20px;
        background: #fff;

        &__wrap {
            padding: 20px 0;
            border-bottom: 1px solid #f0f0f0;
        }
    }
    .order-detail {
        padding: 20px 10px;
        background: #fff;
    }
}
</style>
