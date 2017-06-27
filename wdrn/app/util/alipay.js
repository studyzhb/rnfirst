/**
 * @desc 三方支付
 * @author Jafeney
 * @detetime 2016-11-08
 **/

import Alipay from 'react-native-yunpeng-alipay'
import config from './config'
import request from './request'

export default function alipay(opt) {
  console.log(opt)
  return (dispatch) => {
    const uri =config.baseUrl + config.api.pay.alipay;  /*支付接口*/
    let body=opt;
    /*调用支付接口*/
    request.post(uri,body)
        .then((response) => {
          console.log(response);
        if (response.status === 200) {
          return response.json()
        } else {
          return {code: response.status}
        }
      })

    // fetch(uri, {method: 'POST', headers: headers, body: JSON.stringify(opt.body)})
    //   .then((response) => {
    //     if (response.status === 200) {
    //       return response.json()
    //     } else {
    //       return {code: response.status}
    //     }
    //   })
      .then((data) => {
          console.log(data);
        if (String(data.code) == '0') {
          /*打开支付宝进行支付*/
          Alipay.pay(data.result).then((data) => {
              console.log(data);
            if (data.length && data[0].resultStatus) {
              /*处理支付结果*/
            //   switch (data[0].resultStatus) {
            //      case "9000":
            //        opt.success && opt.success(data)
            //        break;
            //      case "8000":
            //        opt.fail && opt.fail('支付结果未知,请查询订单状态')
            //        break;
            //      case "4000":
            //        opt.fail && opt.fail('订单支付失败')
            //        break;
            //      case "5000":
            //        opt.fail && opt.fail('重复请求')
            //        break;
            //      case "6001":
            //        opt.fail && opt.fail('用户中途取消')
            //        break;
            //      case "6002":
            //        opt.fail && opt.fail('网络连接出错')
            //        break;
            //      case "6004":
            //        opt.fail && opt.fail('支付结果未知,请查询订单状态')
            //        break;
            //      default:
            //        opt.fail && opt.fail('其他失败原因')
            //        break;
            //    }
             } else {
               opt.fail && opt.fail('其他失败原因')
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