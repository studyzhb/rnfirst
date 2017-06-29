/**
 * @desc 三方支付
 * @author Jafeney
 * @detetime 2016-11-08
 **/

import { pay } from 'react-native-alipay'
import config from './config'
import request from './request'
import {Alert} from 'react-native';
export default function alipay(opt) {
  console.log(opt)
  return (dispatch) => {
    const uri = config.baseUrl + config.api.pay.alipay;  /*支付接口*/
    let body = opt.data;
    /*调用支付接口*/
    request.post(uri, body)
      // .then((response) => {
      //   console.log(response);
      //   if (response.code == 1) {
      //     return 
      //   } else {
      //     return { code: response.code }
      //   }
      // })

      // fetch(uri, {method: 'POST', headers: headers, body: JSON.stringify(opt.body)})
      //   .then((response) => {
      //     if (response.status === 200) {
      //       return response.json()
      //     } else {
      //       return {code: response.status}
      //     }
      //   })
      .then((res) => {
        console.log(res);
        Alert.alert(res.code+'');
        if (res.code == 1) {
          /*打开支付宝进行支付*/
          console.log(res.data.sign)
          Alert.alert(res.data.sign+'111');
          pay(res.data.sign, true).then((data) => {
            console.log(data);
            if (data.resultStatus === '9000') {
              Alert.alert('提示', '支付成功');
            } else if (data.resultStatus === '8000') {
              Alert.alert('提示', '支付结果确认中,请稍后查看您的账户确认支付结果');
            } else if (data.resultStatus !== '6001') {
              // 如果用户不是主动取消
              Alert.alert('提示', '支付失败');
            }
          }, (err) => {
            opt.fail && opt.fail('支付失败，请重新支付')
          }
          )
        } else {
          opt.error && opt.error('支付参数错误')
        }
      })
  }
}