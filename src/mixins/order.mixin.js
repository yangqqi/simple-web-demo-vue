{
    /* <input ref="upload" @change="onFileChange" v-show="false" type="file" accept="image/*" /> */
}
export default {
    mounted(){
        // console.log(this.mIsIOS)
    },
    computed: {
        mIsIOS: function() {
            let ua = navigator.userAgent.toLowerCase();
            this.$weui.alert(ua)
            if (ua.match(/iPhone\sOS/i) == 'iphone os') {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        //**根据提货码获取业务信息 */
        mloadOrderDetailByDeliverNum(number) {
            return new Promise((resolve, reject) => {
                if (!number) {
                    reject(new Error('传参不合法！'));
                } else {
                    let params = {
                        deliveryNumber: number
                    };
                    this.$systemAxios
                        .get('/api/scm/stock/bill/queryByDeliverNum', { params })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                // delete res.data.id; // 清空id
                                // delete res.data.billType; // 清空状态
                                delete res.data.billDate;
                                resolve(res.data);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**根据订单号获取业务信息 */
        mloadOrderDetailByNo(type, number) {
            return new Promise((resolve, reject) => {
                if (!type || !number) {
                    reject(new Error('传参不合法！'));
                } else {
                    let params = {
                        type: type,
                        expressNumber: number
                    };
                    this.$systemAxios
                        .get('/api/scm/stock/bill/queryByNumber', { params })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                // delete res.data.id; // 清空id
                                // delete res.data.billType; // 清空状态
                                delete res.data.billDate;
                                // delete res.data.inStockId;
                                // delete res.data.inStockName;
                                // delete res.data.inShelveskId;
                                // delete res.data.inShelveskName;
                                resolve(res.data);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**根据图片获取业务信息 */
        mloadOrderDetailByImage(files) {
            return new Promise((resolve, reject) => {
                let saveUrl;
                this._mUploadSingleFile(files)
                    .then(resUrl => {
                        saveUrl = resUrl;
                        return this._mReadOrderDetail(resUrl);
                    })
                    .then(res => {
                        if (res.code !== 0) {
                            reject(res);
                        } else {
                            if (res.data.customerPhone && res.data.customerPhone.indexOf('1') === 0) {
                                res.data.customerAreaCode = '+86';
                            } else if (res.data.customerPhone && res.data.customerPhone.indexOf('6') === 0) {
                                res.data.customerAreaCode = '+853';
                            }
                            if (res.data.senderPhone && res.data.senderPhone.indexOf('1') === 0) {
                                res.data.senderAreaCode = '+86';
                            } else if (res.data.senderPhone && res.data.senderPhone.indexOf('6') === 0) {
                                res.data.senderAreaCode = '+853';
                            }
                            resolve({
                                billData: res.data,
                                imageUrl: saveUrl
                            });
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        //**上传单文件 */
        _mUploadSingleFile(files) {
            return new Promise((resolve, reject) => {
                if (!files || !files[0]) {
                    reject(new Error('文件传参为空！'));
                } else {
                    let formData = new FormData();
                    formData.append('file', files[0]);
                    this.$systemAxios
                        .post('/api/file/uploadSingle', formData)
                        .then(res => {
                            if (res.code !== 0 || !res.data.src || res.data.src.length === 0) {
                                reject(res);
                            } else {
                                resolve(res.data.src[0]);
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        },
        //**解读订单图片 */
        _mReadOrderDetail(url) {
            return new Promise((resolve, reject) => {
                if (!url) {
                    reject(new Error('传参不合法！'));
                } else {
                    this.$systemAxios
                        .get('/api/scm/tcocr/getWaybill', {
                            params: {
                                // imageUrl: url + '?imageslim'
                                imageUrl: url
                            }
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                resolve(res);
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
