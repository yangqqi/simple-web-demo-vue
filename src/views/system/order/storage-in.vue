// @物流系统/揽件入库/新增修改
<template>
    <div class="system_storage-in_update">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">业务信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickDate">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">下单日期</label></div>
                            <div class="weui-cell__bd">{{ billData.billDate || '请选择' }}</div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">快递单号</label></div>
                            <div class="weui-cell__bd">
                                <!-- <input class="weui-input" v-model="billData.expressNumber" type="text" pattern="[^/\s]*" placeholder="快递单/物流单" /> -->
                                <textarea class="weui-textarea" v-model="billData.expressNumber" placeholder="快递单/物流单" rows="2" maxlength="200"></textarea>
                            </div>
                            <div class="weui-cell__ft">
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="$refs.upload.click">
                                    <i class="icon-scan iconfont icon-paizhao gl-green" />
                                </a>
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="onScanCode">
                                    <i class="icon-scan iconfont icon-tiaomacaiji gl-green" />
                                </a>
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">货单号</label></div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.billNo" type="text" placeholder="货单号" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">客户信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">客户姓名</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="billData.customerName" type="text" pattern="[^<>/\s]*" placeholder="请填写客户姓名" maxlength="50" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-before">
                            <div class="weui-cell__hd" @click.stop="onPickerAreaCode1">
                                <label class="weui-label gl-required">{{ billData.customerAreaCode || '区号' }}</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.customerPhone" type="tel" pattern="[0-9]*" placeholder="请填写客户联系电话" maxlength="11" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">客户地址</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" v-model="billData.customerAddress" placeholder="请填写客户地址" rows="6" maxlength="200"></textarea>
                                <div class="weui-textarea-counter">
                                    <span>{{ billData.customerAddress ? billData.customerAddress.length : 0 }}</span
                                    >/200
                                </div>
                            </div>
                            <div class="weui-cell__ft">
                                <a class="weui-btn_reset weui-btn_icon" @click.stop="onOpenAddressDialog">
                                    <i class="icon-scan iconfont icon-zhcc_chaxun gl-green" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">仓储信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickerStock">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">入库仓库</label></div>
                            <div class="weui-cell__bd">{{ billData.inStockName || '请选择' }}</div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickerShelf">
                            <div class="weui-cell__hd"><label class="weui-label">入库货架</label></div>
                            <div class="weui-cell__bd">{{ billData.inShelveskName || '请选择' }}</div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">货物名称</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="billData.goods" type="text" placeholder="请填写货物名称" maxlength="16" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">件数</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="billData.pieces" type="number" pattern="[0-9]*" placeholder="请填写件数" maxlength="16" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells__title">寄件人信息</div>
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">寄件人姓名</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="billData.senderName" type="text" pattern="[^<>/\s]*" placeholder="请填写寄件人姓名" maxlength="50" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-before">
                            <div class="weui-cell__hd" @click.stop="onPickerAreaCode2">
                                <label class="weui-label">{{ billData.senderAreaCode || '区号' }}</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="billData.senderPhone" type="tel" pattern="[0-9]*" placeholder="请填写寄件人联系电话" maxlength="11" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">寄件人地址</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" v-model="billData.senderAddress" placeholder="请填写寄件人地址" rows="5" maxlength="200"></textarea>
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
            <!-- <div class="weui-form__opr-area">
        <a class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': disabled }" @click.stop="onSubmit">保存</a>
      </div> -->
        </div>

        <gl-full-loading :is-loading="isLoading" />
        <input ref="upload" @change="onFileChange" v-show="false" type="file" accept="image/*" capture />
        <gl-datetime min="NOW" :is-visible="visibleDatetime" @change="onChangeDatetime" @close="visibleDatetime = false" />

        <gl-add text="保存" :disabled="disabled" @click="onSubmit" />

        <!-- 弹出搜索层 -->
        <van-popup v-model="visibleDialogAddress" position="right" style="background: #ececec;width: 300px;height: 100%;">
            <div class="query">
                <div class="query-input">
                    <input v-model="addressKey" type="text" placeholder="手机号" />
                    <div class=" opt--right opt-item iconfont icon-zhcc_chaxun gl-green" @click.stop="onSeachAddressByPhone" />
                </div>
            </div>
            <div class="addr-list">
                <div class="addr-item" v-for="(item, index) in addressList" :key="index" @click="onAddressSelect(item)">
                    <div class="addr-item__text">{{ item }}</div>
                </div>

                <!-- 搜索状态 -->
                <div class="weui-loadmore" v-show="addressList && addressKey && isAddressLoading">
                    <i class="weui-loading"></i>
                    <span class="weui-loadmore__tips" style="background: transparent;">正在加载</span>
                </div>
                <div class="weui-loadmore weui-loadmore_line" v-show="addressList && addressKey && addressList.length === 0">
                    <span class="weui-loadmore__tips" style="background: transparent;">暂无数据</span>
                </div>
                <div class="weui-loadmore weui-loadmore_line" v-show="addressList && addressKey && !isAddressLoading && addressList.length > 0">
                    <span class="weui-loadmore__tips" style="background: transparent;">没有更多了</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import OrderMixin from '@/mixins/order.mixin';
import ScanMixin from '@/mixins/scan.mixin';
import PhoneMixin from '@/mixins/phone.mixin';
import StockListMixin from '@/mixins/stockList.mixin';

