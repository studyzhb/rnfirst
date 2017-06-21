'use strict';
import React,{Component} from 'react';
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

import px2dp from '../util/px2dp';

let {width,height} = Dimensions.get('window');

export default class RecordItem extends Component{
    constructor(props){
        super(props)
    }

    render(){
        
        let {note,image,updated_at,money}=this.props;
        return (
            <TouchableHighlight style={styles.container}>
                
                <View  style={{flexDirection:'row'}}>
                    <Image />
                    <View style={[styles.item,styles.itemtop]}>
                        <Text style={{color:'#666',fontSize:14}}>{note}</Text>
                        <Text style={{color:'#999',fontSize:12,marginTop:5}}>{updated_at}</Text>
                    </View>
                    {/*<View style={[styles.item,styles.itembottom]}>
                        <Text style={{color:'#3a3a3a',fontSize:14}}>{money}</Text>
                    </View>*/}
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:px2dp(72),
        paddingLeft:px2dp(17),
        paddingTop:px2dp(18),
        paddingRight:px2dp(24),
        paddingBottom:px2dp(15),
        borderBottomColor:'#eaeaea',
        borderBottomWidth:1,
        backgroundColor:'#fff'
    },
    item:{
        justifyContent:'space-between',
        
    },
    itembottom:{
        flex:1,
        
    },
    itemtop:{
        flex:2,
        
    }
})