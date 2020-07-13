// @物流系统
<template>
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
        <div class="system_station-in">
            <div class="query">
                <div class="query-input">
                    <input v-model="params.queryConditions" type="text" placeholder="姓名/电话/快递单号" />
                    <i class="gl-green opt--right opt-item iconfont icon-zhcc_chaxun" @click.stop="onSearch" />
                    <i class="gl-green opt--right opt-item iconfont" :class="[hasDate ? 'icon-zhcc_xiangshang' : 'icon-zhcc_xiangxia']" @click.stop="hasDate = !hasDate" />
                </div>
            </div>
            <div class="query-date weui-cells" v-show="hasDate">
                <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickDate('START')">
                    <div class="weui-cell__bd">{{ startDate || '开始日期' }}</div>
                </div>
                <div class="middle">至</div>
                <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickDate('END')">
                    <div class="weui-cell__bd">{{ endDate || '结束日期' }}</div>
                </div>
            </div>
            <div class="weui-panel weui-panel_access">
                <div class="weui-panel__bd">
                    <van-list v-model="isLoading" :finished="isFinished" finished-text="没有更多了" @load="onButtomLoad">
                        <a class="weui-media-box weui-media-box_appmsg" v-for="(item, index) in resList" :key="index" @click.stop="onClick(item)">
                            <div class="weui-media-box__bd">
                                <ul class="weui-media-box__info" style="margin: 0;padding-bottom: 8px;">
                                    <li class="weui-media-box__info__meta">快递单号：{{ item.expressNumber }}</li>
                                </ul>
                                <h4 class="weui-media-box__title">
                                    <span> {{ item.customerName }}</span>
                                </h4>
                                <h4 class="weui-media-box__title" style="padding: 6px 0 0;">
                                    <a class="gl-purle" :href="item.customerPhone ? `tel:(${item.customerAreaCode})${item.customerPhone}` : ''" @click.stop>
                                        <i class="iconfont icon-zhcc_shoujihao" /> <span>{{ item.customerPhone ? `(${item.customerAreaCode})${item.customerPhone}` : '未绑定手机号' }}</span>
                                    </a>
                                </h4>
                                <p class="weui-media-box__desc" style="padding: 6px 0 0;color: #444;">{{ item.customerAddress || '未填写地址' }}</p>
                                <ul class="weui-media-box__info" style="margin: 0;padding: 16px 0 4px;">
                                    <li class="weui-media-box__info__meta" :class="item.billType | statusColorFilter">{{ $BILL_STATUS[item.billType] }}</li>
                                    <li class="weui-media-box__info__meta gl-green" v-show="item.inStockName">{{ item.inStockName }}</li>
                                    <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">{{ item.billDate }}</li>
                                </ul>
                                <!-- <div class="opt-right" v-show="ORDER_TYPE === 'STOCK_PICK_UP_IN'" @click.stop="">
                  <i class="icon-a iconfont icon-zhcc_xuanzhong" />
                  <span>打印提货码</span>
                </div> -->
                                <div class="opt-right" v-show="ORDER_TYPE === 'STOCK_PICK_UP_IN'" @click.stop="onSendNotice(item.expressNumber)">
                                    <i class="icon-a iconfont icon-zhcc_xuanzhong" />
                                    <span>提货通知</span><span>（{{ item.sendMsgTimes || 0 }}次）</span>
                                </div>
                            </div>
                        </a>
                    </van-list>
                </div>
            </div>

            <gl-add @click="onClickAdd" />
            <gl-full-loading :is-loading="isUpdating" />
            <gl-datetime
                type="DATE"
                :is-visible="visibleDatetime"
                :min-date="dateKey === 'END' ? minDate : undefined"
                :max-date="dateKey === 'START' ? maxDate : undefined"
                @change="onChangeDatetime"
                @close="visibleDatetime = false"
            />
        </div>
    </van-pull-refresh>
</template>

