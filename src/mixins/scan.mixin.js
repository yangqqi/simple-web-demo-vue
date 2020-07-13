export default {
    data() {
        return {
            mIsRegistered: false
        };
    },
    methods: {
        isWechat() {
            var ua = navigator.userAgent.toLowerCase();
            return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
        },
        mOpenCodeScan() {
            return new Promise((resolve, reject) => {
                if (!this.isWechat()) {
                    this.$weui.alert('当前客户端不支持微信扫码！');
                    resolve();
                } else {
                    let _that = this;
                    wx.checkJsApi({
                        jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function(res) {
                            // 以键值对的形式返回，可用的api值true，不可用为false
                            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                            console.log(res);
                            let checkResult = res.checkResult;
                            if (checkResult.scanQRCode) {
                                _that
                                    .mHandleCodeScan()
                                    .then(resData => {
                                        resolve(resData);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else {
                                _that.$weui.alert('当前客户端不支持微信扫码！');
                                resolve();
                            }
                        },
                        fail: function(err) {
                            reject(err);
                        }
                    });
                }
            });
        },
        mHandleCodeScan() {
            return new Promise((resolve, reject) => {
                this._registerWechaJssdk()
                    .then(() => {
                        let _that = this;
                        wx.ready(function() {
                            _that.mIsRegistered = true;
                            wx.scanQRCode({
                                needResult: '1', // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                                success: function(res) {
                                    console.log('1-1', res);
                                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                    result = result.replace(/CODE_128,/g, '');
                                    resolve(result);
                                },
                                fail: function(res) {
                                    console.log('1-2', res);
                                    reject(res);
                                },
                                cancel: function(res) {
                                    console.log('1-3', res);
                                    reject(res);
                                }
                            });
                        });
                        wx.error(function(res) {
                            console.log('2-1', res);
                            reject(res);
                        });
                    })
                    .catch(err => {
                        //...
                        reject(err);
                    });
            });
        },
        _registerWechaJssdk() {
            return new Promise((resolve, reject) => {
                if (this.mIsRegistered) {
                    resolve();
                } else {
                    let curPath = this.$route.path;
                    let fullUrl = window.self.document.URL;
                    let urlArr = fullUrl.split(`#${curPath}`);
                    let requestUrl = encodeURIComponent(urlArr[0] + urlArr[1]);
                    console.log(urlArr[0] + urlArr[1], requestUrl);
                    this.$systemAxios
                        .get('/api/scm/wechat/jsapiConfig', {
                            params: {
                                requestUrl: requestUrl
                            }
                        })
                        .then(res => {
                            if (res.code !== 0) {
                                reject(res);
                            } else {
                                wx.config({
                                    ...res.data,
                                    debug: false
                                    // jsApiList: [] // 必填，需要使用的JS接口列表
                                });
                                resolve(res.data);
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
