'use strict'
/**
 * 请求
 */
var queryString=require('query-string');
var _=require('lodash');
var config=require('./config');

var request={};

request.get=(url,params)=>{
    if(params){
        url+='?'+queryString.stringify(params)
    }

    return fetch(url)
            .then((response)=>response.json())
}

request.post=(url,body)=>{
    let options=_.extend(config.header,{
        body:JSON.stringify(body)
    });
    return fetch(url,options)
            .then((response)=>response.json())
}

export default request;
