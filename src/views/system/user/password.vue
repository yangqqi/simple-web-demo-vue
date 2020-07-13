// @物流系统/个人中心/修改密码
<template>
    <div class="system_user_password">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">新密码</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="newpwd1" type="password" pattern="^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$" placeholder="请输入新的密码" maxlength="20" />
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">确认密码</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="newpwd2" type="password" pattern="^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$" placeholder="请再次输入新密码" maxlength="20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weui-form__tips-area">
                <p class="weui-form__tips">
                    密码必须至8个字符，
                </p>
                <p class="weui-form__tips">
                    而且同时包含字母和数字。
                </p>
            </div>
            <div class="weui-form__opr-area">
                <a class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': disabled }" @click.stop="onSubmit">确定</a>
            </div>
        </div>

        <gl-full-loading :is-loading="isLoading" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AccountMixin from '@/mixins/account.mixin';
export default {
    mixins: [AccountMixin],
    data() {
        return {
            isLoading: false,

            pattern: '^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$',
            newpwd1: '',
            newpwd2: ''
        };
    },
    computed: {
        ...mapState(['userInfo']),
        disabled: function() {
            return !this.newpwd1 || !this.newpwd2 || !this.userInfo;
        }
    },
    methods: {
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.newpwd1.search(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) < 0 || this.newpwd2.search(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) < 0) {
                this.$weui.topTips('密码必须至8个字符，而且同时包含字母和数字。');
            } else if (this.newpwd1.length > 20 || this.newpwd2.length > 20) {
                this.$weui.topTips('字数不超过20字符');
            } else if (this.newpwd1 !== this.newpwd2) {
                this.$weui.topTips('两次填写密码不一致');
            } else {
                this.isLoading = true;
                this.mEncryptPassword({ password: this.newpwd1 })
                    .then(authData => {
                        return this.$systemAxios.post('/api/scm/account/editPsw', {
                            confirmPassword: authData.encryptKey,
                            publicKey: authData.publicKey
                        });
                    })
                    .then(res => {
                        if (res.code !== 0) return false;
                        this.$weui.toast('修改成功');
                        this.$router.back();
                    })
                    .catch(err => {
                        console.error('ERROR', err);
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
.system_user_password {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
}
</style>
