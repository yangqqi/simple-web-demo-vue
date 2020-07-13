// @物流系统/流转流程
<template>
    <div class="system_circulation">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">业务信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickDate">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">业务日期</label></div>
                            <div class="weui-cell__bd">{{ billData.billDate || '请选择' }}</div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickerStock">
                            <div class="weui-cell__hd">
                                <label class="weui-label gl-required">{{ toTitle }}仓库</label>
                            </div>
                            <div class="weui-cell__bd">{{ billData.inStockName || '请选择' }}</div>
                        </div>
                        <!-- <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" v-show="isShelfVisible" @click.stop="onPickerShelf">
                            <div class="weui-cell__hd">
                                <label class="weui-label">{{ toTitle }}货架</label>
                            </div>
                            <div class="weui-cell__bd">{{ billData.inShelveskName || '请选择' }}</div>
                        </div> -->
                        <div class="weui-cell weui-cell_active" v-show="isShelfVisible">
                            <div class="weui-cell__hd">
                                <label class="weui-label">{{ toTitle }}货架</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.inShelveskNum" type="text" pattern="[^/\s]*" placeholder="输入货架" />
                            </div>
                            <div class="weui-cell__ft" v-if="!id">
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="onScanCodeShelf">
                                    <i class="icon-scan iconfont icon-tiaomacaiji gl-green" />
                                </a>
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled" v-show="isDeliverEdit">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">提货码</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.deliveryNumber" type="text" pattern="[^/\s]*" placeholder="货架-简码" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" :class="{ 'weui-cell_disabled': id }" v-show="isDeliverVisible">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">提货码</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.deliveryNumber" type="text" pattern="[^/\s]*" :placeholder="!!id ? '/' : '货架-简码'" autofocus :disabled="!!id" />
                            </div>
                            <div class="weui-cell__ft" @click.stop="loadByDeliverNum" v-if="!id">
                                <a class="weui-btn_reset weui-btn_icon">
                                    <i class="icon-scan iconfont icon-zhcc_chaxun gl-green" />
                                </a>
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" v-show="isShelfVisible">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">简码</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.simpleNum" type="text" pattern="[^/\s]*" placeholder="简码" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" :class="{ 'weui-cell_disabled': isDeliverVisible }" v-show="isShelfVisible">
                            <div class="weui-cell__hd"><label class="weui-label" :class="{ 'gl-required': isDeliverEdit }">收费MOP</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.fee" type="number" pattern="[0-9]*" placeholder="请填写收费(MOP$)" maxlength="16" :disabled="isDeliverVisible" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" :class="{ 'weui-cell_disabled': id }">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">快递单号</label></div>
                            <div class="weui-cell__bd">
                                <!-- <input class="weui-input" v-model="billData.expressNumber" type="text" pattern="[^/\s]*" placeholder="快递单/物流单" :disabled="!!id" /> -->
                                <textarea class="weui-textarea" v-model="billData.expressNumber" placeholder="快递单/物流单" rows="2" maxlength="200" :disabled="!!id"></textarea>
                            </div>
                            <div class="weui-cell__ft" v-if="!id">
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="loadByExpressNumber">
                                    <i class="icon-scan iconfont icon-zhcc_chaxun gl-green" />
                                </a>
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="onScanCode">
                                    <i class="icon-scan iconfont icon-tiaomacaiji gl-green" />
                                </a>
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" :class="{ 'weui-cell_disabled': !isAbled }">
                            <div class="weui-cell__hd"><label class="weui-label">司机姓名</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.driver" type="text" :placeholder="isAbled ? '请填写司机姓名' : '/'" maxlength="50" :disabled="!isAbled" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active" :class="{ 'weui-cell_disabled': !isAbled }">
                            <div class="weui-cell__hd"><label class="weui-label">车牌号码</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.registrationNumber" type="text" :placeholder="isAbled ? '车牌号码' : '/'" maxlength="50" :disabled="!isAbled" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label">货单号</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.billNo" type="text" pattern="[^/\s]*" placeholder="货单号" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">客户信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label ">客户姓名</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" :value="billData.customerName || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_disabled">
                            <div class="weui-cell__hd">
                                <label class="weui-label ">{{ billData.customerAreaCode || '区号' }}</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" :value="billData.customerPhone || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label">客户地址</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" :value="billData.customerAddress || '/'" rows="6" disabled></textarea>
                                <div class="weui-textarea-counter">
                                    <span>{{ billData.customerAddress ? billData.customerAddress.length : 0 }}</span
                                    >/200
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">仓储信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_disabled">
                            <div class="weui-cell__hd">
                                <label class="weui-label ">{{ fromTitle }}仓库</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" :value="billData.outStockName || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_disabled">
                            <div class="weui-cell__hd">
                                <label class="weui-label">{{ fromTitle }}货架</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" :value="billData.outShelveskName || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label">货物名称</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" :value="billData.goods || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label ">件数</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" :value="billData.pieces || '/'" type="number" disabled />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">寄件人信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label">寄件人姓名</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" :value="billData.senderName || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_disabled">
                            <div class="weui-cell__hd">
                                <label class="weui-label">{{ billData.senderAreaCode || '区号' }}</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" :value="billData.senderPhone || '/'" type="text" disabled />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_disabled">
                            <div class="weui-cell__hd"><label class="weui-label">寄件人地址</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" :value="billData.senderAddress || '/'" rows="5" disabled></textarea>
                                <div class="weui-textarea-counter">
                                    <span>{{ billData.senderAddress ? billData.senderAddress.length : 0 }}</span
                                    >/200
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form" v-show="billData.expressImage">
                    <div class="weui-cells__title">快递运单</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell">
                            <img class="express-image" :src="`${billData.expressImage}?imageslim`" alt="快递图片" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="weui-form__opr-area">
                <!-- <a class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': disabled }" @click.stop="onSubmit">保存</a> -->
                <a v-show="isDeliverEdit || isDeliverVisible" class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': !billData.expressNumber }" @click.stop="onSendNotice">上架提货通知</a>
                <a v-show="isDeliverEdit || isDeliverVisible" class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': !billData.deliveryNumber }" @click.stop="">打印提货码</a>
            </div>
        </div>

        <gl-full-loading :is-loading="isLoading" />
        <gl-datetime min="NOW" :is-visible="visibleDatetime" @change="onChangeDatetime" @close="visibleDatetime = false" />

        <gl-add text="保存" :disabled="disabled" @click="onSubmit" />
    </div>