export default {
    mixins: [OrderMixin, ScanMixin, PhoneMixin, StockListMixin],
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            /**地址选泽 */
            visibleDialogAddress: false,
            addressKey: '',
            addressList: null,
            addressCurId: '',
            isAddressLoading: false,

            visibleDatetime: false,

            isLoading: false,
            billData: {
                expressNumber: '', // *
                expressImage: '',
                billDate: '', // *
                billNo: '',
                billType: 'STOCK_ACCEPTED_IN',
                customerAddress: '',
                customerAreaCode: '+853', // *
                customerName: '', // *
                customerPhone: '', // *
                goods: '',
                inShelveskId: '',
                inShelveskName: '',
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
    computed: {
        updateUrl: function() {
            return this.id ? `/api/scm/stock/bill/update/${this.id}` : `/api/scm/stock/bill/add`;
        },
        updateTip: function() {
            return this.id ? `修改` : `新增`;
        },
        disabled: function() {
            let disabled =
                !this.billData.billNo ||
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
        if (!this.id) {
            this.$systemAxios
                .get('/api/scm/base/stock/getDefault', {
                    params: { billType: 'STOCK_ACCEPTED_IN' }
                })
                .then(res => {
                    if (res.code !== 0) return false;
                    this.billData.inStockId = res.data.id;
                    this.billData.inStockName = res.data.name;
                });
        } else {
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
        }
    },
    methods: {
        /**地址搜索 */
        onAddressSelect(item) {
            this.billData.customerAddress = item;
            this.visibleDialogAddress = false;
        },
        onOpenAddressDialog() {
            this.visibleDialogAddress = true;
        },
        onSeachAddressByPhone() {
            this.$_debounce(this.handleQuery);
        },
        handleQuery() {
            if (!this.addressKey) {
                this.$weui.alert('手机号不能为空！');
                return false;
            }
            let params = {
                phone: this.addressKey
            };
            this.addressList = null;
            this.isAddressLoading = true;
            this.$systemAxios
                .get('/api/scm/stock/bill/queryPhoneAddress', { params })
                .then(res => {
                    if (res.code !== 0) return false;
                    this.addressList = res.data;
                    // this.addressList = [];
                    // for (let i = 0; i < 30; i++) {
                    //     this.addressList.push(i);
                    // }
                })
                .finally(() => {
                    this.isAddressLoading = false;
                });
        },
        /**日期选择 */
        onPickDate() {
            this.visibleDatetime = true;
        },
        onChangeDatetime(e) {
            this.billData.billDate = e;
        },
        /**电话区号 */
        onPickerAreaCode1() {
            this.mPickerAreaCode().then(res => {
                this.billData.customerAreaCode = res.areaCode;
            });
        },
        onPickerAreaCode2() {
            this.mPickerAreaCode().then(res => {
                this.billData.senderAreaCode = res.areaCode;
            });
        },
        //**上传解析 */
        onFileChange(e) {
            let fileDom = this.$refs.upload;
            if (!fileDom || !fileDom.value) return false;
            if (!fileDom.value.match(/.jpg|.jpeg|.gif|.png|.bmp/i)) {
                this.$weui.alert('您上传的图片格式不正确，请重新选择！');
                return false;
            } else {
                let _that = this;
                this.$weui.confirm(
                    `是否录入此图片中的业务信息？`,
                    function() {
                        _that.isLoading = true;
                        _that
                            .mloadOrderDetailByImage(fileDom.files)
                            .then(resData => {
                                _that.billData = {
                                    ..._that.billData,
                                    ...resData.billData,
                                    expressImage: resData.imageUrl
                                };
                                _that.$weui.toast('录入快递信息成功');
                            })
                            .catch(err => {
                                // Object.assign(_that.$data, _that.$options.data());
                                _that.$weui.alert('录入失败！');
                                console.error('ERROR', err);
                            })
                            .finally(() => {
                                _that.isLoading = false;
                                _that.$refs.upload.value = ''; // 清空上传容器
                            });
                    },
                    function() {},
                    {
                        title: '录入业务信息'
                    }
                );
            }
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
                })
                .catch(err => {
                    this.$weui.alert('录入失败！');
                    console.error('ERROR', err);
                });
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
        onPickerShelf() {
            if (!this.billData.inStockId) {
                this.$weui.topTips('请选择所属仓库');
                return false;
            }
            this.mPickerShelf(this.billData.inStockId).then(res => {
                if (!res.shelfId) return false;
                this.billData.inShelveskId = res.shelfId;
                this.billData.inShelveskName = res.shelfName;
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
            } else {
                this.isLoading = true;
                this.$systemAxios
                    .post(this.updateUrl, { ...this.billData, billDate: this.$dayjs(this.billData.billDate).format('YYYY-MM-DD HH:mm:ss') })
                    .then(res => {
                        if (res.code !== 0) return false;
                        this.$weui.toast(`${this.updateTip}${this.$BILL_STATUS[this.billData.billType]}成功`);
                        this.$router.back();
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
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
.system_storage-in_update {
    .query {
        padding: 10px;

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
        }
    }
    .addr-list {
        height: calc(100% - 64px);
        overflow: scroll;
    }
    .addr-item {
        padding: 5px 0;

        &__text {
            padding: 10px;
            width: 100%;
            font-size: 18px;
            line-height: 22px;
            color: #000;
            text-align: justify;
            background: #fff;
            box-sizing: border-box;
            // border-radius: 8px;

            &:active {
                background: #e2e2e2;
            }
        }
    }

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
