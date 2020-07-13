// @全屏加载动画
<template>
  <div class="gl-full-loading" v-show="visible" @click.prevent @touchmove.prevent @click.stop="onClose">
    <div class="datetime" @click.stop>
      <van-datetime-picker v-if="type === 'DATETIME'" type="datetime" :min-date="minDate || min_Date" :max-date="maxDate || max_Date" :value="new Date()" :formatter="formatter" @confirm="onChangeDatetime" @cancel="onClose"></van-datetime-picker>
      <van-datetime-picker v-if="type === 'DATE'" type="date" :min-date="minDate || min_Date" :max-date="maxDate || max_Date" :value="new Date()" :formatter="formatter" @confirm="onChangeDatetime" @cancel="onClose"></van-datetime-picker>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'DATETIME'
        },
        min: {
            type: String,
            default: undefined
        },
        minDate: {
            type: Date,
            default: undefined
        },
        maxDate: {
            type: Date,
            default: undefined
        }
    },
    data() {
        return {
            visible: false,
            min_Date: '',
            max_Date: ''
        };
    },
    beforeMount() {
        //**起点 */
        if (!this.min) {
            let date = new Date();
            date.setFullYear(2000);
            this.min_Date = date;
        } else if (this.min === 'NOW') {
            // 设定日期起点为现在
            this.min_Date = new Date();
        }

        //**终点 */
        let date2 = new Date();
        date2.setFullYear(2200);
        this.max_Date = date2;
    },
    watch: {
        isVisible: function(newVal) {
            this.visible = newVal;
        }
    },
    methods: {
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            } else if (type === 'day') {
                return `${val}日`;
            } else if (type === 'hour') {
                return `${val}时`;
            } else if (type === 'minute') {
                return `${val}分`;
            }
            return val;
        },
        onClose() {
            this.visible = false;
            this.$emit('close');
        },
        onChangeDatetime(e) {
            if (this.type === 'DATETIME') {
                var date = this.$dayjs(e).format('YYYY-MM-DD HH:mm');
            } else if (this.type === 'DATE') {
                var date = this.$dayjs(e).format('YYYY-MM-DD');
            }

            this.$emit('change', date);
            this.$emit('close');
        }
    }
};
</script>

<style lang="less">
.gl-full-loading {
    .van-picker__cancel,
    .van-picker__confirm {
        color: #309d68;
    }
}
</style>

<style lang="less" scoped>
.gl-full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.3);

    .datetime {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100vw;
        box-sizing: border-box;
    }
}
</style>
