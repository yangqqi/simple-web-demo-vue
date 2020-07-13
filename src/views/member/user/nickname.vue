// @会员系统/个人中心/修改姓名
<template>
    <div class="member_user_nickname">
        <div class="weui-form">
            <div class="weui-form__control-area">
                <div class="weui-cells__group weui-cells__group_form">
                    <div class="weui-cells weui-cells_form">
                        <div class="weui-cell weui-cell_active">
                            <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
                            <div class="weui-cell__bd weui-flex">
                                <input class="weui-input" v-model="nickname" type="text" pattern="[^<>/\s]*" placeholder="字数不超过16个字符" maxlength="16" />
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
export default {
    data() {
        return {
            isLoading: false,

            nickname: ''
        };
    },
    computed: {
        ...mapState(['memberInfo']),
        disabled: function() {
            return !this.nickname || !this.memberInfo;
        }
    },
    mounted() {
        if (!this.memberInfo) return false;
        this.nickname = this.memberInfo.userName;
    },
    methods: {
        ...mapMutations(['updateMemberInfo']),
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.memberInfo.userName === this.nickname) {
                this.$weui.topTips('该姓名与当前姓名相同');
            } else if (this.nickname.length > 16) {
                this.$weui.topTips('字数不超过16个字符');
            } else if (this.nickname.search(/[<>/\s]/g) >= 0) {
                this.$weui.topTips('不能含有<、>、/和空白字符');
            } else {
                this.isLoading = true;
                this.$memberAxios
                    .postParams('/api/scm/member/base/userName', {
                        userName: this.nickname
                    })
                    .then(res => {
                        if (res.code !== 0) return false;
                        // 同步 memberCookie 和仓储
                        this.updateMemberInfo({
                            userName: this.nickname
                        });
                        this.$weui.toast('修改成功');
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
.member_user_nickname {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
}
</style>
