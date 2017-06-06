export default {
    header:{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    },
    baseUrl:'http://wll.china87.cn/api/',
    api:{
        user:{
            login:'/user/login',
            register:'/user/reg',
            //发送验证码
            sendmessage:'/send/sms',
            
        }
    }

}