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
    .catch(err=>{
        console.log(err)
    })
    console.log(token)
    if(params){
        url+='?'+queryString.stringify(params)
    }

    let options={
        method:'GET',
        headers:{
            token:token||''
        }
        
    }
    console.log(url)
    return fetch(url,options)
            .then((response)=>response.json())
            .catch(err=>{
                console.warn(err)
            })
}

request.post=async (url,body,option)=>{

    let token=await storage.load({
        key:'token',
        autoSync: false,
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(token)

    let headers=_.assign({
        'Accept':'application/json',
        'Content-Type':'multipart/form-data',
    },{token:token||''},option&&option.headers?option.headers:{});

    let formData=new FormData();

    for(let key in body){
        formData.append(key,body[key]);
    }

    let options={
        body:formData,
        method:'POST',
    };



    _.assign(options,{
        headers:headers
    })

    if(option&&option.body){
        _.assign(options,{body:option.body})
    }

    console.log(options)
    console.log(url)
    return fetch(url,options)
            .then((response)=>response.json())
            .catch(err=>{
                console.warn(err)
            })
}

export default request;
