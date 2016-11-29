'use strict';

import xml2js from 'xml2js';
import ejs from 'ejs';
import WXBizMsgCrypt from 'wechat-crypto';

/*!
 * 响应模版
 */
var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '<% if (content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

var wrapTpl = '<xml>' +
  '<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' +
  '<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' +
  '<TimeStamp><%-timestamp%></TimeStamp>' +
  '<Nonce><![CDATA[<%-nonce%>]]></Nonce>' +
'</xml>';

var encryptWrap = ejs.compile(wrapTpl);

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
var formatMessage = function (result) {
  var message = {};
  if (typeof result === 'object') {
    for (var key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue;
      }
      if (result[key].length === 1) {
        var val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        result[key].forEach(function (item) {
          message[key].push(formatMessage(item));
        });
      }
    }
  }
  return message;
};

/*!
 * 将内容回复给微信的封装方法
 */
var reply = function (content, fromUsername, toUsername, message) {
  var info = {};
  var type = 'text';
  info.content = content || '';
  info.createTime = new Date().getTime();
  if (message && (message.MsgType === 'device_text' || message.MsgType === 'device_event')) {
    info.DeviceType = message.DeviceType;
    info.DeviceID = message.DeviceID;
    info.SessionID = isNaN(message.SessionID) ? 0 : message.SessionID;
    info.createTime = Math.floor(info.createTime / 1000);
    if (message['Event'] === 'subscribe_status' || message['Event'] === 'unsubscribe_status') {
      delete info.content;
      info.DeviceStatus = isNaN(content) ? 0 : content;
    } else {
      if (!(content instanceof Buffer)) {
        content = String(content);
      }
      info.content = new Buffer(content).toString('base64');
    }
    type = message.MsgType;
    if (message.MsgType === 'device_event') {
      info['Event'] = message['Event'];
    }
  } else if (Array.isArray(content)) {
    type = 'news';
  } else if (typeof content === 'object') {
    if (content.hasOwnProperty('type')) {
      type = content.type;
      if (content.content) {
        info.content = content.content;
      }
      if (content.HardWare) {
        info.HardWare = content.HardWare;
      }
    } else {
      type = 'music';
    }
  }
  info.msgType = type;
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  return compiled(info);
};

var reply2CustomerService = function (fromUsername, toUsername, kfAccount) {
  var info = {};
  info.msgType = 'transfer_customer_service';
  info.createTime = new Date().getTime();
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  info.content = {};
  if (typeof kfAccount === 'string') {
    info.content.kfAccount = kfAccount;
  }
  return compiled(info);
};

module.exports = function() {
    var _self = this;
    this.middle = think.Class(think.http.base, {
        run: function* () {
            let http = this.http;
            if(http.pathname != _self.options.pathname) {
                return;
            }
            let signature = http.get('signature');
            let timestamp = http.get('timestamp');
            let nonce = http.get('nonce');
            let echostr = http.get('echostr');

            let token = _self.options.token;
            let tmpArr = [token, timestamp, nonce];
            let tmpStr = sha1(tmpArr.sort().join(''));

            if( tmpStr != signature ){
                http.status(401);
                return http.end('Invalid signature');
            }
            if(http.isGet()) {
                return http.end(echostr);
            }
            let encrypt_type = http.get('encrypt_type');
            let cryptor = new WXBizMsgCrypt(_self.options.token, _self.options.encodingAESKey, _self.options.appid);
            let _wait = yield _self.session.get('wechatapiWait');
            return http.getPayload().then(async payload => {
                try {
                    var buff = new Buffer(payload);
                    buff = buff.toString('utf-8');
                    xml2js.parseString(buff, {trim: true}, function (err, result) {
                        var xml = formatMessage(result.xml);
                        if(encrypt_type && xml.Encrypt) {
                            var encryptMessage = xml.Encrypt;
                            var decrypted = cryptor.decrypt(encryptMessage);
                            var messageWrapXml = decrypted.message;
                            xml2js.parseString(messageWrapXml, {trim: true}, function (err, result) {
                                http.weixin = formatMessage(result.xml);
                            });
                        } else {
                            http.weixin = xml;
                        }
                    });
                    let message = http.weixin;
                    function encryptXml(xml) {
                        if (!encrypt_type || encrypt_type === 'raw') {
                            return xml;
                        } else {
                            // 判断是否已有前置cryptor
                            var wrap = {};
                            wrap.encrypt = cryptor.encrypt(xml);
                            wrap.nonce = parseInt((Math.random() * 100000000000), 10);
                            wrap.timestamp = new Date().getTime();
                            wrap.signature = cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
                            return encryptWrap(wrap);
                        }
                    }
                    http.reply = function (content) {
                        // 响应空字符串，用于响应慢的情况，避免微信重试
                        if (!content) {
                            return http.end('');
                        }

                        return http.end(encryptXml(reply(content, message.ToUserName, message.FromUserName, message)));
                    };
                    // 响应消息，转到客服模式
                    http.transfer2CustomerService = function (kfAccount) {
                        return http.end(encryptXml(reply2CustomerService(message.ToUserName, message.FromUserName, kfAccount)));
                    };

                    http.wait = function* (content) {
                        var description = [];
                        var list = {};
                        if(typeof content == 'object') {
                            for(let text in content) {
                                var replaced = text.replace(/\{(.*)\}/, function (match, key) {
                                    list[key] = content[text];
                                    return key;
                                });
                                description.push(replaced);
                            }
                        }
                        description = description.join('\n');
                        yield _self.session.set('wechatapiWait', list);
                        return http.reply(description);
                    };

                    if(_wait && message.MsgType === 'text') {
                        if(_wait[message.Content]) {
                            http.reply(_wait[message.Content]);
                            return think.prevent();
                        } else {
                            await _self.session.delete('wechatapiWait');
                        }
                    }

                    if(message.MsgType === 'event' && message.Event === 'TEMPLATESENDJOBFINISH') {
                        _self.model.push_log.where({"MsgID": Number(message.MsgID)}).update({"CreateTime": message.CreateTime, "Status": message.Status})
                        .then(function(data) {

                        }, function(error) {

                        });
                    }

                    if(message.MsgType === 'event' && message.Event === 'subscribe') {
                        _self.model.users.where({"openid": message.FromUserName}).update({"subscribe": 1, "subscribe_time": message.CreateTime, "unsubscribe_time": ""})
                        .then(function(data) {

                        }, function(error) {

                        });
                    }

                    if(message.MsgType === 'event' && message.Event === 'unsubscribe') {
                        _self.model.users.where({"openid": message.FromUserName}).update({"subscribe": 0, "unsubscribe_time": message.CreateTime})
                        .then(function(data) {

                        }, function(error) {

                        });
                    }

                } catch(e) {
                    http.status(501);
                    return http.end('Not Implemented');
                }
            });
        }
    });
};