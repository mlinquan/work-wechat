'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function () {
    var _self = this;
    this.department = {
        /* 创建部门
                        {
                           "name": "广州研发中心",
                           "parentid": 1,
                           "order": 1,
                           "id": 2
                        }*/
        create: function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt('return',
                                _self.post('/cgi-bin/department/create?access_token=ACCESS_TOKEN', data));case 1:case 'end':return _context.stop();}}}, _callee, this);}));function create(_x) {return _ref.apply(this, arguments);}return create;}(),

        /* 更新部门
                                                                                                                                                                                                                                                       {
                                                                                                                                                                                                                                                          "id": 2,
                                                                                                                                                                                                                                                          "name": "广州研发中心",
                                                                                                                                                                                                                                                          "parentid": 1,
                                                                                                                                                                                                                                                          "order": 1
                                                                                                                                                                                                                                                       }*/
        update: function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(data) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:return _context2.abrupt('return',
                                _self.post('/cgi-bin/department/update?access_token=ACCESS_TOKEN', data));case 1:case 'end':return _context2.stop();}}}, _callee2, this);}));function update(_x2) {return _ref2.apply(this, arguments);}return update;}(),

        //删除部门
        delete: function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(id) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:return _context3.abrupt('return',
                                _self.get('/cgi-bin/department/delete?access_token=ACCESS_TOKEN&id=' + id));case 1:case 'end':return _context3.stop();}}}, _callee3, this);}));function _delete(_x3) {return _ref3.apply(this, arguments);}return _delete;}(),

        //获取部门列表
        list: function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(id) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                                id = id || '';return _context4.abrupt('return',
                                _self.get('/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=' + id));case 2:case 'end':return _context4.stop();}}}, _callee4, this);}));function list(_x4) {return _ref4.apply(this, arguments);}return list;}() };


};