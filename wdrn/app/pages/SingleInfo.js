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
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';

import NavBar from '../component/NavBar';
import Button from 'react-native-button';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';

import config from '../util/config';
import request from '../util/request';

import Author from './authorize';

let { width, height } = Dimensions.get('window');

export default class SingleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentInfo: null
        }
    }

    componentDidMount() {
        let url = config.baseUrl + config.api.rebate.list;
        request.get(url)
            .then(data => {
                console.log(data)
                if (data.code == 1 && data.data) {
                    this.setState({
                        currentInfo: data.data
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

                }


            })
            .catch(err => {
                console.warn(err)
            })
    }

    gotoAuthor() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'author',
                component: Author
            })
        }
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='债权资料'
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    {
                        this.state.currentInfo
                            ? <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>

                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>债权人姓名：</Text>
                                    <Text style={{ color: '#333', fontSize: 14 }}>{this.state.currentInfo.rebate_name}</Text>

                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>联系方式：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.revate_tel}</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>债权编号：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.coding}</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>返利金额：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.money}</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>备注：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.note}</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>申请时间：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.created_at}</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.baseText}>认证通过日期：</Text>
                                    <Text style={{ color: "#333", fontSize: 14 }}>{this.state.currentInfo.updated_at}</Text>
                                </View>
                            </View>
                            : null
                    }

                </View>
                {
                    !this.state.currentInfo
                        ? <Button
                            onPress={this.gotoAuthor.bind(this)}
                            containerStyle={{ padding: 10, height: 45, overflow: 'hidden', backgroundColor: '#21bb58' }}
                            style={styles.nowbuybtn}>
                            添加新的债权
                        </Button>
                        : null
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        // position:'relative'
    },
    flexRow: {
        flexDirection: 'row',
        marginBottom: 9
    },
    baseText: {
        color: '#999',
        fontSize: 12
    },
    nowbuybtn: {
        fontSize: 14, color: '#fff'
    }
})