<script>
export default {
    props: {
        ORDER_TYPE: {
            type: String,
            default: 'STOCK_ACCEPTED_IN'
        }
    },
    data() {
        return {
            isRefreshing: false,
            isLoading: false,
            isFinished: false,
            params: {
                pageSize: 16,
                pageNo: 0,
                startDate: '',
                endDate: ''
            },
            resList: [],
            isUpdating: false,

            hasDate: false,
            visibleDatetime: false,
            dateKey: '',
            startDate: '',
            endDate: ''
        };
    },
    filters: {
        statusColorFilter(e) {
            if (e === 'STOCK_ACCEPTED_IN') {
                return 'gl-blue';
            } else if (e === 'STOCK_TRANSFER_OUT') {
                return 'gl-purple';
            } else if (e === 'STOCK_PICK_UP_IN') {
                return 'gl-orange';
            } else if (e === 'STOCK_PICK_UP_OUT') {
                return 'gl-green';
            } else {
                return '';
            }
        }
    },
    computed: {
        queryUrl: function() {
            return '/api/scm/stock/bill/query';
        },
        deleteUrl: function() {
            return '/api/scm/stock/bill/del/';
        },
        minDate: function() {
            if (this.startDate) {
                let date = new Date();
                let curDate = this.$dayjs(this.startDate);
                date.setFullYear(curDate.year(), curDate.month(), curDate.date());
                return date;
            } else {
                return undefined;
            }
        },
        maxDate: function() {
            if (this.endDate) {
                let date = new Date();
                let curDate = this.$dayjs(this.endDate);
                date.setFullYear(curDate.year(), curDate.month(), curDate.date());
                return date;
            } else {
                return undefined;
            }
        }
    },
    methods: {
        /**日期选择 */
        onPickDate(key) {
            this.dateKey = key;
            this.visibleDatetime = true;
        },
        onChangeDatetime(e) {
            if (this.dateKey === 'START') {
                this.startDate = e;
                this.params.startDate = this.$dayjs(e).format('YYYY-MM-DD HH:mm:ss');
            } else if (this.dateKey === 'END') {
                this.endDate = e;
                this.params.endDate = this.$dayjs(e)
                    .add(1, 'day')
                    .subtract(1, 'mintes')
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            this.dateKey = undefined;
        },
        onSearch() {
            this.$_debounce(this.resetList);
        },
        loadList() {
            let params = {
                ...this.params,
                type: this.ORDER_TYPE
            };
            if (!this.hasDate) {
                delete params.startDate;
                delete params.endDate;
            }
            this.isLoading = true;
            this.$systemAxios
                .get(this.queryUrl, { params })
                .then(res => {
                    if (res.code !== 0) {
                        this.isFinished = true;
                    } else {
                        this.resList = this.resList.concat(res.data);
                        this.isFinished = (this.resList.length >= res.count && res.count > 0) || res.count === 0;
                    }
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        resetList() {
            this.params.pageNo = 1;
            this.resList.length = 0;
            this.isFinished = false;
            this.isLoading = false;
            this.loadList();
            this.isRefreshing = false;
        },
        onButtomLoad() {
            if (!this.isFinished) {
                this.params.pageNo += 1;
                this.loadList();
            }
        },
        onRefresh() {
            this.isRefreshing = true;
            this.resetList();
        },
        onClick(item) {
            if (!item || !item.id) return false;
            let _that = this;
            this.$weui.actionSheet(
                [
                    {
                        label: '修改',
                        onClick: function() {
                            _that.handleEdit(item);
                        }
                    },
                    {
                        label: '删除',
                        onClick: function() {
                            _that.handleDelete(item.id, item.billType);
                        }
                    }
                ],
                [
                    {
                        label: '取消',
                        onClick: function() {}
                    }
                ],
                {
                    onClose: function() {}
                }
            );
        },
        onClickAdd() {
            this.$linkTo(`${this.$route.path}/add`);
        },
        handleEdit(item) {
            if (!item || !item.id) return false;
            this.$linkTo(`${this.$route.path}/update/${item.id}`);
        },
        handleDelete(id, billType) {
            if (!id) return false;
            let _that = this;
            this.$weui.confirm(
                `是否确定删除此${this.$BILL_STATUS[billType]}记录？`,
                function() {
                    _that.isUpdating = true;
                    _that.$systemAxios
                        .delete(`${_that.deleteUrl}${id}`)
                        .then(res => {
                            if (res.code !== 0) return false;
                            _that.$weui.toast(`删除成功`);
                            let idx = _that.resList.findIndex(el => {
                                return id === el.id;
                            });
                            if (idx > -1) {
                                _that.resList.splice(idx, 1);
                            }
                        })
                        .finally(() => {
                            _that.isUpdating = false;
                        });
                },
                function() {},
                {
                    title: '删除'
                }
            );
        },
        /**发送提货通知 */
        onSendNotice(expressNumber) {
            this.$_debounce(this.handleSendNotice, expressNumber);
        },
        handleSendNotice(expressNumber) {
            if (!expressNumber) return false;
            this.$systemAxios.postParams('/api/scm/stock/bill/messageNotice', { expressNumber: expressNumber, sendMsg: true }).then(res => {
                if (res.code !== 0) return false;
                this.$weui.toast(`发送成功`);
            });
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
.system_station-in {
    min-height: 100vh;
    box-sizing: border-box;

    .query {
        padding: @main-side;

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
                box-sizing: border-box;
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
    .weui-panel {
        .opt-right + .opt-right {
            margin-right: 10px;
        }
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
    }
    .weui-panel {
        margin-top: 0;
    }
    .weui-cells {
        margin-top: 0;
    }
    .query-date.weui-cells {
        padding: 0 @main-side;

        .weui-cell {
            float: left;
            width: 45%;
            text-align: center;
            box-sizing: border-box;
        }
        .middle {
            float: left;
            width: 10%;
            color: #888;
            line-height: 56px;
            text-align: center;
            box-sizing: border-box;
        }
        .weui-cell_select-after {
            padding: 0 20px 0 0;
        }
        .weui-cell__bd:after {
            transform: rotate(90deg);
        }
    }
}
</style>
