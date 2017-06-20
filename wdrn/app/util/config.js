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
            //用户个人中心信息
            userinfo:'/user/center',
            //设置个人信息
            updateUserInfo:'/user/set_info',
            updatePay:'/user/editpaypwd',
            //余额展示
            showBalance:'/userbalance/showbalance',
            //交易记录展示
            showDealList:'/balancelog/show',
            //实名认证
            realNameAuthor:'/userbalance/saverealname',
            //转余额
            tabMoney:'/userbalance/editbalance',
            //用户银行卡信息
            userBanklist:'/usercard/show',
            //展示银行卡信息
            showBanklist:'/usercard/baseshow',
            addBank:'/usercard/create',
            //用户更改密码
            changePass:'/user/update_pwd',
            //用户上传头像 type avatar
            uploadImage:'/image',
            //用户状态
            userStatus:'/user/status',
            //余额提现\
            useroutput:'/userbalance/withdraw',
            //我的推广
            popular:'/user/promotion',
            //我的二维码
            mycode:'/user/myurl'
        },
        //返利模块
        rebate:{
            //返利资料
            list:'/rebate/current',
            //历史返利
            his:'/rebate/history',
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
            //兑换回购记录列表
            getBackOrConverce:'/creditor/apply_list',
            //创建订单
            createOrder:'/order/create',
            //兑换积分
            converse:'/creditor/exchange',
            //申请回购与提货
            applyBackOrPick:'/creditor/apply'
        },
        pay:{
            balance:'/defray/balance',
            alipay:"/pay/getsign"
        }
    }

}