// @物流系统/仓库管理
<template>
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
        <div class="system_wearhouse">
            <div class="weui-panel weui-panel_access">
                <div class="weui-panel__bd">
                    <van-list v-model="isLoading" :finished="isFinished" finished-text="没有更多了" @load="onButtomLoad">
                        <a class="weui-media-box weui-media-box_appmsg" v-for="(item, index) in resList" :key="index" @click.stop="onClick(item)">
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title">{{ item.name }}</h4>
                                <p class="weui-media-box__desc">{{ item.address }}</p>
                                <ul class="weui-media-box__info">
                                    <li class="weui-media-box__info__meta gl-green">
                                        <i class="icon-a iconfont icon-zhcc_yonghuming" /><span>{{ item.person }}</span>
                                    </li>
                                    <li class="weui-media-box__info__meta meta-a gl-orange" v-if="item.deliveryPlace"><i class="icon-a iconfont icon-zhcc_xuanzhong" /><span>提货点</span></li>
                                    <!-- <li class="weui-media-box__info__meta weui-media-box__info__meta_extra" v-if="item.deliveryPlace">提货点</li> -->
                                </ul>
                            </div>
                        </a>
                    </van-list>
                </div>
            </div>

            <gl-add @click="onClickAdd" />
            <gl-full-loading :is-loading="isUpdating" />
        </div>
    </van-pull-refresh>
</template>

<script>
export default {
    data() {
        return {
            isRefreshing: false,
            isLoading: false,
            isFinished: false,
            params: {
                pageSize: 16,
                pageNo: 0
            },
            resList: [],
            isUpdating: false
        };
    },
    methods: {
        loadList() {
            let params = {
                ...this.params
            };
            this.isLoading = true;
            this.$systemAxios
                .get('/api/scm/base/stock/query', { params })
                .then(res => {
                    if (res.code !== 0) {
                        this.isFinished = true;
                    } else {
                        this.resList = this.resList.concat(res.data);
                        this.isFinished = (this.resList.length >= res.count && res.count > 0) || res.count === 0;
                    }
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        resetList() {
            this.params.pageNo = 1;
            this.resList.length = 0;
            this.isFinished = false;
            this.isLoading = false;
            this.loadList();
            this.isRefreshing = false;
        },
        onButtomLoad() {
            if (!this.isFinished) {
                this.params.pageNo += 1;
                this.loadList();
            }
        },
        onRefresh() {
            this.isRefreshing = true;
            this.resetList();
        },
        onClick(item) {
            if (!item || !item.id) return false;
            let _that = this;
            this.$weui.actionSheet(
                [
                    {
                        label: '修改',
                        onClick: function() {
                            _that.handleEdit(item);
                        }
                    },
                    {
                        label: '删除',
                        onClick: function() {
                            _that.handleDelete(item.id);
                        }
                    }
                ],
                [
                    {
                        label: '取消',
                        onClick: function() {}
                    }
                ],
                {
                    onClose: function() {}
                }
            );
        },
        onClickAdd() {
            this.$linkTo(`${this.$route.path}/add`);
        },
        handleEdit(item) {
            if (!item || !item.id) return false;
            this.$linkTo(`${this.$route.path}/update/${item.id}`);
        },
        handleDelete(id) {
            if (!id) return false;
            let _that = this;
            this.$weui.confirm(
                '是否确定删除此仓库？',
                function() {
                    _that.isUpdating = true;
                    _that.$systemAxios
                        .delete(`/api/scm/base/stock/del/${id}`)
                        .then(res => {
                            if (res.code !== 0) return false;
                            _that.$weui.toast(`删除成功`);
                            let idx = _that.resList.findIndex(el => {
                                return id === el.id;
                            });
                            if (idx > -1) {
                                _that.resList.splice(idx, 1);
                            }
                        })
                        .finally(() => {
                            _that.isUpdating = false;
                        });
                },
                function() {},
                {
                    title: '删除'
                }
            );
        }
    }
};
</script>

<style lang="less" scoped>
.system_wearhouse {
    min-height: 100vh;
    box-sizing: border-box;

    .weui-media-box__info__meta {
        display: flex;
        align-items: center;
        line-height: 1;
    }
    .weui-cells {
        margin-top: 0;
    }
    .icon-a {
        padding-right: 4px;
    }
    .meta-a {
        float: right;
    }
}
</style>
