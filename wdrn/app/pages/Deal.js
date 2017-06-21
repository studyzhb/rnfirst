'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    ListView,
    Dimensions,
    Platform,
    AlertIOS,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl,
    DatePickerIOS,
    TimePickerAndroid,
    DatePickerAndroid,
    Picker,
    PickerIOS
} from 'react-native';

import NavBar from '../component/NavBar';
import Item from '../component/recordItem';
import Setting from './Setting';
// import UserProfile from './UserProfile';
import Address from './Address';
import px2dp from '../util/px2dp';

import Icon from 'react-native-vector-icons/Ionicons';

import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

let selectedDate=null;

let isIOS = Platform.OS === 'ios';

class CustomButton extends Component {
    render() {
        return (
            <TouchableHighlight
                style={styles.button}
                underlayColor="#a5a5a5"
                onPress={this.props.onPress}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
}

export default class Deal extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            showDatePicker: false,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([]),
            isLogin: false,
            config: [],
            date: new Date(),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
            presetDate: new Date(2016, 3, 5),
            allDate: new Date(2020, 4, 5),
            simpleText: '选择日期,默认今天',
            minText: '选择日期,不能比今日再早',
            maxText: '选择日期,不能比今日再晚',
            presetText: '选择日期,指定2016/3/5',
        }

        this.config = [
            { icon: "ios-pin", name: "钱包充值", time: '1月10日 19:20', money: '+500' },
            { icon: "ios-bulb-outline", name: "支付宝充值", color: "#fc7b53" },
            { icon: "ios-information-circle-outline", name: "分享佣金充值", subName: "分润奖励金", color: "#fc7b53" },
            // {icon:"md-flower", name:"服务中心"},
        ]
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    rightPress() {
        isIOS
            ? this.setState({
                showDatePicker: !this.state.showDatePicker
            })
            : this._openAndroidTime.bind(this)()
    }
    goProfile() {
        // this.props.navigator.push({
        //     component: UserProfile,
        //     args: {}
        // });
    }
    componentDidMount() {
        this._fetchData(1);
    }
    // _fetchData(page, body) {

