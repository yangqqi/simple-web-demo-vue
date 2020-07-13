export default {
    methods: {
        mPickerArea() {
            return new Promise((resolve, reject) => {
                let _that = this;
                this.$weui.picker(
                    [
                        {
                            label: '中国大陆',
                            value: '+86'
                        },
                        {
                            label: '中国澳门',
                            value: '+853'
                        }
                    ],
                    {
                        id: 'singleLinePicker2',
                        container: 'body',
                        defaultValue: [0],
                        onChange: function(result) {},
                        onConfirm: function(result) {
                            if (!result[0]) {
                                reject(result);
                            } else {
                                resolve({
                                    areaCode: result[0].value,
                                    prefix: result[0].label
                                });
                            }
                        }
                    }
                );
            });
        },
        mPickerAreaCode() {
            return new Promise((resolve, reject) => {
                let _that = this;
                this.$weui.picker(
                    [
                        {
                            label: '中国大陆(+86)',
                            value: '+86'
                        },
                        {
                            label: '中国澳门(+853)',
                            value: '+853'
                        }
                    ],
                    {
                        id: 'singleLinePicker',
                        container: 'body',
                        defaultValue: [0],
                        onChange: function(result) {},
                        onConfirm: function(result) {
                            if (!result[0]) {
                                reject(result);
                            } else {
                                resolve({
                                    areaCode: result[0].value,
                                    prefix: result[0].label
                                });
                            }
                        }
                    }
                );
            });
        }
    }
};