</template>

<script>
import OrderMixin from '@/mixins/order.mixin';
import ScanMixin from '@/mixins/scan.mixin';
import StockListMixin from '@/mixins/stockList.mixin';

export default {
    mixins: [OrderMixin, ScanMixin, StockListMixin],
    props: {
        ORDER_TYPE: {
            type: String,
            default: 'STOCK_ACCEPTED_IN'
        }
    },
    data() {
        return {
            // deliverNum: '',
            visibleDatetime: false,

            isLoading: false,
            billData: {
                deliveryNumber: '', // *
                expressNumber: '', // *
                simpleNum: '',
                fee: 0,
                billDate: '', // *
                billNo: '',
                billType: '',
                driver: '',
                registrationNumber: '',
                customerAddress: '',
                customerAreaCode: '', // *
                customerName: '', // *
                customerPhone: '', // *
                goods: '',
                inShelveskId: '',
                inShelveskName: '',
                inShelveskNum: '',
                inStockId: '', // *
                inStockName: '',
                pieces: 1,
                senderAddress: '',
                senderAreaCode: '',
                senderName: '',
                senderPhone: ''
            }
        };
    },
    watch: {
        'billData.simpleNum': function(newVal) {
            this.billData.deliveryNumber = `${this.billData.inShelveskNum}-${this.billData.simpleNum}`;
        },
        'billData.inShelveskNum': function(newVal) {
            this.billData.deliveryNumber = `${this.billData.inShelveskNum}-${this.billData.simpleNum}`;
        },
        'billData.expressNumber': function(newVal) {
            if (newVal && newVal.length >= 4) {
                this.billData.simpleNum = newVal.slice(-4);
            }
        }
    },
    computed: {
        id: function() {
            return this.$route.params.id;
        },
        isAbled: function() {
            return this.ORDER_TYPE === 'STOCK_TRANSFER_OUT';
        },
        isShelfVisible: function() {
            return this.ORDER_TYPE !== 'STOCK_TRANSFER_OUT';
        },
        isDeliverEdit: function() {
            return this.ORDER_TYPE === 'STOCK_PICK_UP_IN';
        },
        isDeliverVisible: function() {
            return this.ORDER_TYPE === 'STOCK_PICK_UP_OUT';
        },
        toTitle: function() {
            if (this.ORDER_TYPE === 'STOCK_TRANSFER_OUT') {
                return '目的';
            } else if (this.ORDER_TYPE === 'STOCK_PICK_UP_IN') {
                return '入库';
            } else if (this.ORDER_TYPE === 'STOCK_PICK_UP_OUT') {
                return '提货';
            } else {
                return '未知';
            }
        },
        fromTitle: function() {
            if (this.ORDER_TYPE === 'STOCK_TRANSFER_OUT') {
                return '出库';
            } else if (this.ORDER_TYPE === 'STOCK_PICK_UP_IN') {
                return '出库';
            } else if (this.ORDER_TYPE === 'STOCK_PICK_UP_OUT') {
                return '入库';
            } else {
                return '未知';
            }
        },
        updateUrl: function() {
            return this.id ? `/api/scm/stock/bill/update/${this.id}` : `/api/scm/stock/bill/add`;
        },
        updateTip: function() {
            return this.id ? `修改` : `新增`;
        },
        disabled: function() {
            let disabled =
                !this.billData.pieces ||
                !this.billData.expressNumber ||
                !this.billData.billDate ||
                !this.billData.customerName ||
                !this.billData.customerPhone ||
                !this.billData.customerAreaCode ||
                !this.billData.inStockId ||
                !this.billData.billType;
            return disabled;
        }
    },
    mounted() {
        this.billData.billDate = this.$dayjs().format('YYYY-MM-DD HH:mm');
        this.billData.billType = this.ORDER_TYPE;
        if (!this.id) return false;
        this.isLoading = true;
        this.$systemAxios
            .get(`/api/scm/stock/bill/get/${this.id}`)
            .then(res => {
                if (res.code !== 0) return false;
                this.billData = {
                    ...this.billData,
                    ...res.data,
                    billDate: this.$dayjs(res.data.billDate).format('YYYY-MM-DD HH:mm')
                };
            })
            .finally(() => {
                this.isLoading = false;
            });
    },
    methods: {
        /**日期选择 */
        onPickDate() {
            this.visibleDatetime = true;
        },
        onChangeDatetime(e) {
            this.billData.billDate = e;
        },
        //**提货码解析 */
        loadByDeliverNum() {
            this.$_debounce(this.handleByDeliverNum);
        },
        handleByDeliverNum() {
            if (!this.billData.deliveryNumber) {
                this.$weui.alert('提货码不能为空！');
            } else {
                this.isLoading = true;
                this.mloadOrderDetailByDeliverNum(this.billData.deliveryNumber)
                    .then(resData => {
                        this.billData = {
                            ...this.billData,
                            ...resData
                        };
                        this.$weui.toast('录入快递信息成功');
                    })
                    .catch(err => {
                        this.$weui.alert('录入失败！');
                        console.error('ERROR', err);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        },
        //**货架号解析 */
        onScanCodeShelf() {
            this.$_debounce(this.handleScanCodeShelf);
        },
        handleScanCodeShelf() {
            this.mOpenCodeScan()
                .then(res => {
                    if (!res) return false;
                    this.billData.inShelveskNum = res;
                })
                .catch(err => {
                    this.$weui.alert('录入失败！');
                    console.error('ERROR', err);
                });
        },
        //**扫码解析 */
        onScanCode() {
            this.$_debounce(this.handleScanCode);
        },
        handleScanCode() {
            this.mOpenCodeScan()
                .then(res => {
                    if (!res) return false;
                    this.billData.expressNumber = res;
                    this.isLoading = true;
                    this.loadByExpressNumber();
                })
                .catch(err => {
                    this.$weui.alert('录入失败！');
                    console.error('ERROR', err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        //**快递号查询 */
        loadByExpressNumber() {
            this.$_debounce(this.handleByExpressNumber);
        },
        handleByExpressNumber() {
            if (!this.billData.expressNumber) {
                this.$weui.alert('快递单号不能为空！');
            } else {
                this.isLoading = true;
                this.mloadOrderDetailByNo(this.ORDER_TYPE, this.billData.expressNumber)
                    .then(resData => {
                        if (this.ORDER_TYPE === 'STOCK_PICK_UP_IN') {
                            delete resData.simpleNum;
                            delete resData.inShelveskNum;
                            delete resData.deliveryNumber;
                        }
                        this.billData = {
                            ...this.billData,
                            ...resData
                        };
                        this.$weui.toast('录入快递信息成功');
                    })
                    .catch(err => {
                        this.$weui.alert(`${this.billData.expressNumber} 录入失败！`);
                        console.error('ERROR', err);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        },
        /**仓库货架选择 */
        onPickerStock() {
            this.mPickerStock().then(res => {
                this.billData.inStockId = res.stockId;
                this.billData.inStockName = res.stockName;
                this.billData.inShelveskId = '';
                this.billData.inShelveskName = '';
            });
        },
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.billData.customerName.search(/[<>/\s]/g) >= 0) {
                this.$weui.topTips('客户姓名不能含有<、>、/和空白字符');
            } else if (this.billData.customerPhone.length > 11) {
                this.$weui.topTips('客户手机号字数不超过11个字符');
            } else if (this.billData.pieces < 1) {
                this.$weui.topTips('件数不能少于1件');
            } else if (!this.billData.deliveryNumber && this.ORDER_TYPE === 'STOCK_PICK_UP_IN') {
                this.$weui.topTips('提货码不能为空');
            } else {
                this.isLoading = true;
                this.$systemAxios
                    .post(this.updateUrl, { ...this.billData, billDate: this.$dayjs(this.billData.billDate).format('YYYY-MM-DD HH:mm:ss') })
                    .then(res => {
                        if (res.code !== 0) return false;
                        this.$weui.toast(`${this.updateTip}${this.$BILL_STATUS[this.ORDER_TYPE]}成功`);
                        this.$router.back();
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        },
        /**发送上架提货通知 */
        onSendNotice() {
            if (this.disabled || this.isLoading) return false;
            let _that = this;
            this.$weui.confirm(
                '是否发送上架提货通知？',
                function() {
                    _that.isLoading = true;
                    _that.$systemAxios
                        .postParams('/api/scm/stock/bill/messageNotice', { expressNumber: _that.billData.expressNumber, sendMsg: true })
                        .then(res => {
                            if (res.code !== 0) return false;
                            _that.$weui.toast(`发送成功`);
                        })
                        .finally(() => {
                            _that.isLoading = false;
                        });
                },
                function() {},
                {
                    title: '退出登录'
                }
            );
        }
    }
};
</script>

<style lang="less" scoped>
.system_circulation {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
    .weui-cell_select-before {
        .weui-label {
            width: 52px;
        }
    }
    .icon-scan {
        font-size: 28px;
        line-height: 28px;
    }
    .express-image {
        width: 100%;
    }
    .weui-btn_reset + .weui-btn_reset {
        margin-left: 8px;
    }
}
</style>
