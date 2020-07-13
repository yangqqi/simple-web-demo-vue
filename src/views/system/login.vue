// @物流系统/登录注册
<template>
    <div class="system_login">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells weui-cells_form" v-show="loginType[curIdx] === 'ACCOUNT'">
                        <div class="weui-cell">
                            <div class="weui-cell__hd"><label class="weui-label">账号</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="account" type="text" placeholder="请输入账号" maxlength="50" />
                            </div>
                        </div>
                        <div class="weui-cell">
                            <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="password" type="password" placeholder="请输入密码" maxlength="50" />
                            </div>
                        </div>
                    </div>
                    <div class="weui-cells weui-cells_form" v-show="loginType[curIdx] === 'PHONE'">
                        <div class="weui-cell weui-cell_active weui-cell_access  weui-cell_select weui-cell_select-before">
                            <div class="weui-cell__hd" @click.stop="onPickAreaCode">
                                <label class="weui-label">{{ areaCode || '区号' }}</label>
                            </div>
                            <div class="weui-cell__bd">
                                <input class="weui-input" v-model="phone" type="tel" pattern="[0-9]*" placeholder="请填写手机号码" maxlength="11" />
                            </div>
                        </div>
                        <div class="weui-cell">
                            <div class="weui-cell__hd"><label class="weui-label">验证码</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="verifiCode" type="text" pattern="[0-9]*" placeholder="验证码" maxlength="8" />
                            </div>
                            <div class="weui-cell__ft" @click.stop="onGetVerifiCode">
                                <button class="weui-btn weui-btn_default weui-vcode-btn" :class="{ 'weui-btn_disabled': vcDisabled }">{{ codeTime || '获取验证码' }}</button>
                            </div>
                        </div>
                    </div>
                    <div class="weui-cells__tips text-large">
                        <a class="weui-link gl-green" @click.stop="onChangeType">用{{ btnLabel }}登录</a>
                    </div>
                </div>
            </div>
            <div class="weui-form__tips-area" @click.stop="onLoginWechat">
                <i class="icon-wechat" />
            </div>
            <div class="weui-form__tips-area">
                <p class="weui-form__tips">微信登录需要注册用户已绑定微信，</p>
                <p class="weui-form__tips">请尽快绑定微信。</p>
                <p class="weui-form__tips" v-show="loginType[curIdx] === 'ACCOUNT'">
                    密码必须至8个字符，而且同时包含字母和数字。
                </p>
            </div>
            <div class="weui-form__opr-area">
                <a class="weui-btn weui-btn_primary" :class="{ 'weui-btn_disabled': disabled }" @click.stop="onSubmit">登录</a>
            </div>
        </div>

        <gl-full-loading :is-loading="isLoading" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import AccountMixin from '@/mixins/account.mixin';
import PhoneMixin from '@/mixins/phone.mixin';
import WechatMixin from '@/mixins/wechat.mixin';

export default {
    mixins: [AccountMixin, PhoneMixin, WechatMixin],
    data() {
        return {
            isLoading: false,

            loginType: ['ACCOUNT', 'PHONE'],
            curIdx: 1,

            account: '',
            password: '',

            timer: null,
            codeTime: 0,
            phone: '',
            areaCode: '+86',
            verifiCode: ''
        };
    },
    computed: {
        btnLabel: function() {
            if (this.loginType[this.curIdx] === 'ACCOUNT') {
                return '短信验证码';
            } else if (this.loginType[this.curIdx] === 'PHONE') {
                return '账户';
            } else {
                return '未知';
            }
        },
        disabled: function() {
            if (this.loginType[this.curIdx] === 'ACCOUNT') {
                return !this.account || !this.password;
            } else if (this.loginType[this.curIdx] === 'PHONE') {
                return !this.areaCode || !this.phone || !this.verifiCode;
            } else {
                return true;
            }
        },
        vcDisabled: function() {
            return !this.areaCode || !this.phone || this.codeTime > 0;
        }
    },
    mounted() {
        let loginData = this.$systemCookie.getLoginData();
        if (loginData) {
            this.account = loginData.account;
            this.password = loginData.encryptKey;
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    methods: {
        onGetVerifiCode() {
            if (this.vcDisabled) return false;
            this.codeTime = 60;
            let _that = this;
            this.timer = setInterval(() => {
                _that.codeTime -= 1;
                if (_that.codeTime <= 0) {
                    clearInterval(_that.timer);
                }
            }, 1000);
            this.$systemAxios.post('/api/scm/login/sendVcode', {
                areaCode: this.areaCode,
                phone: this.phone,
                vcode: 123456
            });
        },
        onChangeType() {
            this.curIdx += 1;
            this.curIdx = this.curIdx % this.loginType.length;
        },
        onPickAreaCode() {
            this.mPickerAreaCode().then(resData => {
                this.areaCode = resData.areaCode;
            });
        },
        loginByAccount() {
            this.isLoading = true;
            this.mLoginSystemByAccount({
                account: this.account,
                password: this.password
            })
                .then(() => {
                    this.$weui.toast('登录成功');
                    this.$linkTo('/system');
                })
                .catch(err => {
                    console.error('ERROR', err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        loginByPhone() {
            this.isLoading = true;
            this.mLoginSystemByPhone({
                areaCode: this.areaCode,
                phone: this.phone,
                vcode: this.verifiCode
            })
                .then(() => {
                    this.$weui.toast('登录成功');
                    this.$linkTo('/system');
                })
                .catch(err => {
                    console.error('ERROR', err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        loginByWechat() {
            this.mOnWechatUrlAsEmployee();
        },
        onLoginWechat() {
            this.$_debounce(this.loginByWechat);
        },
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.loginType[this.curIdx] === 'ACCOUNT') {
                this.loginByAccount();
            } else if (this.loginType[this.curIdx] === 'PHONE') {
                this.loginByPhone();
            } else {
                return false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.system_login {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
    .weui-cell_select-before {
        .weui-label {
            width: 52px;
        }
    }
    .weui-form__opr-area {
        margin-bottom: 0 !important;
    }
    .weui-btn_disabled {
        color: rgba(0, 0, 0, 0.2);
        color: var(--weui-BTN-DISABLED-FONT-COLOR);
        background-color: #f2f2f2;
        background-color: var(--weui-BTN-DEFAULT-BG);
    }
    .text-large {
        font-size: 16px;
    }
    .icon-wechat {
        display: block;
        width: 48px;
        height: 48px;
        margin: 0 auto;
        background: url('~@/assets/icon-wechat.png') no-repeat;
        background-size: cover;

        &:active {
            opacity: 0.7;
        }
    }
}
</style>
