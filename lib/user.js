'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function () {
    var _self = this;
    this.user = {
        /* 创建成员
                  {
                      //必填项
                      "userid": "zhangsan",
                      "name": "张三",
                      "english_name": "jackzhang"
                      "mobile": "15913215421",
                      "department": [1, 2],
                      //非必填项
                      "order":[10,40],
                      "position": "产品经理",
                      "gender": "1",
                      "email": "zhangsan@gzdev.com",
                      "isleader": 1,
                      "avatar_mediaid": "2-G6nrLmr5EC3MNb_-zL1dDdzkd0p7cNliYu9V5w7o8K0",
                      "telephone": "020-123456"，
                      "extattr": {"attrs":[{"name":"爱好","value":"旅游"},{"name":"卡号","value":"1234567234"}]}
                  }
                  */
        create: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt('return',
                                _self.post('/cgi-bin/user/create?access_token=ACCESS_TOKEN', data));case 1:case 'end':return _context.stop();}}}, _callee, this);}));function create(_x) {return _ref.apply(this, arguments);}return create;}(),

        //读取成员
        get: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(userid) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:return _context2.abrupt('return',
                                _self.get('/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=' + userid));case 1:case 'end':return _context2.stop();}}}, _callee2, this);}));function get(_x2) {return _ref2.apply(this, arguments);}return get;}(),

        //更新成员
        update: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(data) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:return _context3.abrupt('return',
                                _self.post('/cgi-bin/user/update?access_token=ACCESS_TOKEN', data));case 1:case 'end':return _context3.stop();}}}, _callee3, this);}));function update(_x3) {return _ref3.apply(this, arguments);}return update;}(),

        //删除成员
        delete: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(userid) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:return _context4.abrupt('return',
                                _self.get('/cgi-bin/user/delete?access_token=ACCESS_TOKEN&userid=' + userid));case 1:case 'end':return _context4.stop();}}}, _callee4, this);}));function _delete(_x4) {return _ref4.apply(this, arguments);}return _delete;}(),

        /*
                                                                                                                                                                                                                                                                 批量删除成员
                                                                                                                                                                                                                                                                 {
                                                                                                                                                                                                                                                                     "useridlist": ["zhangsan", "lisi"]
                                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                                                                 */
        batchdelete: function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(useridlist) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                                if (think.isArray(useridlist)) {
                                    useridlist = { "useridlist": useridlist };
                                }return _context5.abrupt('return',
                                _self.post('/cgi-bin/user/batchdelete?access_token=ACCESS_TOKEN', useridlist));case 2:case 'end':return _context5.stop();}}}, _callee5, this);}));function batchdelete(_x5) {return _ref5.apply(this, arguments);}return batchdelete;}(),

        //获取部门成员
        simplelist: function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(department_id, fetch_child, status) {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                                fetch_child = fetch_child || 0;
                                status = status || 0;return _context6.abrupt('return',
                                _self.get('/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=' + department_id + '&fetch_child=' + fetch_child + '&status=' + status));case 3:case 'end':return _context6.stop();}}}, _callee6, this);}));function simplelist(_x6, _x7, _x8) {return _ref6.apply(this, arguments);}return simplelist;}(),

        //获取部门成员详情
        list: function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(department_id, fetch_child, status) {return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                                fetch_child = fetch_child || 0;
                                status = status || 0;return _context7.abrupt('return',
                                _self.get('/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=' + department_id + '&fetch_child=' + fetch_child + '&status=' + status));case 3:case 'end':return _context7.stop();}}}, _callee7, this);}));function list(_x9, _x10, _x11) {return _ref7.apply(this, arguments);}return list;}(),

        //获取所有成员列表
        all_simplelist: function () {var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:return _context8.abrupt('return',
                                this.simplelist(1, 1));case 1:case 'end':return _context8.stop();}}}, _callee8, this);}));function all_simplelist() {return _ref8.apply(this, arguments);}return all_simplelist;}(),

        //获取所有成员详情
        all_list: function () {var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:return _context9.abrupt('return',
                                this.list(1, 1));case 1:case 'end':return _context9.stop();}}}, _callee9, this);}));function all_list() {return _ref9.apply(this, arguments);}return all_list;}() };


};