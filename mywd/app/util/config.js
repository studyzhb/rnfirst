export default {
    header:{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    },
    baseUrl:'http://wll.china87.cn/api',
    api:{
        user:{
            login:'/user/login',
            register:'/user/reg',
            //发送验证码
            sendmessage:'/send/sms',
            
        },
        //返利模块
        rebate:{
            list:'/rebate/current',
            index:'/creditor/index',
            applyInfo:'/rebate/regis',
            //查看历史(申请中请求此接口查看)
            lookupHis:'/rebate/show',
            //获取队列列表信息
            getQueueInfoByQueueId:'/creditor/queque_list',
            //获取队列订单详情
            getDetailByQueueId:'/creditor/detail',
            getGoodsList:'/goods/list',
            //获取订单列表
            getHisOrder:'/order/list',
            //创建订单
            createOrder:'/order/create'
        }
    }

}