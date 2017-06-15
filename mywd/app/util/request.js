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
    console.log(url)
    return fetch(url,options)
            .then((response)=>response.json())
}

request.post=async (url,body)=>{

    let token=await storage.load({
        key:'token',
        autoSync: false,
    })
    .catch(err=>{
        console.log(err);
    })
    let headers=_.assign({
        'Accept':'application/json',
        'Content-Type':'application/json'
    },{token:token||''});

    let options={
        body:JSON.stringify(body),
        method:'POST',
    };

    _.assign(options,{
        headers:headers
    })
    console.log(options)

    return fetch(url,options)
            .then((response)=>response.json())
}

export default request;
