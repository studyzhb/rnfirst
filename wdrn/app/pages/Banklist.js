'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    AlertIOS,
    Alert,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';

import NavBar from '../component/NavBar';
import Item from '../component/Item';
import Setting from './Setting';

import AddBank from './AddBank';
import RealName from './RealName';
import px2dp from '../util/px2dp';
import request from '../util/request';
import config from '../util/config';
import Icon from 'react-native-vector-icons/Ionicons';



let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';


export default class Banklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLogin: false,
            banklist: []
        }

        this.config = [
            { name: "添加银行卡", onPress: this.confirmPay.bind(this, "address") }
        ]
    }



    confirmPay(txt) {

        if (this.state.isrealname) {
            this.goPage.bind(this, 'addBank')();
        } else {
            let info = '为了您的资金安全，只能绑定当前实名认证人的银行卡，请您前往补充实名认证信息';
            isIOS
                ? AlertIOS.alert(
                    '添加银行卡说明',
                    info,
                    [
                        { text: '再等等', onPress: () => console.log('Ask me later pressed') },
                        { text: '去实名认证', onPress: this.goPage.bind(this, txt), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
                : Alert.alert(
                    '添加银行卡说明',
                    info,
                    [
                        { text: '再等等', onPress: () => console.log('Ask me later pressed') },
                        { text: '去实名认证', onPress: this.goPage.bind(this, txt), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
        }

    }



    goPage(key, data = {}) {

        let self = this;
        let pages = {
            "address": RealName,
            'addBank': AddBank
        }

        if (pages[key]) {

            this.props.navigator.push({
                component: pages[key],
                args: { data },
                params: {
                    getUser(user) {
                        self.setState({
                            isrealname: user.isrealname
                        })
                    },
                    updateBank(){
                        self._onRefresh()
                    }
                }
            })
        }
    }
    leftPress() {
        let {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    rightPress() {
        this.props.navigator.push({
            component: Setting,
            args: {}
        });
    }
    goProfile() {
        // this.props.navigator.push({
        //     component: UserProfile,
        //     args: {}
        // });
    }

    shouldComponentUpdate() {

        // this._onRefresh()
        return true;
    }

    componentDidMount() {
        this._onRefresh()
    }
    _onRefresh() {
        this.setState({ isRefreshing: true, isrealname: this.props.isrealname, ispay: this.props.ispay });
        let body = {
            
        }

        let loginUrl = config.baseUrl + config.api.user.userBanklist;

        request.get(loginUrl)
            .then((data) => {
                
                if (data.code == 1) {
                    this.setState({
                        banklist: data.data,
                        isRefreshing: false
                    })
                }
                else if (data.code == 2 || data.code == 3) {
                        let { navigator } = this.props;
                        
                        storage.remove({
                            key: 'loginUser'
                        });
                        storage.remove({
                            key: 'user'
                        });
                        storage.remove({
                            key: 'token'
                        });

                        if (navigator) {
                            navigator.popToTop();
                        }

                    }
                 else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch((err) => {
                console.warn(err)

            })
        // setTimeout(() => {
        //     this.setState({ isRefreshing: false });
        // }, 1500)
    }
    _renderListItem() {
        return this.config.map((item, i) => {
            if (i % 3 == 0) {
                item.first = true
            }
            return (<Item key={i} {...item} />)
        })
    }

    deleteBank(id){
        let info = '点击确定删除银行卡';
            isIOS
                ? AlertIOS.alert(
                    '提示',
                    info,
                    [
                        { text: '再等等', onPress: () => console.log('Ask me later pressed') },
                        { text: '确定删除', onPress: this.confirmDelete.bind(this, id), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
                : Alert.alert(
                    '提示',
                    info,
                    [
                        { text: '再等等', onPress: () => console.log('Ask me later pressed') },
                        { text: '确定删除', onPress: this.confirmDelete.bind(this, id), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
        
        
    }

    confirmDelete(id){
        let url=config.baseUrl+config.api.user.deleteBank;
        request.post(url,{id:id})
            .then(data=>{
                
                if(data.code==1){
                    this._onRefresh();
                }
                else if (data.code == 2 || data.code == 3) {
                        let { navigator } = this.props;
                        
                        storage.remove({
                            key: 'loginUser'
                        });
                        storage.remove({
                            key: 'user'
                        });
                        storage.remove({
                            key: 'token'
                        });

                        if (navigator) {
                            navigator.popToTop();
                        }

                    }
                else{
                    isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                }
            })
            .catch(err=>{
                console.log(err)
            })
    }

    _renderBanklist() {
        return this.state.banklist.length>0?this.state.banklist.map((item, key) => {
            return (
                <TouchableOpacity key={key} onLongPress={this.deleteBank.bind(this,item.id)}>
                <View style={{ marginTop: 12, height: 104, width: 360, paddingLeft: 15, paddingRight: 19, borderRadius: 4, paddingTop: 12, backgroundColor: '#c64f55', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../images/index01.png')} style={{ width: 40, height: 40, marginRight: 8 }} />
                        <View>
                            <Text style={styles.baseText}>{item.card_tip}</Text>
                            <Text style={styles.baseText}>储蓄卡</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={styles.baseText}>
                            {/**** *** *** 1041*/}
                            {item.card_num}
                                </Text>
                    </View>

                </View>
                </TouchableOpacity>
            )
        }):null
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
                <NavBar
                    title='银行卡'
                    titleStyle={{ color: '#666' }}
                    leftIcon='ios-arrow-back-outline'
                    leftPress={this.leftPress.bind(this)}
                    style={{ backgroundColor: '#fff' }}
                    rightPress={this.rightPress.bind(this)}
                />


                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
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
                    <View style={{ paddingBottom: 100 }}>
                        {
                            this._renderBanklist()
                        }
                        <View>
                            {this._renderListItem()}
                        </View>
                    </View>
                </ScrollView>

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
    baseText: {
        fontSize: 14,
        color: '#fff'
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    }
})


