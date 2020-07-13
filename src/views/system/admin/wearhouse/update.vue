// @物流系统/仓库管理/新增修改
<template>
    <div class="system_wearhouse_update">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">仓库名称</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="name" type="text" pattern="[^<>/\s]*" placeholder="请填写仓库名称" maxlength="20" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active weui-cell_switch">
                            <div class="weui-cell__bd">是否为提货点</div>
                            <div class="weui-cell__ft">
                                <input class="weui-switch" v-model="deliveryPlace" type="checkbox" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">管理员</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="person" type="text" pattern="[^<>/\s]*" placeholder="请填写管理员姓名" maxlength="20" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label gl-required">地址</label></div>
                            <div class="weui-cell__bd">
                                <textarea class="weui-textarea" v-model="address" placeholder="请填写仓库地址" rows="4" maxlength="200"></textarea>
                                <div class="weui-textarea-counter">
                                    <span>{{ address.length }}</span
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
export default {
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: false,

            name: '',
            deliveryPlace: true,
            address: '',
            person: ''
        };
    },
    computed: {
        updateUrl: function() {
            return this.id ? `/api/scm/base/stock/update/${this.id}` : `/api/scm/base/stock/add`;
        },
        updateTip: function() {
            return this.id ? `修改` : `新增`;
        },
        disabled: function() {
            return !this.name || !this.address || !this.person;
        }
    },
    mounted() {
        if (!this.id) return false;
        this.$systemAxios.get(`/api/scm/base/stock/get/${this.id}`).then(res => {
            if (res.code !== 0) return false;
            this.name = res.data.name;
            this.deliveryPlace = res.data.deliveryPlace;
            this.address = res.data.address;
            this.person = res.data.person;
        });
    },
    methods: {
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.name.length > 20 || this.person.length > 20) {
                this.$weui.topTips('名称字数不超过20个字符');
            } else if (this.name.search(/[<>/\s]/g) >= 0 || this.person.search(/[<>/\s]/g) >= 0) {
                this.$weui.topTips('名称不能含有<、>、/和空白字符');
            } else {
                this.isLoading = true;
                this.$systemAxios
                    .post(this.updateUrl, {
                        name: this.name,
                        deliveryPlace: this.deliveryPlace,
                        address: this.address,
                        person: this.person
                    })
                    .then(res => {
                        if (res.code !== 0) return false;
                        this.$weui.toast(`${this.updateTip}仓库成功`);
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
.system_wearhouse_update {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
}
</style>