    //     this.setState({ isRefreshing: true });
    //     let getIndexUrl = config.baseUrl + config.api.user.showDealList;
    //     let obj = {};
    //     if (body) {
    //         obj = body
    //     }
    //     request.get(getIndexUrl, obj)
    //         .then((data) => {
    //             console.log(data)
    //             if (data.code == 1) {
    //                 this.setState({
    //                     isRefreshing: false,
    //                     config: data.data.data
    //                 })
    //             } else {
    //                 isIOS
    //                     ? AlertIOS.alert(data.message)
    //                     : Alert.alert(data.message)
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })

    // }
    _renderListItem() {

        let items = this.state.config.map((item, i) => {
            //   if(i%3==0){
            //     item.first = true
            //   }
            return (<Item key={i} {...item} />)
        })

        return items;
    }

    onDateChange(date) {
        this.setState({ date: date });
    }

    async _fetchData(page) {

        let that = this;
        let self = this;
        let obj = {
            
        }
        if(selectedDate){
            obj=selectedDate
        }
        if (page == 1) {
            obj.page = page;
            cachedResults = {
                nextPage: 1,
                items: [],
                total: 0
            }
            this.setState({
                isRefreshing: true
            })
        }
        else if (page !== 0) {
            obj.page = page;
            this.setState({
                isLoadingTail: true
            })
        }
        else {
            obj.page = 1;
            cachedResults = {
                nextPage: 1,
                items: [],
                total: 0
            }
            this.setState({
                isRefreshing: true
            })
        }

        let getIndexUrl = config.baseUrl + config.api.user.showDealList;


        await request.get(getIndexUrl, obj)
            .then((data) => {
                if (data.code == 1 && data.data) {

                    let list = data.data.data || [];

                    if (list.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(list)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = list.concat(items)
                        }

                        cachedResults.items = items
                        cachedResults.total = data.data.total
                        if (page == 1) {
                            self.setState({
                                isRefreshing: false,
                                dataSource: self.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else if (page !== 0) {
                            that.setState({
                                isLoadingTail: false,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else {
                            that.setState({
                                isRefreshing: false,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                    } else {
                        cachedResults = {
                            nextPage: 1,
                            items: [],
                            total: 0
                        }

                        this.setState({
                            dataSource: that.state.dataSource.cloneWithRows([]),
                            isRefreshing: false
                        })
                        cachedResults.total = data.data.total

                        if (page > 1) {
                            this._fetchData(1);
                        }
                    }

                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch(err => {
                if (page !== 0) {
                    this.setState({
                        isLoadingTail: false
                    })
                }
                else {
                    this.setState({
                        isRefreshing: false
                    })
                }
            })

    }

    _hasMore() {
        return cachedResults.items.length !== cachedResults.total;
    }

    _fetchMoreData() {
        if (!this._hasMore() || this.state.isLoadingTail) {

            this.setState({
                isLoadingTail: false
            })

            return
        }

        let page = cachedResults.nextPage

        this._fetchData(page)
    }

    _onRefresh() {

        if (!this._hasMore() || this.state.isRefreshing) {
            return
        }
        this._fetchData(0)
    }

    _renderFooter() {
        if (!this._hasMore() && cachedResults.total !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            )
        }

        if (!this.state.isLoadingTail) {
            return <View style={styles.loadingMore} />
        }

        return <ActivityIndicator style={styles.loadingMore} />
    }

    async _getIndexInfo() {
        this._fetchData(1);
    }

    _renderRow(item) {

        return (<Item {...item} />)
    }

    async _openAndroidTime() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                // 下面显示的会是2020年5月25日。月份是从0开始算的。
                date: new Date(2017, 4, 25)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                
                selectedDate={ year: year, month: month+1 };
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                this._fetchData.bind(this,1, { year: year, month: month })()
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }

    //进行创建时间日期选择器
    async showPicker(stateKey, options) {
        try {
            var newState = {};
            const { action, year, month, day } = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
                newState[stateKey + 'Text'] = 'dismissed';
            } else {
                var date = new Date(year, month, day);
                newState[stateKey + 'Text'] = date.toLocaleDateString();
                newState[stateKey + 'Date'] = date;
            }
            this.setState(newState);
        } catch ({ code, message }) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    }

    _closeAndroidTime() {

    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                    <NavBar
                        title='交易记录'
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        style={{ backgroundColor: '#fff' }}
                        rightIcon='ios-calendar-outline'
                        rightPress={this.rightPress.bind(this)}
                    />
                    <ListView
                            style={{ flex: 1, paddingBottom: 100, backgroundColor: '#f3f3f3' }}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}
                            renderFooter={this._renderFooter.bind(this)}
                            onEndReached={this._fetchMoreData.bind(this)}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor='#ff6600'
                                    title='拼命加载中'
                                />
                            }
                            pageSize={2}
                            onEndReachedThreshold={20}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
                            automaticallyAdjustContentInsets={false}
                            removeClippedSubviews={false}
                        />
                    {/*<ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor="#fff"
                                colors={['#ddd', '#0398ff']}
                                progressBackgroundColor='#ffffff'
                            />
                        }
                    >

                        <View style={{ minHeight: height - 64 - px2dp(46), paddingBottom: 100, backgroundColor: '#fff' }}>
                            <View>
                                {this._renderListItem()}
                            </View>
                        </View>
                    </ScrollView>*/}
                </View>
                <View>
                    {
                        this.state.showDatePicker
                            ? isIOS
                                ? <DatePickerIOS
                                    data={this.state.date}
                                    mode="datetime"
                                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                                    onDateChange={this.onDateChange.bind(this)}
                                    minuteInterval={10}
                                />
                                : null
                            : null
                    }
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginBottom: px2dp(46),
        backgroundColor: "#f0f0f0"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        marginBottom: 12,
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 74
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        margin: 5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
})


