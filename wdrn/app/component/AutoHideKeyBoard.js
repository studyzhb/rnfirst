
import dismissKeyboard from 'dismissKeyboard';
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
export default (WrappedComponent) => class AutoHideKeyboard extends Component {
    render() {
        return (
            <TouchableWithoutFeedback style={{flex:1}} onPress={dismissKeyboard}>
                <View style={{flex:1}}>
                    <WrappedComponent {...this.props}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}