export default {
    data() {
        return {
            mStockList: null
        };
    },
    methods: {
        //**选择仓库 */
        mPickerStock() {
            return new Promise((resolve, reject) => {
                this._mLoadStockList()
                    .then(resList => {
                        if (!resList || resList.length === 0) {
                            this.$weui.alert('无仓库数据！');
                        } else {
                            this.mStockList = resList;
                            this.$weui.picker(resList, {
                                id: 'stockPicker',
                                container: 'body',
                                defaultValue: [0],
                                onChange: function(result) {},
                                onConfirm: function(result) {
                                    if (!result[0]) {
                                        reject(result);
                                    } else {
                                        resolve({
                                            stockId: result[0].value,
                                            stockName: result[0].label
                                        });
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        //**选择仓库对应货架 */
        mPickerShelf(mStockId) {
            return new Promise((resolve, reject) => {
                this._mLoadShelfList(mStockId)
                    .then(resList => {
                        if (!resList || resList.length === 0) {
                            this.$weui.alert('当前仓库无货架数据！');
                        } else {
                            this.$weui.picker(resList, {
                                id: 'shelfPicker',
                                container: 'body',
                                defaultValue: [0],
                                onChange: function(result) {},
                                onConfirm: function(result) {
                                    if (!result[0]) {
                                        reject(result);
                                    } else {
                                        resolve({
                                            shelfId: result[0].value,
                                            shelfName: result[0].label
                                        });
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        //**拉取仓库列表 */
        _mLoadStockList() {
            return new Promise((resolve, reject) => {
                if (this.mStockList) {
                    resolve(this.mStockList);
                } else {
                    this.$systemAxios
                        .get(`/api/scm/base/stock/query`)
                        .then(res => {
                            if (res.code !== 0) {
                                resolve([]);
                            } else {
                                let stockList = res.data.map(el => {
                                    return {
                                        label: el.name,
                                        value: el.id
                                    };
                                });
                                resolve(stockList);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**拉取仓库对应货架列表 */
        _mLoadShelfList(mStockId) {
            return new Promise((resolve, reject) => {
                if (!mStockId) {
                    resolove([]);
                } else {
                    this.$systemAxios
                        .get(`/api/scm/base/goodsshelves/query`, {
                            params: {
                                stockId: mStockId
                            }
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                resolve([]);
                            } else {
                                let shelfList = res.data.map(el => {
                                    return {
                                        label: el.name,
                                        value: el.id
                                    };
                                });
                                resolve(shelfList);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        }
    }
};
