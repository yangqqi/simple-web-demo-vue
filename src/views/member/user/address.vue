// @物流系统
<template>
    <div class="system_station-in">
        <div class="weui-panel weui-panel_access">
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_appmsg" v-for="(item, index) in resList" :key="index">
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">
                            <span> {{ item.receiver }}</span>
                        </h4>
                        <h4 class="weui-media-box__title subtitle">
                            <a class="gl-purle" :href="item.phone ? `tel:(${item.areaCode})${item.phone}` : ''" @click.stop>
                                <i class="iconfont icon-zhcc_shoujihao" /> <span>{{ item.phone ? `(${item.areaCode})${item.phone}` : '未绑定手机号' }}</span>
                            </a>
                        </h4>
                        <p class="weui-media-box__desc">澳门地址：{{ item.macaoAddress || '未填写地址' }}</p>
                        <p class="weui-media-box__desc">大陆地址：{{ item.address || '未填写地址' }}</p>
                        <div class="opt-right" @click.stop="onCopy(item.address)">
                            <i class="icon-a iconfont icon-zhcc_chuku" />
                            <span>复制大陆地址</span>
                        </div>
                        <div class="opt-right" @click.stop="onCopy(`(${item.areaCode})${item.phone}`)">
                            <i class="icon-a iconfont icon-zhcc_xuanzhong" />
                            <span>复制电话</span>
                        </div>
                        <div class="opt-right" @click.stop="onCopy(item.receiver)">
                            <i class="icon-a iconfont icon-zhcc_xuanzhong" />
                            <span>复制收货人</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            resList: []
        };
    },
    mounted() {
        this.loadList();
    },
    methods: {
        onCopy(text) {
            if (!text) return false;
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', text);
            input.setSelectionRange(0, 9999);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                this.$weui.toast('复制成功');
            }
            document.body.removeChild(input);
        },
        loadList() {
            this.$memberAxios.get('/api/scm/member/base/pointAddress').then(res => {
                if (res.code !== 0) return false;
                this.resList = res.data;
            });
        }
    }
};
</script>

<style lang="less" scoped>
.system_station-in {
    min-height: 100vh;
    box-sizing: border-box;

    .opt-right + .opt-right {
        margin-right: 10px;
    }
    .opt-right {
        float: right;
        display: flex;
        align-items: center;
        margin-top: 8px;
        padding: 4px 8px;
        color: #fff;
        line-height: 1;
        background: #fd8700;
        border-radius: 4px;

        &:active {
            background: yellowgreen;
        }
        .icon-a {
            padding-right: 4px;
        }
    }
    .subtitle {
        padding-top: 4px;
    }
    .weui-media-box__desc {
        padding-bottom: 4px;
        color: #888;
    }
    .weui-panel {
        margin-top: 0;
    }
    .weui-cells {
        margin-top: 0;
    }
}
</style>
