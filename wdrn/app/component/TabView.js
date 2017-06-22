'use strict';
import React , {Component} from 'react';
import {
    Text,
    Dimensions,
    StyleSheet,
    Animated,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import px2dp from '../util/px2dp';

let {width,height}=Dimensions.get('window');

import HomePage from '../pages/Home';
import Discover from '../pages/Discover';
import Order from '../pages/Order';
import My from '../pages/My';

export default class TabView extends Component{
    constructor(props){
        super(props);
        this.state={
            currentTab:'HomePage',
            hideTabBar:false
        }
        this.tabNames=[
            ['消费返利','logo-yen','HomePage',<HomePage {...this.props}/>],
            // ['发现','ios-compass-outline','Discover',<Discover {...this.props}/>],
            ['钱包','md-browsers','Order',<Order {...this.props} />],
            ['个人中心','ios-contact-outline','My',<My {...this.props} />]
        ]
        TabView.hideTabBar=TabView.hideTabBar.bind(this);
        TabView.showTabBar=TabView.showTabBar.bind(this);
    }

    static showTabBar(){
        this.setState({hideTabBar:false});
    }
    static hideTabBar(){
        this.setState({hideTabBar:true});
    }

    render(){
        return (
            <TabNavigator
                hideTabTouch={true}
                tabBarStyle={
                    [
                        styles.tabbar,
                        (this.state.hideTabBar?styles.hide:{})
                    ]
                }
                sceneStyle={{paddingBottom:styles.tabbar.height}}
            >
            {
                this.tabNames.map((item,i)=>{
                    return (
                        <TabNavigator.Item
                            key={i}
                            tabStyle={styles.tabStyle}
                            title={item[0]}
                            selected={this.state.currentTab===item[2]}
                            selectedTitleStyle={{color:'#3496f0'}}
                            renderIcon={()=><Icon name={item[1]} size={px2dp(18)} color="#666" />}
                            renderSelectedIcon={()=><Icon name={item[1].replace(/\-outline$/,'')} size={px2dp(18)} color="#3496f0" />}
                            onPress={()=>this.setState({currentTab:item[2]})}
                        >
                            {item[3]}
                        </TabNavigator.Item>
                    )
                })
            }
            </TabNavigator>
        )
    }

}

const styles=StyleSheet.create({
    tabbar:{
        height:px2dp(48),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    hide:{
        transform:[{translateX:width}]
    },
    tabStyle:{
        padding:px2dp(4)
    }

})

