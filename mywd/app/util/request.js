'use strict'
/**
 * 请求
 */

import queryString from 'qs';
import _ from 'lodash';
import config from './config';

let request={};

request.get=async (url,params)=>{
    let token=await storage.load({
        key:'token'
    })
    console.log(token)
    if(params){
        url+='?'+queryString.stringify(params)
    }
    let options={
        method:'GET',
        headers:{
            token:token
        }
        
    }
    console.log(options)
    return fetch(url,options)
            .then((response)=>response.json())
}

request.post=(url,body)=>{
    
    let options=_.assign(config.header,{
        body:JSON.stringify(body)
    });

    return fetch(url,options)
            .then((response)=>response.json())
}

export default request;
