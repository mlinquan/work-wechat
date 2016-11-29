'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);

var _xml2js = require('xml2js');var _xml2js2 = _interopRequireDefault(_xml2js);
var _ejs = require('ejs');var _ejs2 = _interopRequireDefault(_ejs);
var _wechatCrypto = require('wechat-crypto');var _wechatCrypto2 = _interopRequireDefault(_wechatCrypto);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

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
var compiled = _ejs2.default.compile(tpl);

var wrapTpl = '<xml>' +
'<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' +
'<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' +
'<TimeStamp><%-timestamp%></TimeStamp>' +
'<Nonce><![CDATA[<%-nonce%>]]></Nonce>' +
'</xml>';

var encryptWrap = _ejs2.default.compile(wrapTpl);

/*!
                                                   * 将xml2js解析出来的对象转换成直接可访问的对象
                                                   */
var formatMessage = function formatMessage(result) {
  var message = {};
  if ((typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) === 'object') {
    for (var key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue;
      }
      if (result[key].length === 1) {
        var val = result[key][0];
        if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object') {
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
var reply = function reply(content, fromUsername, toUsername, message) {
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
  } else if ((typeof content === 'undefined' ? 'undefined' : (0, _typeof3.default)(content)) === 'object') {
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

var reply2CustomerService = function reply2CustomerService(fromUsername, toUsername, kfAccount) {
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

module.exports = function () {
  var _self = this;
  this.middle = think.Class(think.http.base, {
    run: _regenerator2.default.mark(function run() {var _this = this;var http, signature, timestamp, nonce, echostr, token, tmpArr, tmpStr, encrypt_type, cryptor, _wait;return _regenerator2.default.wrap(function run$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
              http = this.http;if (!(
              http.pathname != _self.options.pathname)) {_context4.next = 3;break;}return _context4.abrupt('return');case 3:


              signature = http.get('signature');
              timestamp = http.get('timestamp');
              nonce = http.get('nonce');
              echostr = http.get('echostr');

              token = _self.options.token;
              tmpArr = [token, timestamp, nonce];
              tmpStr = sha1(tmpArr.sort().join(''));if (!(

              tmpStr != signature)) {_context4.next = 13;break;}
              http.status(401);return _context4.abrupt('return',
              http.end('Invalid signature'));case 13:if (!

              http.isGet()) {_context4.next = 15;break;}return _context4.abrupt('return',
              http.end(echostr));case 15:

              encrypt_type = http.get('encrypt_type');
              cryptor = new _wechatCrypto2.default(_self.options.token, _self.options.encodingAESKey, _self.options.appid);_context4.next = 19;return (
                _self.session.get('wechatapiWait'));case 19:_wait = _context4.sent;return _context4.abrupt('return',
              http.getPayload().then(function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(payload) {var buff, _ret;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {var

















                            encryptXml = function encryptXml(xml) {
                              if (!encrypt_type || encrypt_type === 'raw') {
                                return xml;
                              } else {
                                // 判断是否已有前置cryptor
                                var wrap = {};
                                wrap.encrypt = cryptor.encrypt(xml);
                                wrap.nonce = parseInt(Math.random() * 100000000000, 10);
                                wrap.timestamp = new Date().getTime();
                                wrap.signature = cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
                                return encryptWrap(wrap);
                              }
                            };var message;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:buff = new Buffer(payload);buff = buff.toString('utf-8');_xml2js2.default.parseString(buff, { trim: true }, function (err, result) {var xml = formatMessage(result.xml);if (encrypt_type && xml.Encrypt) {var encryptMessage = xml.Encrypt;var decrypted = cryptor.decrypt(encryptMessage);var messageWrapXml = decrypted.message;_xml2js2.default.parseString(messageWrapXml, { trim: true }, function (err, result) {http.weixin = formatMessage(result.xml);});} else {http.weixin = xml;}});message = http.weixin;
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

                                    http.wait = _regenerator2.default.mark(function _callee(content) {var description, list, _loop, text, replaced;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                              description = [];
                                              list = {};
                                              if ((typeof content === 'undefined' ? 'undefined' : (0, _typeof3.default)(content)) == 'object') {_loop = function _loop(
                                                text) {
                                                  replaced = text.replace(/\{(.*)\}/, function (match, key) {
                                                    list[key] = content[text];
                                                    return key;
                                                  });
                                                  description.push(replaced);};for (text in content) {_loop(text);
                                                }
                                              }
                                              description = description.join('\n');_context.next = 6;return (
                                                _self.session.set('wechatapiWait', list));case 6:return _context.abrupt('return',
                                              http.reply(description));case 7:case 'end':return _context.stop();}}}, _callee, this);});if (!(


                                    _wait && message.MsgType === 'text')) {_context2.next = 15;break;}if (!
                                    _wait[message.Content]) {_context2.next = 13;break;}
                                    http.reply(_wait[message.Content]);return _context2.abrupt('return', { v:
                                      think.prevent() });case 13:_context2.next = 15;return (

                                      _self.session.delete('wechatapiWait'));case 15:



                                    if (message.MsgType === 'event' && message.Event === 'TEMPLATESENDJOBFINISH') {
                                      _self.model.push_log.where({ "MsgID": Number(message.MsgID) }).update({ "CreateTime": message.CreateTime, "Status": message.Status }).
                                      then(function (data) {

                                      }, function (error) {

                                      });
                                    }

                                    if (message.MsgType === 'event' && message.Event === 'subscribe') {
                                      _self.model.users.where({ "openid": message.FromUserName }).update({ "subscribe": 1, "subscribe_time": message.CreateTime, "unsubscribe_time": "" }).
                                      then(function (data) {

                                      }, function (error) {

                                      });
                                    }

                                    if (message.MsgType === 'event' && message.Event === 'unsubscribe') {
                                      _self.model.users.where({ "openid": message.FromUserName }).update({ "subscribe": 0, "unsubscribe_time": message.CreateTime }).
                                      then(function (data) {

                                      }, function (error) {

                                      });
                                    }case 18:case 'end':return _context2.stop();}}}, _callee2, _this);})(), 't0', 2);case 2:_ret = _context3.t0;if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {_context3.next = 5;break;}return _context3.abrupt('return', _ret.v);case 5:_context3.next = 11;break;case 7:_context3.prev = 7;_context3.t1 = _context3['catch'](0);


                          http.status(501);return _context3.abrupt('return',
                          http.end('Not Implemented'));case 11:case 'end':return _context3.stop();}}}, _callee3, _this, [[0, 7]]);}));return function (_x) {return _ref.apply(this, arguments);};}()));case 21:case 'end':return _context4.stop();}}}, run, this);}) });




};