'use strict';

var rp = require('request-promise');
var objectAssign = require('object-assign');
var fs = require('fs');

var cacheManager = require('cache-manager');

var fsStore = require('cache-manager-fs');

var memoryCache = cacheManager.caching({
    store: 'memory',
    max: 100,
    ttl: 7140,
    promiseDependency: Promise
});

var diskCache = cacheManager.caching({
    store: fsStore,
    options: {
        ttl: 7140,
        maxsize: 1000*1000*1000,
        path:'cache',
        preventfill:true
    },
    promiseDependency: Promise
});

var errors = require('./lib/errors.js');

var libs = require('./lib');

/*
src/common/config/workwechat.js
workwechat: {
    token: 'xxxxxxxxxxxxxxx',
    corpid: 'wxe1234567890abcde',
    appsecret: '1234567890abcdefghijklmnopqrstuv',
    encodingAESKey: '1234567890abcdefghijklmnopqrstuvxyz12345678',
    AESKey: '1PVNV80z24KmCm2U',
    iv: '1572033555800355',
    pathname: 'api'
}
*/

var workwechat = function(options) {
    this.options = objectAssign({
        pathname: 'workwechat'
    }, options);
    this.token = this.options.token;
    this.corpid = this.options.corpid;
    this.appsecret = this.options.appsecret;
    this.encodingAESKey = this.options.encodingAESKey;

    this.access_token = {
        "access_token": null,
        "expires_on": 0
    };

    this.jsapi_ticket = {
        "ticket": null,
        "expires_on": 0
    };

    this.cache = {
        get: async function(key) {
            let mem = await memoryCache.get(key);
            let disk = await diskCache.get(key);
            return mem || disk;
        },
        set: async function(key, val) {
            memoryCache.set(key, val);
            diskCache.set(key, val);
        }
    }

    //this.api_limit = api_limit;
    for(let name in libs) {
        this[name]();
    }
};

workwechat.prototype = {
    jsonpf: function(json) {
        return JSON.parse(JSON.stringify(json));
    },

    timestamp: function(delay) {
        delay = Number(delay) || 0;
        return new Date().getTime() + delay*1000;
    },

    aesEncrypt: function(data, secretKey, iv, mode) {
        secretKey = secretKey || this.options.AESKey;
        mode = mode || 'aes-128-cbc';
        iv = iv || this.options.iv;
        var encipher = crypto.createCipheriv(mode, secretKey, iv),
        encoded  = encipher.update(data, 'utf8', 'hex');
        encoded += encipher.final('hex');
        return encoded;
    },

    handleError: function(errcode, onlymsg){
        let errorConfig = think.parseConfig({
            "key":"errcode",
            "msg":"errmsg"
        }, think.config('error'));
        var result = {
        };
        result[errorConfig.key] = (errors[errcode] && errcode) || 0;
        result[errorConfig.msg] = errors[errcode] || "";
        if(onlymsg) {
            return result[errorConfig.msg];
        }
        return result;
    },

    /**
     * get request
     * @return {Promise} []
     */
    get: async function(path, content, method = 'GET', refresh = false){
        let _self = this;
        path = path.replace('CORPID', _self.corpid).replace('APPSECRET', _self.appsecret);
        content = content || '';
        let options = {
            url: 'https://qyapi.weixin.qq.com' + path,
            method: method,
            agent:false,
            rejectUnauthorized : false,
            body: content,
            json: true
        };
        var opt = options;
        //var api_name = path.replace('/cgi-bin/', '').replace(/\?.*/, '').split('/').join('_');
        if(/ACCESS_TOKEN/.test(opt.url)) {
            let token = await _self.accessToken(refresh);
            if(token.access_token) {
                opt.url = opt.url.replace('ACCESS_TOKEN', token.access_token);
            } else {
                return token;
            }
        }
        var data = await rp(opt);

        if(data && data.errcode == 40001) {
            return _self.get(path, content, method, true);
        }

        if(data && data.errcode) {
            return _self.handleError(data.errcode);
        }

        return data;
    },
    /**
     * post request
     * @return {Promise} []
     */
    post: async function(path, content) {
        return this.get(path, content, 'POST');
    },
    /**
     * get access_token
     * @return {String} []
     */
    accessToken: async function(refresh){
        let token = 
        (!refresh && ((this.access_token.expires_on > this.timestamp()) && this.access_token))
        || (!refresh && await this.cache.get('access_token'))
        || await this.get('/cgi-bin/gettoken?corpid=CORPID&corpsecret=APPSECRET')
        ;
        if(token.access_token) {
            if(token.expires_in) {
                token.expires_in = 0;
                token.expires_on = this.timestamp(7140);
                this.cache.set('access_token', token);
            }
            this.access_token = token;
        }
        return token;
    }
};

for(let name in libs) {
    workwechat.prototype[name] = libs[name];
}

module.exports = workwechat;