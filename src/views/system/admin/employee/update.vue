// @物流系统/员工管理/新增修改
<template>
  <div class="system_employee_update">
    <div class="weui-form">
      <div class="weui-form__control-area">
        <div class="weui-cells__group weui-cells__group_form">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><label class="weui-label gl-required">姓名</label></div>
              <div class="weui-cell__bd weui-flex">
                <input class="weui-input" v-model="userName" type="text" pattern="[^<>/\s]*" placeholder="字数不超过16个字符" maxlength="16" />
              </div>
            </div>
            <div class="weui-cell weui-cell_active weui-cell_access  weui-cell_select weui-cell_select-before">
              <div class="weui-cell__hd" @click.stop="onPickerAreaCode">
                <label class="weui-label gl-required">{{ areaCode || '区号' }}</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" v-model="phone" type="tel" pattern="[0-9]*" placeholder="请填写手机号码" maxlength="11" />
              </div>
            </div>
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><label class="weui-label">管理仓库</label></div>
              <div class="weui-cell__bd">
                <div class="weui-cells_checkbox">
                  <label class="weui-cell weui-check__label" v-for="(item, index) in manageStockList" :key="index">
                    <div class="weui-cell__hd">
                      <input type="checkbox" class="weui-check" :name="item.id" :id="item.id" v-model="item.checked" />
                      <i class="weui-icon-checked"></i>
                    </div>
                    <div class="weui-cell__bd">
                      <p>{{ item.name }}</p>
                    </div>
                  </label>
                  <a href="javascript:" class="weui-cell weui-cell_link" @click.stop="onPickerStock">
                    <div class="weui-cell__bd">添加更多</div>
                  </a>
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
import PhoneMixin from '@/mixins/phone.mixin';
import StockListMixin from '@/mixins/stockList.mixin';

export default {
    mixins: [PhoneMixin, StockListMixin],
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: false,

            userName: '',
            areaCode: '',
            phone: '',
            manageStock: '',

            manageStockList: [],
            stockList: []
        };
    },
    watch: {
        manageStock: function(newVal) {
            if (!newVal) {
                this.manageStockList = [];
            } else {
                let ids = newVal.split(',');
                let list = ids.map(el => {
                    let s = this.stockList.find(k => {
                        return el === k.id;
                    });
                    return {
                        id: el,
                        name: s.name,
                        checked: true
                    };
                });
                this.manageStockList = list;
            }
        }
    },
    computed: {
        updateUrl: function() {
            return this.id ? `/api/scm/employee/storekeeper/update/${this.id}` : `/api/scm/employee/storekeeper/add`;
        },
        updateTip: function() {
            return this.id ? `修改` : `新增`;
        },
        disabled: function() {
            return !this.userName || !this.phone || !this.areaCode;
        }
    },
    mounted() {
        this.$systemAxios.get(`/api/scm/base/stock/query`).then(res => {
            if (res.code !== 0) return false;
            this.stockList = res.data;
            if (!this.id) return false;
            this.userName = this.$route.query.userName;
            this.phone = this.$route.query.phone;
            this.areaCode = this.$route.query.areaCode;
            this.manageStock = this.$route.query.manageStock;
        });
    },
    methods: {
        onPickerStock() {
            this.mPickerStock().then(res => {
                if (!res.stockId) return false;
                if (!this.manageStock) {
                    this.manageStock += res.stockId;
                } else {
                    let idx = this.manageStock.indexOf(res.stockId);
                    if (idx < 0) {
                        this.manageStock += `,${res.stockId}`;
                    }
                }
            });
        },
        onPickerAreaCode() {
            this.mPickerAreaCode().then(res => {
                this.areaCode = res.areaCode;
            });
        },
        onSubmit() {
            this.$_debounce(this.handleSubmit);
        },
        handleSubmit() {
            if (this.disabled || this.isLoading) return false;
            if (this.userName.length > 16) {
                this.$weui.topTips('姓名字数不超过16个字符');
            } else if (this.userName.search(/[<>/\s]/g) >= 0) {
                this.$weui.topTips('不能含有<、>、/和空白字符');
            } else if (this.phone.length > 11) {
                this.$weui.topTips('手机号字数不超过11个字符');
            } else {
                this.isLoading = true;
                let sList = [];
                this.manageStockList.forEach(el => {
                    if (el.checked) sList.push(el.id);
                });

                this.$systemAxios
                    .post(this.updateUrl, {
                        userName: this.userName,
                        phone: this.phone,
                        areaCode: this.areaCode,
                        manageStock: sList.join()
                    })
                    .then(res => {
                        if (res.code !== 0) return false;
                        this.$weui.toast(`${this.updateTip}员工成功`);
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
.system_employee_update {
    .weui-form {
        min-height: 100vh;
        box-sizing: border-box;
    }
    .weui-cell_select-before {
        .weui-label {
            width: 52px;
        }
    }
    .weui-cells_checkbox {
        .weui-cell {
            padding-left: 0;

            &.weui-cell_link::before {
                border-top: 0;
            }
        }
    }
}
</style>
