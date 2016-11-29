# work-wechat

![NPM version](https://badge.fury.io/js/work-wechat.svg)
![Downloads](http://img.shields.io/npm/dm/work-wechat.svg?style=flat)

## Install

```
npm install work-wechat
```

## How to use

### init
```js
var workapi = require('work-wechat');

global.workwechat = new workapi({
    token: 'xxxxxxxxxxxxxxx',
    corpid: 'wx1234567890abcdef',
    appsecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    encodingAESKey: '1234567890abcdefghijklmnopqrstuvxyz12345678',
    AESKey: '1234567890abcdef',
    iv: '1234567890123456',
    pathname: 'api'
});
```

## 各种接口

### 成员管理
```js
let user_info = {
   "userid": "zhangsan",
   "name": "张三",
   "english_name": "jackzhang"
   "mobile": "15913215421",
   "department": [1, 2],
   "order":[10,40],
   "position": "产品经理",
   "gender": "1",
   "email": "zhangsan@gzdev.com",
   "isleader": 1,
   "avatar_mediaid": "2-G6nrLmr5EC3MNb_-zL1dDdzkd0p7cNliYu9V5w7o8K0",
   "telephone": "020-123456"，
   "extattr": {"attrs":[{"name":"爱好","value":"旅游"},{"name":"卡号","value":"1234567234"}]}
}
let new_user = await workwechat.user.create(user_info);
//OR
workwechat.user.create(user_info)
.then(function(result) {
  console.log(result);
});
```
### 读取成员
```js
let one_user = await workwechat.user.get(userid);
console.log(one_user);
//OR
workwechat.user.get(userid)
.then(function(one_user) {
  console.log(one_user);
});
```

# 其他接口说明待完善，作者很懒，不要期待。

## LICENSE

MIT