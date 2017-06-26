'use strict'

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';

import PercentageCircle from '../component/percent-circle';

const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');

export default class Circle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    rightPress() {


    }

    componentDidMount() {
        console.log('1111')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Use React Native Percentage Circle
        </Text>
                <View style={styles.row}>
                    <View style={styles.item}>
                        <PercentageCircle radius={35} percent={0} color={"#3498db"}></PercentageCircle>
                        <Text style={[styles.percentText]}> 0% </Text>
                    </View>
                    <View style={styles.item}>
                        <PercentageCircle radius={35} percent={30} color={"#f39c12"}>
                            <Text style={styles.checkin}>30</Text>
                            <Text style={styles.desc}>人已签到</Text>
                        </PercentageCircle>
                        <Text style={[styles.percentText]}> 30% </Text>
                    </View>
                    <View style={styles.item}>
                        <PercentageCircle radius={35} bgcolor="#fff" percent={45} color={"#2ecc71"}></PercentageCircle>
                        <Text style={[styles.percentText]}> 45% </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.item]}>
                        <PercentageCircle radius={60} bgcolor="#fff" borderWidth={4} percent={90} color={"#34495e"}>
                            <View style={{ marginLeft: 30, alignItems: 'center', flexDirection: 'row' }}>
                                <Image style={{ width: 25, height: 25 }} source={require('../images/goods.png')} />
                                <Text style={{ flex: 1, fontSize: 13 }}>步数</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 23, color: '#34495e' }}>20000</Text>
                            </View>
                        </PercentageCircle>
                        <Text style={[styles.percentText]}> 90% </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.item}>
                        <PercentageCircle radius={60} percent={this.state.percent} color={"#9b59b6"}></PercentageCircle>
                        <Text style={[styles.percentText]}> {this.state.percent} %</Text>
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 66,
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    row: {
        //height:0,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 40,
    },
    item: {
        flex: .33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 15,
        paddingTop: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    checkin: {
        fontSize: 20,
        color: '#f39c12',
    },
    desc: {
        fontSize: 12,
        color: '#999',
    },

});
