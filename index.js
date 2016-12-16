'use strict';var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var rp = require('request-promise');
var objectAssign = require('object-assign');

var cacheManager = require('cache-manager');

var fsStore = require('cache-manager-fs');

var memoryCache = cacheManager.caching({
    store: 'memory',
    max: 100,
    ttl: 7140,
    promiseDependency: _promise2.default });


var diskCache = cacheManager.caching({
    store: fsStore,
    options: {
        ttl: 7140,
        maxsize: 1000 * 1000 * 1000,
        path: 'cache',
        preventfill: true },

    promiseDependency: _promise2.default });


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

var workwechat = function workwechat(options) {
    this.options = objectAssign({
        pathname: 'workwechat' },
    options);
    this.token = this.options.token;
    this.corpid = this.options.corpid;
    this.appsecret = this.options.appsecret;
    this.encodingAESKey = this.options.encodingAESKey;

    this.access_token = {
        "access_token": null,
        "expires_on": 0 };


    this.jsapi_ticket = {
        "ticket": null,
        "expires_on": 0 };


    this.cache = {
        get: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(key) {var mem, disk;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                                    memoryCache.get(key));case 2:mem = _context.sent;_context.next = 5;return (
                                    diskCache.get(key));case 5:disk = _context.sent;return _context.abrupt('return',
                                mem || disk);case 7:case 'end':return _context.stop();}}}, _callee, this);}));function get(_x) {return _ref.apply(this, arguments);}return get;}(),

        set: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(key, val) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                memoryCache.set(key, val);
                                diskCache.set(key, val);case 2:case 'end':return _context2.stop();}}}, _callee2, this);}));function set(_x2, _x3) {return _ref2.apply(this, arguments);}return set;}() };



    //this.api_limit = api_limit;
    for (var name in libs) {
        this[name]();
    }
};

workwechat.prototype = {
    jsonpf: function jsonpf(json) {
        return JSON.parse((0, _stringify2.default)(json));
    },

    timestamp: function timestamp(delay) {
        delay = Number(delay) || 0;
        return new Date().getTime() + delay * 1000;
    },

    aesEncrypt: function aesEncrypt(data, secretKey, iv, mode) {
        secretKey = secretKey || this.options.AESKey;
        mode = mode || 'aes-128-cbc';
        iv = iv || this.options.iv;
        var encipher = crypto.createCipheriv(mode, secretKey, iv),
        encoded = encipher.update(data, 'utf8', 'hex');
        encoded += encipher.final('hex');
        return encoded;
    },

    handleError: function handleError(errcode, onlymsg) {
        var errorConfig = think.parseConfig({
            "key": "errcode",
            "msg": "errmsg" },
        think.config('error'));
        var result = {};

        result[errorConfig.key] = errors[errcode] && errcode || 0;
        result[errorConfig.msg] = errors[errcode] || "";
        if (onlymsg) {
            return result[errorConfig.msg];
        }
        return result;
    },

    /**
        * get request
        * @return {Promise} []
        */
    get: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(path, content) {var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';var refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;var _self, options, opt, token, data;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                            _self = this;
                            path = path.replace('CORPID', _self.corpid).replace('APPSECRET', _self.appsecret);
                            content = content || '';
                            options = {
                                url: 'https://qyapi.weixin.qq.com' + path,
                                method: method,
                                agent: false,
                                rejectUnauthorized: false,
                                body: content,
                                json: true };

                            opt = options;
                            //var api_name = path.replace('/cgi-bin/', '').replace(/\?.*/, '').split('/').join('_');
                            if (!/ACCESS_TOKEN/.test(opt.url)) {_context3.next = 14;break;}_context3.next = 8;return (
                                _self.accessToken(refresh));case 8:token = _context3.sent;if (!
                            token.access_token) {_context3.next = 13;break;}
                            opt.url = opt.url.replace('ACCESS_TOKEN', token.access_token);_context3.next = 14;break;case 13:return _context3.abrupt('return',

                            token);case 14:_context3.next = 16;return (


                                rp(opt));case 16:data = _context3.sent;if (!(

                            data && data.errcode == 40001)) {_context3.next = 19;break;}return _context3.abrupt('return',
                            _self.get(path, content, method, true));case 19:if (!(


                            data && data.errcode)) {_context3.next = 21;break;}return _context3.abrupt('return',
                            _self.handleError(data.errcode));case 21:return _context3.abrupt('return',


                            data);case 22:case 'end':return _context3.stop();}}}, _callee3, this);}));function get(_x4, _x5, _x6, _x7) {return _ref3.apply(this, arguments);}return get;}(),

    /**
                                                                                                                                                                                              * post request
                                                                                                                                                                                              * @return {Promise} []
                                                                                                                                                                                              */
    post: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(path, content) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:return _context4.abrupt('return',
                            this.get(path, content, 'POST'));case 1:case 'end':return _context4.stop();}}}, _callee4, this);}));function post(_x10, _x11) {return _ref4.apply(this, arguments);}return post;}(),

    /**
                                                                                                                                                                                                                  * get access_token
                                                                                                                                                                                                                  * @return {String} []
                                                                                                                                                                                                                  */
    accessToken: function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(refresh) {var token;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.t1 =

                            !refresh && this.access_token.expires_on > this.timestamp() && this.access_token;if (_context5.t1) {_context5.next = 8;break;}_context5.t2 =
                            !refresh;if (!_context5.t2) {_context5.next = 7;break;}_context5.next = 6;return this.cache.get('access_token');case 6:_context5.t2 = _context5.sent;case 7:_context5.t1 = _context5.t2;case 8:_context5.t0 = _context5.t1;if (_context5.t0) {_context5.next = 13;break;}_context5.next = 12;return (
                                this.get('/cgi-bin/gettoken?corpid=CORPID&corpsecret=APPSECRET'));case 12:_context5.t0 = _context5.sent;case 13:token = _context5.t0;

                            if (token.access_token) {
                                if (token.expires_in) {
                                    token.expires_in = 0;
                                    token.expires_on = this.timestamp(7140);
                                    this.cache.set('access_token', token);
                                }
                                this.access_token = token;
                            }return _context5.abrupt('return',
                            token);case 16:case 'end':return _context5.stop();}}}, _callee5, this);}));function accessToken(_x12) {return _ref5.apply(this, arguments);}return accessToken;}() };



for (var name in libs) {
    workwechat.prototype[name] = libs[name];
}

module.exports = workwechat;