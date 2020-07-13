// @物流系统/个人中心/修改手机号
<template>
    <div class="system_user_phone">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells">
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
import { mapState, mapMutations } from 'vuex';
import PhoneMixin from '@/mixins/phone.mixin';
export default {
    mixins: [PhoneMixin],
    data() {
        return {
            isLoading: false,

            timer: null,
            codeTime: 0,
            phone: '',
            areaCode: '',
            verifiCode: ''
        };
    },
    computed: {
        ...mapState(['userInfo']),
        disabled: function() {
            return !this.areaCode || !this.phone || !this.verifiCode || !this.userInfo;
        },
        vcDisabled: function() {
            return !this.areaCode || !this.phone || this.codeTime > 0;
        }
    },
    mounted() {
        if (!this.userInfo) return false;
        this.phone = this.userInfo.phone;
        this.areaCode = this.userInfo.areaCode;
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    methods: {
        ...mapMutations(['updateUserInfo']),
        onPickAreaCode() {
            this.mPickerAreaCode().then(resData => {
                this.areaCode = resData.areaCode;
            });
        },
        onGetVerifiCode() {
            if (this.vcDisabled) return false;
            if (this.userInfo.phone === this.phone && this.userInfo.areaCode === this.areaCode) {
                this.$weui.topTips('该手机号与当前手机号相同');
            } else if (this.phone.length > 11) {
                this.$weui.topTips('字数不超过11个字符');
            } else {
                let _that = this;
                this.$weui.confirm(
                    `是否确定向 (${this.areaCode})${this.phone} 发送短信验证码？`,
                    function() {
                        _that.handleGetVerifiCode();
                    },
                    function() {},
                    {
                        title: '发送验证码'
                    }
                );
            }
        },
        handleGetVerifiCode() {
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
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            this.isLoading = true;
            this.$systemAxios
                .post('/api/scm/account/updatePhone', {
                    areaCode: this.areaCode,
                    phone: this.phone,
                    vcode: this.verifiCode
                })
                .then(res => {
                    if (res.code !== 0) return false;
                    // 同步 systemCookie 和仓储
                    this.updateUserInfo({
                        areaCode: this.areaCode,
                        phone: this.phone
                    });
                    this.$weui.toast('修改成功');
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
.system_user_phone {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
    .weui-cell_select-before {
        .weui-label {
            width: 52px;
        }
    }
    .weui-btn_disabled {
        color: rgba(0, 0, 0, 0.2);
        color: var(--weui-BTN-DISABLED-FONT-COLOR);
        background-color: #f2f2f2;
        background-color: var(--weui-BTN-DEFAULT-BG);
    }
}
</style>
