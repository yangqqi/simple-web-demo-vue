// @物流系统/货架管理/新增修改
<template>
    <div class="system_goods-shelf_update">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">货架名称</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="name" type="number" pattern="[0-9]*" placeholder="请填写货架名称" maxlength="16" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after" @click.stop="onPickerStock1">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">所属仓库</label></div>
                            <div class="weui-cell__bd">{{ stockName || '请选择' }}</div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">层数</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="level" type="number" pattern="[0-9]*" placeholder="请填写层数" maxlength="16" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">备注</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" v-model="remark" placeholder="请填写备注" rows="3" maxlength="200"></textarea>
                                <div class="weui-textarea-counter">
                                    <span>{{ remark ? remark.length : 0 }}</span
                                    >/200
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weui-form__opr-area">
                <a class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': disabled }" @click.stop="onSubmit">确定</a>
            </div>
        </div>

        <gl-full-loading :is-loading="isLoading" />
    </div>
</template>

<script>
import StockList from '@/mixins/stockList.mixin';
export default {
    mixins: [StockList],
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: false,

            name: 0,
            stockId: '',
            stockName: '',
            level: 0,
            remark: ''
        };
    },
    computed: {
        updateUrl: function() {
            return this.id ? `/api/scm/base/goodsshelves/update/${this.id}` : `/api/scm/base/goodsshelves/add`;
        },
        updateTip: function() {
            return this.id ? `修改` : `新增`;
        },
        disabled: function() {
            return (!this.name && this.name !== 0) || !this.stockId;
        }
    },
    mounted() {
        if (!this.id) return false;
        this.$systemAxios.get(`/api/scm/base/goodsshelves/get/${this.id}`).then(res => {
            if (res.code !== 0) return false;
            this.name = res.data.name;
            this.stockId = res.data.stockId;
            this.stockName = res.data.stockName;
            this.level = res.data.level;
            this.remark = res.data.remark;
        });
    },
    methods: {
        onPickerStock1() {
            this.mPickerStock().then(res => {
                this.stockId = res.stockId;
                this.stockName = res.stockName;
            });
        },
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            this.isLoading = true;
            this.$systemAxios
                .post(this.updateUrl, {
                    name: this.name,
                    stockId: this.stockId,
                    level: this.level,
                    remark: this.remark
                })
                .then(res => {
                    if (res.code !== 0) return false;
                    this.$weui.toast(`${this.updateTip}货架成功`);
                    this.$router.back();
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.system_goods-shelf_update {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
}
</style>
